import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;
    if (!accessToken) {
      throw new Error('Not authorized to access this resource');
    }

    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error('Not authorized to access this resource');
    }

    req.user = user;
    req.token = accessToken;
    next();
  } catch (err) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('Not authorized to access this resource');
      }

      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
      const user = await User.findOne({ _id: decodedRefreshToken._id, 'refreshTokens.token': refreshToken });

      if (!user) {
        throw new Error('Not authorized to access this resource');
      }

      const newAccessToken = await user.generateAuthToken();

      // Remove the used refresh token
      user.refreshTokens = user.refreshTokens.filter((token) => token.token !== refreshToken);
      await user.save();

      // Generate a new refresh token
      const newRefreshToken = await user.generateRefreshToken();

      res.cookie('jwt', newAccessToken, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });

      res.cookie('refreshToken', newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
      });

      req.user = user;
      req.token = newAccessToken;
      next();
    } catch (refreshError) {
      res.status(401).render('login', { pageTitle: 'Login', tokenExpiredMsg: 'Please log in.' });
    }
  }
};
