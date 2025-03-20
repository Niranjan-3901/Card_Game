import { io } from 'socket.io-client';

const localhost = "http://localhost:3001";
const ngrok = 'https://f2fa-93-190-142-118.ngrok-free.app'; // ngrok URL for backend
const renderURL = "https://card-game-server-meml.onrender.com";
export const socket = io(renderURL, {
  autoConnect: true,
  transports: ['websocket']
});

