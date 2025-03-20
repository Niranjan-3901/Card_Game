import { Modal, Radio } from 'antd';
import React, { useState } from 'react';
import "../styles/TurnTrumpSelect.css";

export const TrumpSelectorPopup = ({ onTrumpSelected,onclose }) => {
  const [value, setValue] = useState("");

  const handleOk = () => {
    const selectedTrump = mapTrump(value);
    onTrumpSelected(selectedTrump);
    onclose(false)
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const mapTrump = (name) => {
    const trumpMap = {
      Hukum: { name: "Hukum", suit: "♠️" },
      Heart: { name: "Heart", suit: "♥️" },
      Spade: { name: "Spade", suit: "♣️" },
      Block: { name: "Block", suit: "♦️" }
    };
    return trumpMap[name];
  };

  return (
    <>
      <Modal
        title="Select Trump for Round:"
        open={true}
        onOk={handleOk}
        width={900}
        closable={false}
        maskClosable={false} // Prevent closing on mask click
        keyboard={false} // Prevent closing with ESC key
      >
        <Radio.Group onChange={handleChange} value={value}> 
          <Radio className={"radio_label"} value="Hukum">♠️</Radio>
          <Radio className={"radio_label red"} value="Heart">♥️</Radio>
          <Radio className={"radio_label"} value="Spade">♣️</Radio>
          <Radio className={"radio_label red"} value="Block">♦️</Radio>
        </Radio.Group>
      </Modal>
    </>
  );
};
