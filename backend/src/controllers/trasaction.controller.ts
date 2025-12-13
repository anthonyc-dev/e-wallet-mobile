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

    // Get total count and sum of amounts
    const summaryResult = await sql`
      SELECT 
        COUNT(*)::int AS total_transactions,
        COALESCE(SUM(amount), 0)::float AS total_amount
      FROM transactions
      WHERE user_ID = ${user_ID}
    `;

    // Get sum by category
    const categoriesResult = await sql`
      SELECT 
        category,
        COALESCE(SUM(amount), 0)::float AS total_amount
      FROM transactions
      WHERE user_ID = ${user_ID}
      GROUP BY category
    `;

    const summary = {
      total_transactions: summaryResult[0]?.total_transactions || 0,
      total_amount: summaryResult[0]?.total_amount || 0,
      by_category: categoriesResult,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user summary", error });
  }
};
