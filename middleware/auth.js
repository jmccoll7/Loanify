import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error('Not authorized to access this resource');
    }
    console.log("token: ", token);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    console.log(decoded);
    const user = await User.findOne({ _id: decoded._id});

    if (!user) {
      throw new Error('Not authorized to access this resource');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).render('login', { pageTitle: 'Login', tokenExpiredMsg: 'Session expired. Please log in.' });
  }
};
