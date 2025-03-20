import { Button, Card, Col, Modal, Row, Space, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import '../styles/PlayerTableAndChat.css';
import { socket } from '../utils/socket';
import PlayerCard from './EntryPlayerCard';

const { Title } = Typography;

const PlayerTable = ({ roomId, playersDetails, roomOwner }) => {
    const [players, setPlayers] = useState(playersDetails);
    const [swapTargetIndex, setSwapTargetIndex] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [temp_Player, setTempPlayer] = useState(players.find(p => p.id === "Temp_player"));

    const handleReadyClick = (player) => {
        socket.emit('readyPlayer', { roomId, playerId: player.id, value: player.isReady ? false : true })
        player.isReady ? message.error('Ready Cancelled...') : message.success('Player Ready...')
    };

    const handleSwapClick = (index) => {
        if (players.find(player => player.id === socket.id)?.isReady) {
            return message.error("You can't swap after Ready!");
        }
        if (players[index].name === "") {
            setSwapTargetIndex(index);
            setIsModalVisible(true);
        }
    };

    const confirmSwap = () => {
        if (swapTargetIndex === -1 && !temp_Player) {
            console.warn("Unexpected swap scenario");
            setIsModalVisible(false);
            return;
        }

        if (temp_Player?.id === socket.id && swapTargetIndex !== -1) {
            socket.emit("swapBackToPermanent", { roomId, temp_Player, swappedIndexAt: swapTargetIndex });
        }
        else if (swapTargetIndex !== -1) {
            const index = players.findIndex(obj => obj.id === socket.id);
            socket.emit("updateSwappedPlayers", { roomId, myIndex: index, swapIndex: swapTargetIndex });
        }
        else if (temp_Player) {
            socket.emit("playerSwappedToTemporary", { roomId, playerId: socket.id });
        }

        setIsModalVisible(false);
    };

    useEffect(() => {
        if (playersDetails.length > 0) {
            setPlayers(playersDetails);
        }
    }, [playersDetails]);

    useEffect(() => {
        socket.on("updateTemporarySlot", (data) => {
            setTempPlayer(data);
        });

        return () => {
            socket.off("updateTemporarySlot");
        };
    }, []);

    const handleEveryoneReadyAndGameStart = () => {
        socket.emit("everyoneReady", {
            roomId: roomId,
            players: { G1: players.slice(0, 3), G2: players.slice(3, 6) }
        });
    };

    return (
        <div className="player-table-container">
            <Title level={3} className="table-title">Waiting for Players</Title>
            <Row gutter={[16, 16]} justify="center">
                <Col span={12} key={"G1"}>
                    <Title level={4} className="group-title">{"G1"}</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {Array.from({ length: 3 }, (_, i) => (
                            <PlayerCard
                                key={`G1-${i}`}
                                player={players[i]}
                                index={i}
                                onClick={handleSwapClick}
                                onReadyClick={handleReadyClick}
                            />
                        ))}
                    </Space>
                </Col>
                <Col span={12} key={"G2"}>
                    <Title level={4} className="group-title">{"G2"}</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {Array.from({ length: 3 }, (_, i) => (
                            <PlayerCard
                                key={`G2-${i}`}
                                player={players[3 + i]}
                                index={3 + i}
                                onClick={handleSwapClick}
                                onReadyClick={handleReadyClick}
                            />
                        ))}
                    </Space>
                </Col>
            </Row>

            <div className="temporary-slot-container">
                <Card className="temporary-slot" onClick={
                    () => {
                        if (players.find(player => player.id === socket.id)?.isReady) {
                            return message.error("You can't swap after Ready!");
                        }
                        setIsModalVisible(true)
                        setTempPlayer(players.find(p => p.id === socket.id))
                        setSwapTargetIndex(-1)
                    }
                }>
                    <Typography.Text strong className="temp-player-name">
                        {temp_Player ? temp_Player.name : "Swappable Temporary Slot"}
                    </Typography.Text>
                </Card>
            </div>

            {roomOwner.id === socket.id && (
                <Button
                    type="primary"
                    size='large'
                    className="start-game-button"
                    onClick={handleEveryoneReadyAndGameStart}
                    disabled={!players.every(player => (player.id !== "" && player.isReady))}
                >
                    Start Game
                </Button>
            )}

            <Modal
                title="Confirm Seat Swap"
                open={isModalVisible}
                onOk={confirmSwap}
                onCancel={() => setIsModalVisible(false)}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>Are you sure you want to swap to this seat?</p>
            </Modal>
        </div>
    );
};

export default PlayerTable;
