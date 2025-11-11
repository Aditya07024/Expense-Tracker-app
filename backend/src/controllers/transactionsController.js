import { sql } from "../config/db.js";

// ✅ Get all transactions for a specific user
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transactions:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error while fetching transactions" });
  }
}

// ✅ Create a new transaction
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating the transaction:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error while creating transaction" });
  }
}

// ✅ Delete a transaction
export async function deleteTransaction(req, res) {
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

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error while deleting transaction" });
  }
}

// ✅ Get user summary (balance, income, expenses)
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [balanceResult] = await sql`
  SELECT COALESCE(SUM(
    CASE 
      WHEN category = 'income' THEN CAST(amount AS NUMERIC)
      WHEN category = 'expense' THEN -CAST(amount AS NUMERIC)
      ELSE 0
    END
  ), 0) AS balance
  FROM transactions
  WHERE user_id = ${userId}
`;

const [incomeResult] = await sql`
  SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) AS income
  FROM transactions
  WHERE user_id = ${userId} AND category = 'income'
`;

const [expensesResult] = await sql`
  SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) AS expenses
  FROM transactions
  WHERE user_id = ${userId} AND category = 'expense'
`;

    res.status(200).json({
      balance: Number(balanceResult.balance),
      income: Number(incomeResult.income),
      expenses: Number(expensesResult.expenses),
    });
  } catch (error) {
    console.error("Error getting the summary:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error while fetching summary" });
  }
}
