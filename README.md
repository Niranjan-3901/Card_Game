# Multiplayer Card Game - Custom CallBreak

This project is a real-time multiplayer card game built using **Socket.IO** and **React**, inspired by CallBreak but with additional rules and mechanics. The goal is to provide a strategic gameplay experience where players compete in teams with a unique bidding and trump system.

## **Game Overview**
The game is played with **6 players**, each receiving **8 cards** from a deck of **48 cards** (where all **2s are removed**). The **most powerful card** in the game is **3-Spade**.

Players are divided into **two groups**:
- **Group 1 (G1):** Players **1, 3, 5**
- **Group 2 (G2):** Players **2, 4, 6**

The gameplay follows a **circular turn order**, which starts from the **bidder** and follows a pattern based on the bidding order.

## **Bidding System**
The bidding system is slightly different from CallBreak. The **dealer** is the **default bidder**, starting with a bid of **5**. Players then bid higher amounts, following specific rules to ensure fair competition. The bidding process ensures that teams commit to securing a minimum number of hands in each round.

## **Trump System**
Unlike traditional CallBreak, where Spades are the fixed trump suit, this game introduces a **dynamic trump system**:
- **Global Trump:** Chosen by the **bidder** at the start of each round.
- **Turn Trump:** The suit of the **first card played** in a given turn.

If a **Global Trump card** is played in a round, the player who played it wins the hand. However, the **3-Spade card** always holds the highest priority, even over the Global Trump.

## **Scoring & Points System**
Points are calculated based on whether the bidding group successfully wins their committed number of hands:
- If the **bidding team wins**, their bid points are **added to the opposing team**.
- If they **fail to meet the bid**, the opponent team gains **double the bid points**, except when the bid is **5** (where only 5 points are awarded instead of doubling).

Additionally, if a group's score exceeds **52**, the excess points shift to the opposite group, and the dealer role rotates accordingly.

## **Real-time Gameplay & Room Management**
The game supports **multiple game rooms**, managed by a **RoomManager**. Each game runs in a separate room with a unique Room ID. If a player disconnects, the room is closed immediately to maintain game integrity.

## **Technology Used**
- **Frontend:** React with Ant Design for UI components.
- **Backend:** Node.js with Express and Socket.IO for real-time communication.
- **State Management:** React Context API.
- **Game Logic:** Managed through JavaScript classes for deck handling and game state.

## **Folder Structure**
```
└── niranjan-3901-card_game/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   ├── Block/
        │   ├── Heart/
        │   ├── Hukum/
        │   └── Spade/
        ├── components/
        │   ├── BiddingPanel.jsx
        │   ├── Card.jsx
        │   ├── CardForAPlayer.jsx
        │   ├── Chat.jsx
        │   ├── CreateAndJoinModal.jsx
        │   ├── DraggableCard.jsx
        │   ├── DropZone.jsx
        │   ├── EntryPlayerCard.jsx
        │   ├── Game.jsx
        │   ├── GameBoard.jsx
        │   ├── GameInfo.jsx
        │   ├── GameStartTimer.jsx
        │   ├── PlayerTable.jsx
        │   ├── PlayerTableAndChat.jsx
        │   ├── RoomCreation.jsx
        │   ├── RoundEndedPopup.jsx
        │   └── TurnTrumpSelect.jsx
        ├── styles/
        │   ├── BiddingPanel.css
        │   ├── CardForAPlayer.css
        │   ├── Chat.css
        │   ├── GameBoard.css
        │   ├── PlayerTableAndChat.css
        │   ├── RoundEndedPopup.css
        │   └── TurnTrumpSelect.css
        └── utils/
            └── socket.js
```

## **Setting Up the Project**
To run the project locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/Niranjan-3901/Card_Game.git
   cd Card_Game
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## **Future Enhancements**
- Mobile support for seamless cross-platform play.
- AI-based opponents for single-player mode.
- Leaderboard and game statistics tracking.

This project is a step toward making an exciting multiplayer card game with strategic depth and fair gameplay mechanics.

