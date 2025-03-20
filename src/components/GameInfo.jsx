import { Col, Modal, Row, Table } from "antd";
import React from "react";

const GameInfo = ({ gameState, playerDetail, visible, onClose }) => {
  
  const handsData = gameState && gameState.hands ? Object.entries(gameState.hands) : [];

  const tableData = Array.from({ length: 8 }).map((_, index) => {
    const handEntry = handsData.find(([key]) => Number(key) === index + 1);
    const hand = handEntry ? handEntry[1] : {};
    const cardsDisplay = hand.cards
      ? hand.cards.map(card => `${card.card.value}${card.card.suit}-${card.playerName}`).join(", ") 
      : "-";
    return {
      key: index + 1,
      turn: index + 1,
      winnerName: hand.winnerPlayerName || "-",
      winnerGroup: hand.winnerGroupName || "-",
      cards: cardsDisplay
    };
  });

  const columns = [
    {
      title: 'Turn',
      dataIndex: 'turn',
      key: 'turn',
      align: 'center',
    },
    {
      title: 'Winner Name',
      dataIndex: 'winnerName',
      key: 'winnerName',
      align: 'center',
    },
    {
      title: 'Winner Group',
      dataIndex: 'winnerGroup',
      key: 'winnerGroup',
      align: 'center',
    },
    {
      title: 'Cards',
      dataIndex: 'cards',
      key: 'cards',
      align: 'center',
      render: (text) => (
        <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          {text}
        </span>
      )
    }
  ];

  return (
    <Modal
      title="Game Info"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      maskClosable={false} // Prevent closing on mask click
      keyboard={false} // Prevent closing with ESC key
      width={700}
      style={{ padding: "20px" }}
    >
      <div className="game-info">
        <h3 style={{ marginBottom: "20px", alignSelf: "center", textAlign: "center" }}>Name: {playerDetail?.name || "N/A"}</h3>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p style={{ textAlign: "center" }}><strong>Friends:</strong> {(playerDetail?.friends || []).join(", ") || "None"}</p>
            <p style={{ textAlign: "center" }}><strong>Current Dealer:</strong> {gameState.currentDealerName || "N/A"}</p>
            <p style={{ textAlign: "center" }}><strong>Current Bidder:</strong> {gameState.currentBidderName || "N/A"}</p>
            <p style={{ textAlign: "center" }}><strong>Current Bid:</strong> {gameState.currentBid || "0"}</p>
          </Col>

          <Col span={12}>
            <p style={{ textAlign: "center" }}><strong>Global Trump:</strong> {gameState.globalTrump || "None"}</p>
            <p style={{ textAlign: "center" }}><strong>Turn Trump:</strong> {gameState.turnTrump || "None"}</p>
            <p style={{ textAlign: "center" }}><strong>Negative Points Group:</strong> {Object.keys(gameState.negPointsOn)[0] || "-"}</p>
            <p style={{ textAlign: "center" }}><strong>Negative Points:</strong> {gameState.negPointsOn[Object.keys(gameState.negPointsOn)[0]] || "0"}</p>
            <p style={{ textAlign: "center" }}><strong>Current Turn:</strong> {gameState.currentTurn?.name || "0"}</p>
          </Col>
        </Row>

        <h3 style={{ marginTop: "20px", textAlign: "center" }}>Hands Summary</h3>
        <Table 
          columns={columns} 
          dataSource={tableData} 
          pagination={false} 
          bordered 
          size="middle"
        />
      </div>
    </Modal>
  );
};

export default GameInfo;
