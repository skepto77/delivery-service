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

dotenv.config();
const app = express();

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
      // domain= '.localhost',
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Сервер запущен на порту ${PORT}`));
