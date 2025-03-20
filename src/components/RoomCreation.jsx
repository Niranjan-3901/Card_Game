import { Button, Card, Form, Input, message, Modal, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../utils/socket';
import Game from './Game';
import PlayerTableAndChat from './PlayerTableAndChat';
import CreateAndJoinModal from './CreateAndJoinModal';


const RoomCreation = () => {
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isJoinModalVisible, setJoinModalVisible] = useState(false);
    const [roomOwner, setRoomOwner] = useState({ id: "", name: "" });
    const [unReadyPlayers, setUnReadyPlayers] = useState(false);
    const [isEveryoneReadyForPlay, setEveryoneReadyForPlay] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [initialState, setInitialState] = useState({})
    const [playerUpdate, setPlayerUpdate] = useState(null)


    const handleRoomCreation = () => {
        setCreateModalVisible(true);
    }

    const handleRoomJoining = () => {
        setJoinModalVisible(true);
    }

    const handleCreateOk = (values) => {
        const { name, roomId, password } = values;
        if (name && roomId && password) {
            socket.emit('createRoom', { id: roomId, name: name, password: password });
            setCreateModalVisible(false);
        }
    }

    const handleJoinOk = (values) => {
        const { name, roomId, password } = values;
        socket.emit('joinRoom', { id: roomId, name, password });
        setJoinModalVisible(false);
    }

    const handleCreateCancel = () => {
        setCreateModalVisible(false);
    }

    const handleJoinCancel = () => {
        setJoinModalVisible(false);
    }

    const handleEveryoneReady = () => {
        setEveryoneReadyForPlay(true);
        setUnReadyPlayers([])
    }

    const clearRoomState = () => {
        setUnReadyPlayers([]);
        setRoomId(null);
        setRoomOwner({ id: "", name: "" });
        setInitialState({});
        setPlayerUpdate(null);
    };


    useEffect(() => {
        const handleRoomCreated = ({ joinedPlayers, roomId, owner }) => {
            setUnReadyPlayers(joinedPlayers);
            setRoomId(roomId);
            setRoomOwner(owner);
        };

        const handleNewPlayerJoined = ({ joinedPlayers, roomId, owner }) => {
            setUnReadyPlayers(joinedPlayers);
            setRoomId(roomId);
            setRoomOwner(owner);
        };

        const handleError = (msg) => {
            message.error(msg);
            setUnReadyPlayers([]);
        };

        const handleUnReadyPlayerDataUpdated = ({ joinedPlayers }) => {
            setUnReadyPlayers(joinedPlayers);
        };

        const handleDisconnectedMessage = ({ id }) => {
            message.error(`Player ${id} Disconnected...`);
        };

        const handleRoomClosed = () => {
            message.error("Room closed by owner");
            socket.emit('leaveRoom', roomId);
            clearRoomState();
        };

        const handlePlayerLeft = ({ name }) => {
            message.error(`${name} left the room...`);
            socket.emit('leaveRoom', roomId);
        };

        const handleGameStarted = ({ state, playerDetails }) => {
            setEveryoneReadyForPlay(true);
            setUnReadyPlayers([]);
            setInitialState(state)
            setPlayerUpdate(playerDetails)
        }

        // Attach listeners
        socket.on("roomCreated", handleRoomCreated);
        socket.on("newPlayerJoined", handleNewPlayerJoined);
        socket.on("error", handleError);
        socket.on("UnReadyPlayerDataUpdated", handleUnReadyPlayerDataUpdated);
        socket.on("playerDisconnected", handleDisconnectedMessage);
        socket.on("roomClosed", handleRoomClosed);
        socket.on("playerLeft", handlePlayerLeft);
        socket.on("gameStarted", handleGameStarted);

        // Clean up listeners on component unmount
        return () => {
            socket.off("roomCreated", handleRoomCreated);
            socket.off("newPlayerJoined", handleNewPlayerJoined);
            socket.off("error", handleError);
            socket.off("UnReadyPlayerDataUpdated", handleUnReadyPlayerDataUpdated);
            socket.off("playerDisconnected", handleDisconnectedMessage);
            socket.off("roomClosed", handleRoomClosed);
            socket.off("playerLeft", handlePlayerLeft);
            socket.off("gameStarted", handleGameStarted);
        };
    }, []);

    if (unReadyPlayers.length > 0) {
        return <PlayerTableAndChat roomId={roomId} roomOwner={roomOwner} playersDetails={unReadyPlayers} onReady={handleEveryoneReady} />
    }

    return (
        <div>
            {isEveryoneReadyForPlay ? <Game initialState={initialState} playerDetails={playerUpdate} /> : <>
                <Card
                    style={{
                        backgroundColor: '#e6f7ff',
                        textAlign: 'center',
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        height: "200px",
                        width: "400px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Space direction="horizontal" size="large">
                        <Button
                            variant="filled"
                            style={{ zIndex: 1000 }}
                            onClick={handleRoomCreation}
                        >
                            Create Room
                        </Button>
                        <Button
                            variant="filled"
                            style={{ zIndex: 1000 }}
                            onClick={handleRoomJoining}
                        >
                            Join Room
                        </Button>
                    </Space>
                </Card>

                <CreateAndJoinModal
                    title={"Create Room"}
                    open={isCreateModalVisible}
                    onCancel={handleCreateCancel}
                    onSubmit={handleCreateOk} 
                />

                <CreateAndJoinModal
                    title={"Join Room"}
                    open={isJoinModalVisible}
                    onCancel={handleJoinCancel}
                    onSubmit={handleJoinOk} 
                />
            </>}
        </div>
    )
}

export default RoomCreation;

