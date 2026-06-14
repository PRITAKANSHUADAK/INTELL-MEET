import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { Send } from 'lucide-react';

const SOCKET_SERVER_URL = 'http://localhost:5000';

interface Message {
  _id: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export const ChatPanel = ({ roomId, userName }: { roomId: string; userName: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('receive-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('send-message', {
        roomId,
        senderId: socket.id,
        senderName: userName,
        content: input.trim(),
      });
      setInput('');
    }
  };

  return (
    <div className="w-80 bg-surface border-l border-secondary/30 flex flex-col h-full">
      <div className="p-4 border-b border-secondary/30 font-semibold text-text">
        In-Call Messages
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs text-secondary mb-1">{msg.senderName}</span>
            <div className="bg-primary/20 text-text p-3 rounded-lg rounded-tl-none w-fit max-w-[90%] break-words">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-secondary/30 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 bg-background text-text rounded-md px-3 py-2 outline-none border border-secondary/50 focus:border-primary transition-colors"
        />
        <button 
          type="submit"
          className="p-2 bg-primary hover:bg-blue-600 rounded-md text-white transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
