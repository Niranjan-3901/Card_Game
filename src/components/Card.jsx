import { useEffect, useRef, useState } from "react";

const SuitMapping = { "♠️": "Hukum", "♥️": "Heart", "♣️": "Spade", "♦️": "Block" }

export default function Card({ card, className, draggable, onDragStart }) {
    const [image, setImage] = useState();
    const cardRef = useRef(null);

    useEffect(() => {
        const suit = SuitMapping[card.suit];
        import(`../assets/${suit}/${suit}_${card.value}.svg`).then((img) => {
            setImage(img.default);
        });
    }, [card]);


    return (
        <div
            className={`card ${className && className}`}
            ref={cardRef}
            style={{
                border: "2px solid",
            }}
            draggable={draggable}
            onDragStart={onDragStart}

        >
            {image ? (
                <img
                    src={image}
                    alt="card-svg"
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
