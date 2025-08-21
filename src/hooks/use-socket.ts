import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useCanvasStore } from '../stores/canvas-store';
import { CanvasState, User, HistoryAction } from '../types/canvas';



export function useSocket(roomId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const {
    setCanvas,
    addUser,
    removeUser,
    setUsers,
    updateUserCursor,
    addToHistory,
    currentUser
  } = useCanvasStore();

  useEffect(() => {
    if (!roomId || !currentUser) return;

    const socket = io(import.meta.env.VITE_SERVER_URL);
    socketRef.current = socket;

    socket.emit('join-room', { roomId, user: currentUser });

    socket.on('canvas-state', (canvas: CanvasState) => {
      setCanvas(canvas);
    });

    socket.on('canvas-update', (canvas: CanvasState) => {
      setCanvas(canvas);
    });

    socket.on('current-users', (users: User[]) => {
      setUsers(users);
    });

    socket.on('user-joined', (user: User) => {
      addUser(user);
    });

    socket.on('user-left', (userId: string) => {
      removeUser(userId);
    });

    socket.on('cursor-update', ({ userId, cursor }: { userId: string; cursor: { x: number; y: number } }) => {
      updateUserCursor(userId, cursor);
    });

    socket.on('history-update', (action: HistoryAction) => {
      addToHistory();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, currentUser, setCanvas, addUser, removeUser, setUsers, updateUserCursor, addToHistory]);

  const emitCanvasUpdate = (canvas: CanvasState) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('canvas-update', { roomId, canvas });
    }
  };

  const emitCursorMove = (cursor: { x: number; y: number }) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('cursor-move', { roomId, cursor });
    }
  };

  const emitHistoryAction = (action: HistoryAction) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('add-to-history', { roomId, action });
    }
  };

  return {
    emitCanvasUpdate,
    emitCursorMove,
    emitHistoryAction,
    isConnected: socketRef.current?.connected || false
  };
}