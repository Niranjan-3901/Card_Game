import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { RxAvatar } from "react-icons/rx";
import "../styles/GameBoard.css";
import BiddingPanel from './BiddingPanel';
import CardForAPlayer from './CardForAPlayer';
import DropZone from './DropZone';
import { TrumpSelectorPopup } from './TurnTrumpSelect';

const GameBoard = ({ playerDetails, gameState, playername, socket, higherOrderFunctions, roomId }) => {
    const [showBid, setShowBid] = useState(false);
    const [passedPlayers, setPassedPlayers] = useState([]);
    const [showTrumpSelector, setShowTrumpSelector] = useState(false);


    const handleTrumpSelected = (valObject) => {
        setShowTrumpSelector(false);
        socket.emit("trumpSelected", { roomId: roomId, playerId: socket.id, suit: valObject.suit });
    }

    useEffect(() => {
        if (!passedPlayers.includes(socket.id)) {
            const timer = setTimeout(() => setShowBid(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [passedPlayers, socket.id]);

    useEffect(() => {
        socket.on("bidUpdate", (data) => {
            if (!passedPlayers.includes(socket.id) && data.currentBidder !== socket.id) {
                setShowBid(true);
            }
        });

        socket.on('updatePassCount', ({ passedPlayer }) => {
            setPassedPlayers(passedPlayer);
        });

        socket.on('biddingEnded', () => {
            setShowBid(false);
            setShowTrumpSelector(true);
        });

        return () => {
            socket.off("bidUpdate");
            socket.off("updatePassCount");
            socket.off("biddingEnded");
        }
    }, [socket, passedPlayers]);

    const handlePassForBid = () => {
        setShowBid(false);
        socket.emit("bidPassed", { roomId: roomId, playerId: socket.id });
    }

    return (
        <div className='gameBoardContainer'>

            {(showBid && !passedPlayers.includes(socket.id)) &&
                <BiddingPanel
                    visible={showBid}
                    onBid={(bid) => {
                        higherOrderFunctions.handleBid(bid, setShowBid);
                    }}
                    onClose={() => setShowBid(true)}
                    gameState={{ ...gameState, myId: socket.id }}
                    onPass={handlePassForBid}
                />
            }



            {(showTrumpSelector && gameState.currentBidder === socket.id) &&
                <TrumpSelectorPopup
                    onTrumpSelected={handleTrumpSelected}
                    onclose={setShowTrumpSelector}
                />
            }
            {playerDetails.find(p => p.id == socket.id)?.circlePlayers?.map((p, i) => (
                <div
                    key={i}
                    className={`player${i + 1}cards otherPlayerCard`}>
                    <div
                        className={`${(gameState.currentTurn?.id === p && gameState?.globalTrump !== "") ? "playerTurn" : ""}`}
                        title={playerDetails.find(player => player.id === p)?.name}>
                        <Typography.Text
                            strong
                            className='playerNames'>
                            {playerDetails.find(player => player.id === p)?.name}
                        </Typography.Text>
                        <RxAvatar style={{ width: "200px", height: "200px", color: "#ddd" }} />
                    </div>
                </div>
            ))}

            <DropZone
                roomId={roomId}
                currentTurnId={gameState.currentTurn.id}
                currentTurnName={gameState.currentTurn.name}
                isTrumpSelected={!showTrumpSelector}
            />
            {(gameState.currentTurn?.id === socket.id && gameState?.globalTrump !== "") && (
                <div className="turnNotification">
                    <p>It's your turn! Please select a card.</p>
                </div>
            )}
            <CardForAPlayer
                player={playerDetails.find(item => item.name === playername)?.cards || []}
                isMyTurn={gameState.currentTurn.id === socket.id}
                turnTrump={gameState.turnTrump || ""}
                droppedCards=""
            />
        </div>
    )
}

export default GameBoard;
