import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
    required: false,
  },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
