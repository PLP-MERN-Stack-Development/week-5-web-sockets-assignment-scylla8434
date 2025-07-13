
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

import { register, login } from './controllers/authController.js';
import { addMessage, getMessages } from './controllers/chatController.js';
import User from './models/User.js';

// Auth routes
app.post('/api/register', register);
app.post('/api/login', login);

// Get messages for a room
app.get('/api/messages/:room', (req, res) => {
  const { room } = req.params;
  res.json(getMessages(room));
});

// Socket.io logic
io.on('connection', (socket) => {
  let username = null;

  socket.on('join', async ({ room, user }) => {
    username = user;
    socket.join(room);
    console.log(`[SOCKET] ${username} joined room: ${room}`);
    await User.updateOne({ username }, { $set: { online: true } });
    const onlineUsers = await User.find({ online: true });
    io.emit('users', onlineUsers.map(u => u.username));
    socket.to(room).emit('notification', `${username} joined the room`);
  });

  socket.on('message', ({ room, text, time }) => {
    if (!username) return;
    console.log(`[SOCKET] Message from ${username} in ${room}: ${text}`);
    addMessage({ room, username, text, time });
    io.to(room).emit('message', { username, text, time });
  });

  socket.on('typing', ({ room }) => {
    console.log(`[SOCKET] ${username} is typing in ${room}`);
    socket.to(room).emit('typing', { username });
  });

  socket.on('read', ({ room }) => {
    console.log(`[SOCKET] ${username} read messages in ${room}`);
    socket.to(room).emit('read', { username });
  });

  socket.on('disconnect', async () => {
    if (username) {
      console.log(`[SOCKET] ${username} disconnected`);
      await User.updateOne({ username }, { $set: { online: false } });
      const onlineUsers = await User.find({ online: true });
      io.emit('users', onlineUsers.map(u => u.username));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
