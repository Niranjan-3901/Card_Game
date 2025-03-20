import { ClockCircleOutlined, TrophyOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Divider, Modal, Progress, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import "../styles/RoundEndedPopup.css";
import { socket } from '../utils/socket';


const { Title, Text } = Typography;

const RoundEndedPopup = ({
    lastWinnerGroup,
    roomId,
    negativePointGroup,
    negativePoints,
    currentDealerName,
    onClose,
    time
}) => {
    const initialCountdown = time || 10;
    const [countdown, setCountdown] = useState(initialCountdown);
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else {
            onClose();
            socket.emit("endedPopupCloseMakeReady", { roomId });
        }
    }, [countdown, onClose]);

    return (
        <Modal
            open={true}
            footer={null}
            closable={false}
            centered
            maskClosable={false} // Prevent closing on mask click
            keyboard={false} // Prevent closing with ESC key
            style={{ padding: 0, textAlign: 'center', borderRadius: '15px', overflow: 'hidden' }}
            className="round-ended-popup"
        >
            <div className="popup-header">
                <Title level={3} >🎉 Round Ended</Title>
            </div>

            <Card
                bordered={false}
                style={{ borderRadius: '15px', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}
            >
                <div className="popup-details">
                    <div className="popup-row">
                        <div className="rowText">
                            <TrophyOutlined className="icon icon-success" />
                            <Text strong>Last Winner Group: </Text>
                        </div>
                        <div className="values">
                            <Text className="winner-group" type="success">{lastWinnerGroup ? `Group ${lastWinnerGroup}` : "-"}</Text>
                        </div>
                    </div>

                    <Divider dashed />

                    <div className="popup-row">
                        <div className="rowText">
                            <WarningOutlined className="icon icon-warning" />
                            <Text strong>Group with Negative Points: </Text>
                        </div>
                        <div className="values">
                            <Text className="negative-group" type="warning">Group {negativePointGroup}</Text>
                        </div>
                    </div>

                    <Divider dashed />

                    <div className="popup-row">
                        <div className="rowText">
                            <UserOutlined className="icon icon-danger" />
                            <Text strong>Negative Points: </Text>
                        </div>
                        <div className="values">
                            <Text className="negative-points" type="danger">{negativePoints}</Text>
                        </div>
                    </div>

                    <Divider dashed />

                    <div className="popup-row">
                        <div className="rowText">
                            <UserOutlined className="icon icon-secondary" />
                            <Text strong>Dealer Name: </Text>
                        </div>
                        <div className="values">
                            <Text className="dealer-name" type="secondary">{currentDealerName}</Text>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="countdown-timer">
                <div className="timerTexts">
                    <ClockCircleOutlined className="icon-timer" />
                    <Text strong>Next round starts in</Text>
                    <Text strong className="countdown">{countdown}</Text>
                    <Text>seconds</Text>
                </div>

                <Progress
                    percent={countdown / initialCountdown * 100}
                    showInfo={false}
                    strokeColor="#4caf50"
                    trailColor="#f0f0f0"
                />
            </div>
        </Modal>
    );
};

export default RoundEndedPopup;
