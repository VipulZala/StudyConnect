// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;
  const url = (import.meta.env.VITE_SOCKET_URL as string) || 'http://localhost:5000';
  socket = io(url, {
    autoConnect: true,
    withCredentials: true
  });
  return socket;
}

export function getSocket(): Socket {
  if (!socket) return initSocket();
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
