import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import mongoose from "mongoose";
import Tracker from "../models/tracker.ts";
import Entry from "../models/entry.ts";
import _ from "lodash";
import User from "../models/user.ts";
import EntryData from "../scripts/entry-data.json" with { type: "json" };
import { generateSleepData } from "../scripts/create-sleep-data.ts";
const router = Router();

// Create user
const createUser = async (req: Request, res: Response) => {
  // Without Joi validation, i need to figure out how to send an error to front end with mongoose validation
  let secret;
  //Check if user already exists
  let user = await User.findOne({
    email: req.body.email,
  });

  //
  if (user) {
    return res.status(400).send("That email is already taken.");
  }

  try {
    const newUser: InstanceType<typeof User> = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.email,
      email: req.body.email,
      created_at: new Date(),
      // _id: newPostId
    });
    const newEntry: InstanceType<typeof Entry> = new Entry({
      user_id: newUser._id,
      entries: EntryData,
    });

    const sleepData = generateSleepData(7);
    const newTracker: InstanceType<typeof Tracker> = new Tracker({
      user_id: newUser._id,
      _id: newUser.tracker_id,
      sleep_data: sleepData,
      water_data: Math.floor(Math.random() * 15) + 1,
      steps_data: Math.floor(Math.random() * 10000) + 1,
      calories_data: Math.floor(Math.random() * 2500) + 1,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.username = req.body.email;
    newUser.password = await bcrypt.hash(newUser.password, salt);
    newUser.tracker_id = newTracker._id;
    newUser.entry_id = newEntry._id;
    await Entry.insertOne(newEntry);
    await Tracker.insertOne(newTracker);
    await newUser.save();
    console.log("RUNNING SAVE");

    const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET);
    console.log("this is token " + token);
    res
      .header({ "x-auth-token": token, authorization: `Bearer ${token}` })
      .send(
        _.assign({ token: token }, _.pick(user, ["_id", "email", "password"])),
      );
  } catch (errors) {
    console.log(errors);
    let errorMessages: any[] = [];

    Object.keys(errors instanceof Error).forEach((key) =>
      errorMessages.push(errors[key].properties.message),
    );
    console.log(errors);
    const errorObject = {
      errors: errorMessages,
    };
    return res.send(errorObject).status(403);
  }

  //   res.send('Get all users');
};
router.post("/create", createUser);

// Find all users
router.get("/", (req: Request, res: Response) => {
  res.send(res);
});

// Find user by id
const getOneUser = async (req: Request, res: Response) => {
  console.log(req.params.id);
  let user;
  try {
    await User.findOne({ _id: req.params.id }).then((ele) => (user = ele));
  } catch (err) {
    return res.status(404).send("User not found");
  }

  console.log(user);
  return res.send(_.pick(user, ["_id", "username", "email"]));
};
router.get("/:id", getOneUser);

// Find user by id
const getOneUserByEmail = async (req: Request, res: Response) => {
  console.log(req.params.id);
  let user;
  try {
    await User.findOne({ email: req.params.email }).then((ele) => (user = ele));
  } catch (err) {
    return res.status(404).send("User not found");
  }

  console.log(user);
  return res.send(_.pick(user, ["_id", "username", "email"]));
};
router.get("/find-by-email/:email", getOneUserByEmail);

const getTrackerEntryUserData = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).send("Invalid user_id");
    }

    const user = await User.findOne({ _id: user_id });
    if (!user) return res.status(404).send("User does not exist");
    console.log("full data user only", user);
    // promise.all will make both database searches run at the same time rather than individual awaits
    const [tracker, entry] = await Promise.all([
      Tracker.findOne({ user_id }),
      Entry.findOne({ user_id }),
    ]);

    if (!tracker && !entry) {
      return res
        .status(404)
        .send("No tracker or entry data found for this user");
    }
    res.status(200).send({
      ...user,
      tracker,
      entry,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("failed to fetch dashboard data");
  }
};
router.get("/full-data/:user_id", getTrackerEntryUserData);
export default router;
