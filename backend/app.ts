import express, { type Express, type Request, type Response } from "express";
import db from "./database.ts";
import userRoutes from "./routes/user.ts";
import authRoutes from "./routes/auth.ts";
import entryRoutes from "./routes/entry.ts";
import sleepDataRoutes from "./routes/sleepData.ts";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;
app.use(cors());
db.connect();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/entry", entryRoutes);
app.use("/sleep_data", sleepDataRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
