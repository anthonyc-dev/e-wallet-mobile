import app from "../src/app";
import dotenv from "dotenv";
import { sql } from "./config/db";

dotenv.config();

const PORT = process.env.PORT!;

//DB connection Neon(PostgresDB)
async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_ID VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initialized DB", error);
    process.exit(1);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
