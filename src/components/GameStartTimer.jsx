import React, { useEffect, useState } from "react";
import { Modal } from "antd";

const GameStartTimer = React.memo(({ currentDealer, onGameStart }) => {
  const [countdown, setCountdown] = useState(5);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let interval;
    if (isOpen) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            setIsOpen(false);
            return 0;
          }
        });
      }, 1000);
    }


    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && countdown === 0) {
      onGameStart();
    }
  }, [isOpen, countdown, onGameStart]);

  return (
    <Modal
      title="Game Starting Soon"
      open={isOpen}
      centered
      maskClosable={false}
      keyboard={false}
      footer={null}
      closable={false}
    >
      <p>Dealer: <strong>{currentDealer}</strong></p>
      <p style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Game will start in <strong>{countdown}</strong> seconds...
      </p>
    </Modal>
  );
});

export default GameStartTimer;