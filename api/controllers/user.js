import User from '../models/User.js';
import passport from 'passport';

const addUser = async (req, res, next) => {
  passport.authenticate('signup', function (err, user, info) {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({
        error: 'email занят',
        status: 'error',
      });
    }
    return res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      },
      status: 'ok',
    });
  })(req, res, next);
};

const getUserByEmail = async (req, res, next) => {
  passport.authenticate('signin', function (err, user, info) {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({
        error: 'Неверный логин или пароль',
        status: 'error',
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({ errors: err });
      }
      return res.status(200).json({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
        },
        status: 'ok',
      });
    });
  })(req, res, next);
};

// const getUserByEmail = async (req, res) => {
//   const { email } = req.params;
//   try {
//     const user = await User.findOne({ email: email });
//     res.status(200).json(user);
//   } catch (e) {
//     console.log(e);
//     res.status(404).json({ message: `Пользователь не найден` });
//   }
// };

export { addUser, getUserByEmail };
