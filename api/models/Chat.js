import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Message from './Message.js';

const chatSchema = mongoose.Schema({
  users: {
    type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Message',
  },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
