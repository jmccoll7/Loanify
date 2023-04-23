import express from "express";
import { loanForm, loanInput, deleteLoan, updateLoan, getLoansByUser } from "../controllers/loanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/loan", auth, loanForm);
router.post("/loan", auth, loanInput);
router.get("/getloan", auth, getLoansByUser);
router.post("/deleteloan/:id", auth, deleteLoan);
router.post("/updateloan/:id", auth, updateLoan);

export default router;