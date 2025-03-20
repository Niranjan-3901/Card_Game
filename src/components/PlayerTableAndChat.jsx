import React from 'react';
import '../styles/PlayerTableAndChat.css';
import ChatBox from './Chat';
import PlayerTable from './PlayerTable';

const PlayerTableAndChat = ({ roomId, playersDetails, roomOwner }) => {
    return (
        <div className="table-and-chat-container">
            <ChatBox roomId={roomId} />
            <PlayerTable roomId={roomId} playersDetails={playersDetails} roomOwner={roomOwner} />
        </div>
    );
};

export default PlayerTableAndChat;
