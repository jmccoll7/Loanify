import express from "express";
import { home, login, logout, register, signup, loginForm, profile, refreshToken } from "../controllers/authenticationController.js";
import { auth } from "../middleware/auth.js";
import { check } from 'express-validator';

const router = express.Router();

router.get("/home", home);
router.get("/register", register);
router.post('/signup', [
  check('email').isEmail(),
  check('password').isLength({ min: 8 }),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
], signup);
router.get("/login", loginForm);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", auth, profile);

export default router;