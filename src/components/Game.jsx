import { Button, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import GameStartTimer from './GameStartTimer';
import RoundEndedPopup from './RoundEndedPopup';

const Game = ({ initialState, playerDetails }) => {
  const [gameState, setGameState] = useState(initialState);
  const [playerName, setPlayerName] = useState(playerDetails.find(p => p.id === socket.id)?.name)
  const [roomId, setRoomId] = useState(playerDetails.find(p => p.id === socket.id)?.roomId)
  const [playersDetails, setPlayerDetails] = useState(playerDetails);
  const [showDetails, setShowDetails] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [showRoundEndedPopup, setShowRoundEndedPopup] = useState(false);
  const [timerStarted, setTimerStarted] = useState(true);

  useEffect(() => {
    socket.on("playerUpdate", playersDetails => {
      setPlayerDetails(playersDetails);
      setPlayerName(playersDetails.find(player => player.id === socket.id).name);
      setRoomId(playersDetails.find(player => player.id === socket.id).roomId);
    });

    socket.on("gameUpdate", (newState) => {
      setGameState(newState);
    });

    socket.on("gameRestarted", ({ gameState }) => {
      setGameState(gameState);
      setStartGame(false);
      setShowRoundEndedPopup(true);
    });

    socket.on("playerDisconnected", () => {
      message.error("A player has disconnected. Game will be closed.");
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("playerUpdate");
      socket.off("gameRestarted");
      socket.off("playerDisconnected");
    };
  }, [socket, timerStarted]);

  const handleBid = (bid, closePopup) => {
    socket.emit("placeBid", { roomId, bid });
    closePopup(false);
  };

  const handlePopupClose = useCallback(() => {
    setShowRoundEndedPopup(false);
    setShowTimer(true);
    setTimerStarted(true);
  }, []);

  const handleGameStart = useCallback(() => {
    setStartGame(true);
    setShowTimer(false);
  }, []);

  const handleRequestedForNextDealer = () => {
    socket.emit("requestForNextDealer", { roomId, requestedPlayer: socket.id });
    message.success("Requested Successful for Next Dealer.")
  }


  const shouldRenderButton = () => {
    const player = playersDetails?.find(item => item.name === playerName);
    if (!player) return false;

    const isFriend = player.friendsObjWithId?.some(friend => friend.id === (gameState.currentDealer || ""));
    const isNotCurrentPlayer = gameState.currentDealer !== socket.id;

    return isFriend && isNotCurrentPlayer &&
      <Button
        variant="filled"
        style={{
          zIndex: 1000,
          position: "absolute",
          top: "50px",
          left: "225px"
        }}
        onClick={handleRequestedForNextDealer}
      >
        Request To Be Next Dealer
      </Button>;
  };

  return (
    <div className="game-container">
      <Button
        variant='filled'
        style={{
          zIndex: 1000,
          position: "absolute",
          top: "50px",
          left: "75px"
        }}
        onClick={() => setShowDetails(!showDetails)}
      >
        Show Game Info
      </Button>

      {shouldRenderButton()}

      <GameInfo
        gameState={gameState}
        socket={socket}
        playerDetail={playersDetails.find(item => item.name === playerName)}
        visible={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {showTimer &&
        <GameStartTimer
          key={showTimer ? 'timer-active' : 'timer-inactive'}
          currentDealer={gameState?.currentDealerName}
          onGameStart={handleGameStart}
        />
      }

      {showRoundEndedPopup &&
        <RoundEndedPopup
          roomId={roomId}
          lastWinnerGroup={gameState.lastWinnerGroupName}
          negativePointGroup={Object.keys(gameState.negPointsOn)[0]}
          negativePoints={Object.values(gameState.negPointsOn)[0]}
          currentDealerName={gameState.currentDealerName}
          onClose={handlePopupClose}
          time={7}
        />
      }
      {startGame &&
        <GameBoard
          playerDetails={playersDetails}
          gameState={gameState}
          playername={playerName}
          socket={socket}
          higherOrderFunctions={{ "handleBid": handleBid }}
          roomId={roomId} />
      }
    </div>
  )
};

export default Game;
