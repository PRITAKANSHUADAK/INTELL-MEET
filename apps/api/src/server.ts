import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import { handleWebRTCSignaling } from './sockets/webrtcHandler';
import { handleChatSignaling } from './sockets/chatHandler';
import aiRoutes from './routes/aiRoutes';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  handleWebRTCSignaling(io, socket);
  handleChatSignaling(io, socket);
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
