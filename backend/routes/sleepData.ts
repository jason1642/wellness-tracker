import { Router, type Request, type Response } from "express";
import User from "../models/user.ts";
import { fetchSleepSessionsForUser } from "../scripts/nightlyHoursSlept.ts";

const router = Router();

const getSleepData = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({ _id: user_id });
    if (!user) return res.status(404).send("User does not exist");

    // The Sleep API takes an email, but your frontend only has a user_id —
    // look the email up server-side so React never needs to know it.
    const sessions = await fetchSleepSessionsForUser(user.email);

    res.status(200).send(sessions);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to fetch sleep data");
  }
};

router.get("/:user_id", getSleepData);

export default router;
