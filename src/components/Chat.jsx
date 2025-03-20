import { SendOutlined } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import '../styles/Chat.css';
import { socket } from '../utils/socket';

const { Title, Text } = Typography;

const ChatBox = ({ roomId }) => {
    
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            const messageData = {
                id: socket.id,
                text: messageInput,
                timestamp: new Date().toLocaleTimeString() 
            };
            socket.emit('sendMessage', { roomId, message: messageData });
            setMessageInput('');
        }
    };

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setChatMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    return (
        <div className="chat-container">
            <Title level={4} className="chat-title">Chat</Title>

            <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat-message ${msg.id === socket.id ? 'self' : 'other'}`}
                    >
                        <div className="chat-sender">
                            <Text strong>{msg.sender}</Text>
                            <Text className="chat-timestamp">{msg.timestamp}</Text>
                        </div>
                        <div className="chat-text">
                            <Text>{msg.text}</Text>
                        </div>
                    </div>
                ))}
            </div>

            <Input
                className="chat-input"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onPressEnter={handleSendMessage}
                addonAfter={<SendOutlined onClick={handleSendMessage} />}
            />
        </div>
    );
};

export default ChatBox;
