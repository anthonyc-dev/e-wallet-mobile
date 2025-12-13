import { Router } from "express";
import {
  createTransaction,
  getTransactionsByUser,
  deleteTransaction,
  getUserSummary,
} from "../controllers/trasaction.controller";

const router = Router();

// Create a new transaction
router.post("/createTransaction", createTransaction);

// Get all transactions for a user
router.get("/getTransaction/:user_ID", getTransactionsByUser);

//get user summary transaction
router.get("/getUserSummary/:user_ID", getUserSummary);

// Delete a transaction
router.delete("/deleteTransaction/:id", deleteTransaction);

export default router;
