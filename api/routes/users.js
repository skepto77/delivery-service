import express from 'express';
import passport from 'passport';
const router = express.Router({ mergeParams: true });
import { addUser, getUserByEmail } from '../controllers/user.js';

router.route('/signup').post(addUser);

router.route('/signin').post(getUserByEmail);

export default router;
