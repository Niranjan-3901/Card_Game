import { io } from 'socket.io-client';

// Use import.meta.env to access environment variables
const socket = io(import.meta.env.VITE_RENDER_URL, {
  autoConnect: true,
  transports: ['websocket']
});

export { socket };

