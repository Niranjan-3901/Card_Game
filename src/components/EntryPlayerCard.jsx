    import { CheckCircleFilled } from '@ant-design/icons';
    import { Button, Card, Space, Typography } from 'antd';
    import React from 'react';
    import { socket } from '../utils/socket';

    const PlayerCard = ({ player, index, onClick, onReadyClick }) => {

        return (
            <Card className="player-card" onClick={() => onClick(index)}>
                <Space direction="vertical" size="small">
                    <Typography.Text strong className="player-name">
                        {player.name ? player.name : 'Waiting...'}
                        {player?.isReady && <CheckCircleFilled className="player-ready-icon" />}
                    </Typography.Text>

                    {player?.id === socket.id && (
                        <Button
                            type="primary"
                            className="player-ready-button"
                            onClick={() => onReadyClick(player)}
                            style={{ backgroundColor: `${player.isReady ? '#52c41a' : '#1890ff'}` }}
                        >
                            {player.isReady ? 'Ready' : 'Not Ready'}
                        </Button>
                    )}
                </Space>
            </Card>
        );
    };

    export default PlayerCard;
