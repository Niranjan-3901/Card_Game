import React, { useEffect, useMemo, useState } from 'react';
import "../styles/CardForAPlayer.css";
import { socket } from '../utils/socket';
import DraggableCard from './DraggableCard';

const cardValueMap = {
  "A": 14,
  "K": 13,
  "Q": 12,
  "J": 11,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
};

const getCardValue = (card) => cardValueMap[card.value] || 0;

function CardForAPlayer({ player, turnTrump, isMyTurn }) {
  const [droppedCards, setDroppedCards] = useState([]);

  useEffect(() => {
    socket.on("recieveCardDroppedEvent", ({ droppedCards }) => {
      setDroppedCards(droppedCards.map(item => item.card));
    });
  }, []);

  const highestDroppedCardValue = useMemo(() => {
    const turnTrumpDroppedCards = droppedCards.filter(card => card.suit === turnTrump);
    if (turnTrumpDroppedCards.length === 0) return 0;
    return Math.max(...turnTrumpDroppedCards.map(card => getCardValue(card)));
  }, [droppedCards, turnTrump]);

  const greaterCardsInTurnTrump = useMemo(() => {
    return player.filter(card => getCardValue(card) > highestDroppedCardValue && card.suit === turnTrump);
  }, [player, highestDroppedCardValue, turnTrump]);

  const trumpCardsInHand = useMemo(() => {
    return player.filter(card => card.suit === turnTrump);
  }, [player, turnTrump]);

  const hasTurnTrumpCard = useMemo(() => trumpCardsInHand.length > 0, [trumpCardsInHand]);

  const isCardEnabled = (card) => {
    if (!isMyTurn) return true;

    if (card.suit === "♠️" && card.value === "3") {
      return true;
    }

    if (droppedCards.find(card => card.suit === "♠️" && card.value === "3") && hasTurnTrumpCard) {
      return card.suit === turnTrump
    }

    if (greaterCardsInTurnTrump.length > 0) {
      return greaterCardsInTurnTrump.some(item => item.suit === card.suit && getCardValue(item) === getCardValue(card));
    }

    if (hasTurnTrumpCard) {
      return card.suit === turnTrump;
    }

    return true;
  };

  return (
    <div className="myCards">
      <div className="playerSet">
        {player.map((item, index) => {
          if (item) {
            const cardEnabled = isCardEnabled(item);
            return (
              <DraggableCard
                key={index}
                card={item}
                className={`
                  ${!(isMyTurn) && 'not_myTurn'}
                  ${cardEnabled ? 'enabledCard' : 'disabledCard'}
                `}
                style={{
                  pointerEvents: cardEnabled ? 'auto' : 'none',
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default CardForAPlayer;