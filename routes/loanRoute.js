import express from "express";
import { loanForm, loanInput, getAllLoans } from "../controllers/loanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/loan", auth, loanForm);
router.post("/loan", auth, loanInput);
router.get("/getloan", auth, getAllLoans);

export default router;