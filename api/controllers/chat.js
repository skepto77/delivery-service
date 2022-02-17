import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const getChat = async (userId1, userId2) => {
  try {
    const chat = await Chat.findOne().where('users').in([userId1, userId2]);
    return chat._id ? chat : null;
  } catch (e) {
    console.log(e);
  }
};

const addMessage = async (author, receiver, text) => {
  const newMessage = {
    author: author._id,
    sentAt: Date.now(),
    text,
  };

  try {
    const chat = await getChat(author._id, receiver._id);
    const message = await Message.create(newMessage);
    const sentAt = new Date();

    if (chat) {
      chat.messages.push(message);
      await chat.save();
    } else {
      const сhat = await Chat.create({
        users: [author._id, receiver._id],
        sentAt,
        messages: [message],
      });
      await сhat.save();
    }
    subscribers.forEach((cb) => cb(chat._id, message));
  } catch (e) {
    console.log(e);
  }
};

const subscribers = [];
const subscribeChat = (cb) => (subscribers[0] = cb);

const getChatHistory = async (id) => {
  try {
    const chatHistory = await Chat.findOne({ _id: id }).populate('messages');
    return chatHistory;
  } catch (e) {
    console.log(e);
  }
};

export { getChat, addMessage, getChatHistory, subscribeChat };
