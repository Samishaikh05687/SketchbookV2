import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface Room {
  id: string;
  users: Map<string, User>;
  canvas: any;
  history: any[];
}

const rooms = new Map<string, Room>();
const DATA_DIR = 'data/rooms';

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Load room data from file
async function loadRoomData(roomId: string) {
  try {
    const filePath = path.join(DATA_DIR, `${roomId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Save room data to file
async function saveRoomData(roomId: string, data: any) {
  try {
    const filePath = path.join(DATA_DIR, `${roomId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving room data:', error);
  }
}

// Initialize data directory
ensureDataDir();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', async (data: { roomId: string; user: User }) => {
    const { roomId, user } = data;
    
    if (!rooms.has(roomId)) {
      const savedData = await loadRoomData(roomId);
      rooms.set(roomId, {
        id: roomId,
        users: new Map(),
        canvas: savedData?.canvas || { objects: [], background: '#ffffff' },
        history: savedData?.history || []
      });
    }
    
    const room = rooms.get(roomId)!;
    room.users.set(socket.id, { ...user, id: socket.id });
    
    socket.join(roomId);
    
    // Send current canvas state to the new user
    socket.emit('canvas-state', room.canvas);
    socket.emit('history-state', room.history);
    
    // Notify others about the new user
    socket.to(roomId).emit('user-joined', { ...user, id: socket.id });
    
    // Send current users to the new user
    const currentUsers = Array.from(room.users.values()).filter(u => u.id !== socket.id);
    socket.emit('current-users', currentUsers);
  });

  socket.on('canvas-update', (data: { roomId: string; canvas: any }) => {
    const { roomId, canvas } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.canvas = canvas;
      socket.to(roomId).emit('canvas-update', canvas);
      
      // Auto-save periodically
      saveRoomData(roomId, { canvas: room.canvas, history: room.history });
    }
  });

  socket.on('cursor-move', (data: { roomId: string; cursor: { x: number; y: number } }) => {
    const { roomId, cursor } = data;
    const room = rooms.get(roomId);
    
    if (room && room.users.has(socket.id)) {
      const user = room.users.get(socket.id)!;
      user.cursor = cursor;
      socket.to(roomId).emit('cursor-update', { userId: socket.id, cursor });
    }
  });

  socket.on('add-to-history', (data: { roomId: string; action: any }) => {
    const { roomId, action } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.history.push({
        ...action,
        timestamp: Date.now(),
        userId: socket.id
      });
      
      // Limit history size
      if (room.history.length > 100) {
        room.history = room.history.slice(-100);
      }
      
      socket.to(roomId).emit('history-update', action);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    for (const [roomId, room] of rooms) {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        socket.to(roomId).emit('user-left', socket.id);
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          saveRoomData(roomId, { canvas: room.canvas, history: room.history });
          rooms.delete(roomId);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});