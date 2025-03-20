import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import Card from './Card';

const DropZone = ({ roomId, currentTurnId, currentTurnName }) => {
  const [droppedCards, setDroppedCards] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();

    if (socket.id !== currentTurnId) {
      message.info(`It's ${currentTurnName}'s turn! Please wait for your turn.`);
      return;
    }

    const cardData = event.dataTransfer.getData('card');
    let card;

    try {
      card = JSON.parse(cardData);
    } catch (error) {
      console.error('Invalid card data:', error);
      return;
    }

    if (!droppedCards.find((c) => c.value === card.value && c.suit === card.suit)) {
      const updatedDroppedCards = [...droppedCards, { card: card, playerId: socket.id }];

      if (droppedCards.length === 0) {
        socket.emit('setTurnTrump', { roomId: roomId, trump: card.suit });
      }

      setDroppedCards(updatedDroppedCards);

      socket.emit('reducePlayerCard', { roomId: roomId, playerId: socket.id, card: card });
      socket.emit('changePlayerTurn', { roomId: roomId, playerId: socket.id });

      socket.emit('emitCardDroppedEvent', {
        roomId: roomId,
        droppedCards: updatedDroppedCards,
      });

      if (updatedDroppedCards.length === 6) {
          socket.emit('calculateWinnerForTurn', {
            roomId: roomId,
            droppedCards: updatedDroppedCards,
          });

          socket.emit('clearDropZone', { roomId: roomId });
      }
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleReceiveCardDropped = (data) => {
      if (data.roomId === roomId) {
        setDroppedCards(data.droppedCards);
      }
    };

    const handleClearDropZone = (data) => {
      if (data.roomId === roomId) {
        setDroppedCards([]);
      }
    };

    socket.on('recieveCardDroppedEvent', handleReceiveCardDropped);
    socket.on('clearDropZone', handleClearDropZone);

    return () => {
      socket.off('recieveCardDroppedEvent', handleReceiveCardDropped);
      socket.off('clearDropZone', handleClearDropZone);
    };
  }, [roomId]);

  return (
    <div
      className="dropZone"
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {droppedCards.map((droppedCard, index) => (
        <div
          key={index}
          className="droppedCard"
          style={{ left: `${index * 60}px` }}
        >
          <Card card={droppedCard.card} className="dropZoneCard" />
        </div>
      ))}
    </div>
  );
};

export default DropZone;