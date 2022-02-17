import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import passport from './config/passport-setup.js';
import usersRoutes from './routes/users.js';
import advertisementRoutes from './routes/advertisement.js';
import MongoStore from 'connect-mongo';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getChat, addMessage, getChatHistory, subscribeChat } from './controllers/chat.js';
import User from './models/User.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: false,
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // сессия на 14 дней
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/', usersRoutes);
app.use('/api/advertisements', advertisementRoutes);

connectDB();

// TODO: FOR TESTS
const [testAuthor, testReceiver] = await User.aggregate([{ $sample: { size: 2 } }]);

import path from 'path';
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/test.html'));
});
// TODO: FOR TESTS

io.on('connection', (socket) => {
  const { id } = socket;
  console.log(`User connected: ${id}`);

  socket.on('getHistory', async (receiverId) => {
    const author_id = testAuthor._id; // test
    receiverId = testReceiver._id; // test
    const chatId = await getChat(author_id, receiverId);
    const chatHistory = await getChatHistory(chatId);
    socket.emit('chatHistory', chatHistory.messages); // to client
  });

  socket.on('sendMessage', async ({ receiver, text }) => {
    const author = testAuthor; // test
    receiver = testReceiver; // test
    await addMessage(author, receiver, text);
  });

  subscribeChat(async (chatId, message) => {
    io.sockets.emit('newMessage', { message, chatId });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${id}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, console.log(`Сервер запущен на порту ${PORT}`));
