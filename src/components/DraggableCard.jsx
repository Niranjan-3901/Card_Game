import React from 'react';
import Card from './Card';

const DraggableCard = ({ card, className }) => {
    const handleDragStart = (event) => {
        const cardData = JSON.stringify(card);
        event.dataTransfer.setData('card', cardData);
    };

    return (
        <Card 
            card={card}
            className={className}
            draggable="true"
            onDragStart={handleDragStart}
        />
    );
};

export default DraggableCard;