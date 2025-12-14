import express, { Application, Request, Response } from "express";
import transaction from "../src/routes/transation.route";
import rateLimiter from "./middlewares/rateLimiter";
import job from "./config/cron";

const app: Application = express();

//production
if (process.env.NODE_ENV! === "production") job.start();

//middleware
app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", transaction);

export default app;
