import { Server, Socket } from 'socket.io';

export const handleWebRTCSignaling = (io: Server, socket: Socket) => {
  // User joins a meeting room
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', userId);

    // Relay SDP Offer
    socket.on('offer', (offer: any, targetId: string) => {
      io.to(targetId).emit('offer', offer, socket.id);
    });

    // Relay SDP Answer
    socket.on('answer', (answer: any, targetId: string) => {
      io.to(targetId).emit('answer', answer, socket.id);
    });

    // Relay ICE Candidate
    socket.on('ice-candidate', (candidate: any, targetId: string) => {
      io.to(targetId).emit('ice-candidate', candidate, socket.id);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
};
