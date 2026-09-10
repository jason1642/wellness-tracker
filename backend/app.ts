import express, { type Express, type Request, type Response } from "express";
import db from "./database.ts";
import userRoutes from "./routes/user.ts";
import authRoutes from "./routes/auth.ts";
import trackerRoutes from "./routes/tracker.ts";
import entryRoutes from "./routes/entry.ts";
import cors from "cors";

const app: Express = express();
const port = 3001;
app.use(cors());
db.connect();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/tracker", trackerRoutes);
app.use("/entry", entryRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
