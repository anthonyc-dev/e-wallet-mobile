import { Request, Response } from "express";
import { sql } from "../config/db";

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { user_ID, title, amount, category } = req.body;
    if (!user_ID || !title || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const [transaction] = await sql`
      INSERT INTO transactions (user_ID, title, amount, category) 
      VALUES (${user_ID}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to create transaction", error });
  }
};

// Get all transactions for a user
export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
    const { user_ID } = req.params;
    if (!user_ID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_ID = ${user_ID}
      ORDER BY created_at DESC
    `;
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }
    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({
      message: "Transaction deleted successfully",
      transaction: result[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error });
  }
};

// Get user transaction summary
export const getUserSummary = async (req: Request, res: Response) => {
  try {
    const { user_ID } = req.params;
    if (!user_ID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const balanceResult = await sql`
      SELECT 
        COALESCE(SUM(amount), 0) as balance FROM transactions  WHERE user_ID = ${user_ID}
    `;

    const incomeResult = await sql`
        SELECT 
            COALESCE(SUM(amount), 0) as income FROM transactions  WHERE user_ID = ${user_ID} AND amount > 0
        `;

    const expensesResult = await sql`
      SELECT 
          COALESCE(SUM(amount), 0) as expenses FROM transactions  WHERE user_ID = ${user_ID} AND amount < 0
      `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user summary", error });
  }
};
