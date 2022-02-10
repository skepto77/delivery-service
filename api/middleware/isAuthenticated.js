const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    console.log('req.isAuthenticated fail', req.isAuthenticated());
    return res.status(401).json({ message: `Необходима авторизация` });
  } else {
    next();
  }
};
export default isAuthenticated;
