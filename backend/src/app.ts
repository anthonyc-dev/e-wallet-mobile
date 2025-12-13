import express, { Application, Request, Response } from "express";
import transaction from "../src/routes/transation.route";
import rateLimiter from "./middlewares/rateLimiter";

const app: Application = express();

//middleware
app.use(rateLimiter);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("It's Working");
});

app.use("/api", transaction);

export default app;
