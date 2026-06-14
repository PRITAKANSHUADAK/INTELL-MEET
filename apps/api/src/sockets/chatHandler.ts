import { Server, Socket } from 'socket.io';
import { Message } from '../models/Message';

export const handleChatSignaling = (io: Server, socket: Socket) => {
  socket.on('send-message', async (data: { roomId: string; senderId: string; senderName: string; content: string }) => {
    try {
      // Save to database
      const newMessage = await Message.create(data);

      // Broadcast to everyone in the room including the sender
      io.to(data.roomId).emit('receive-message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
};
