  import React, { useState } from 'react';
  import { Button, Modal, Space } from 'antd';
  import '../styles/BiddingPanel.css';

  const BiddingPanel = ({
    visible,
    onBid,
    onPass,
    gameState
  }) => {
    const [isBiddingMode, setIsBiddingMode] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    let { currentBid, roundCircle, currentBidder, myId } = gameState;
    let currentBidderIndex = roundCircle.indexOf(currentBidder);

    const handleBidMoreClick = () => setIsBiddingMode(true);

    const handleCancelClick = () => {
      setIsBiddingMode(false);
      setSelectedBid(null);
    };

    const handleSubmitClick = () => {
      if (selectedBid !== null) {
        onBid(selectedBid);
        setIsBiddingMode(false);
        setSelectedBid(null);
      }
    };

    return (
      <Modal
        title="Place Your Bid"
        open={visible}
        closable={false} // 🔥 Disable the close button in the top-right corner
        footer={null} // 🔥 Remove footer to prevent "Cancel" button
        centered
        maskClosable={false} // Prevent closing on mask click
        keyboard={false} // Prevent closing with ESC key
      >
        <div className="bidding-panel-content">
          {!isBiddingMode ? (
            <>
              <p>Do you want to bid more?</p>
              <p>Current Bidder is <strong>{gameState.currentBidderName}</strong> with a Bid value of <strong>{currentBid}</strong></p>
              <Space>
                <Button type="default" onClick={onPass}>Pass</Button>
                <Button type="primary" onClick={handleBidMoreClick}>Bid More</Button>
              </Space>
            </>
          ) : (
            <>
              <p>{`Select a bid higher than ${roundCircle.indexOf(myId) > currentBidderIndex ? "" : "or equal to"} the current bid: ${currentBid}`}</p>
              <Space>
                {[6, 7, 8].map((bid) => (
                  <Button
                    key={bid}
                    className={`bid-button ${selectedBid === bid ? 'bid-button-selected' : ''}`}
                    onClick={() => setSelectedBid(bid)}
                    disabled={roundCircle.indexOf(myId) > currentBidderIndex ? bid <= currentBid : bid < currentBid}
                  >
                    {bid}
                  </Button>
                ))}
              </Space>
              <Space>
                <Button 
                  className="ant-btn-cancel" 
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={handleSubmitClick}
                  disabled={selectedBid === null}
                >
                  Submit
                </Button>
              </Space>
            </>
          )}
        </div>
      </Modal>
    );
  };

  export default BiddingPanel;
