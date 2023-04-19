import express from "express";
import { home, login, logout, register, signup, loginForm, profile } from "../controllers/authenticationController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/home", home);
router.get("/register", register);
router.post("/signup", signup);
router.get("/login", loginForm);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", auth, profile);

export default router;