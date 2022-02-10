import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  console.log('serializeUser', user.id);
  done(null, user.id);
});

passport.deserializeUser((_id, done) => {
  console.log('deserializeUser', _id);
  User.findById(_id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  'signin',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Неправильно введен пароль!' });
            }
          });
        }
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  })
);

passport.use(
  'signup',
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      const { name, contactPhone } = req.body;
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            const newUser = new User({ email, password, name, contactPhone });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    return done(null, user);
                  })
                  .catch((err) => {
                    return done(null, false, { message: err });
                  });
              });
            });
          } else {
            return done(null, false, { message: 'email занят' });
          }
        })
        .catch((err) => {
          return done(null, false, { message: err });
        });
    }
  )
);

export default passport;
