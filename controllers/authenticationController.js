import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export const home = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).render('home', { pageTitle: 'Home', message: 'This is my greatest home page.' });
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).render('signUp', { pageTitle: 'Sign Up', errors: [] });
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('signUp', { pageTitle: 'Sign Up', errors: errors.array() });
  }
  const { name, email, password } = req.body;

  try {
    User.create({
      name,
      email,
      password,
    }).then(async (user) => {
      const token = await user.generateAuthToken();
      const refreshToken = await user.generateRefreshToken();
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
      });
      res.status(200).render('home', { pageTitle: 'Home', message: `User: ${user.name} logged in!` });
    });
  } catch (err) {
    console.log(err);
    const errorDetails = [
      {
        location: 'Authorization',
        msg: `${name} ${err}`,
        param: name,
      },
    ];
    res.status(400).json({ errors: errorDetails });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
    });
    res.status(200).render('home', { pageTitle: 'Home', message: `User: ${user.name} logged in!` });
  } catch (err) {
    const errorDetails = [
      {
        location: 'Authorization',
        msg: `${email} ${err}`,
        param: email,
      },
    ];
    res.status(400).json({ errors: errorDetails });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.status(200).redirect('/api/home');
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const loginForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).render('login', { pageTitle: 'Login', tokenExpiredMsg: null });
};

export const profile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).render('profile', { pageTitle: 'Profile', user: req.user.name, email: req.user.email });
}

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const currentUser = await User.findById(user._id);
    if (!currentUser || !currentUser.refreshTokens.find((token) => token.token === refreshToken)) {
      return res.sendStatus(403);
    }

    const newAccessToken = await currentUser.generateAuthToken();
    res.json({ accessToken: newAccessToken });
  });
};