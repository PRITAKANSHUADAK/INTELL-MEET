import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', messageSchema);
