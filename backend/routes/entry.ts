import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import _ from "lodash";
import Entry from "../models/entry.ts";
import User from "../models/user.ts";
const router = Router();

// Find entry list by user id
const getEntriesByUserId = async (req: Request, res: Response) => {
  //   console.log(req.params.user_id);
  let entries;
  try {
    await Entry.findOne({ user_id: req.params.user_id }).then(
      (ele) => (entries = ele),
    );
  } catch (err) {
    return res.status(404).send("User id not found");
  }

  //   console.log(entries);
  return res.send(entries);
};
router.get("/:user_id", getEntriesByUserId);

// req = {date, notes, mood, hours_slept, medication, weight, screen_time}
const createEntry = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ _id: req.params.user_id });

    if (user === null) return res.status(404).send("User does not exist");
    console.log(req.body);
    const { date, notes, mood, hours_slept, medication, weight, screen_time } =
      req.body;
    console.log(notes);
    let newEntry = {
      user_id: user._id,
      notes: notes,
      date: date,
      mood: mood,
      hours_slept: hours_slept,
      medication: medication,
      weight: weight,
      screen_time: screen_time,
    };

    let entryDoc = await Entry.findOne({ user_id: user._id });
    if (!entryDoc) {
      entryDoc = new Entry({
        user_id: user._id,
        entries: [newEntry],
      });
    } else {
      entryDoc.entries.push(newEntry);
    }
    await entryDoc.save();
    res.status(201).send(entryDoc);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to create entry");
  }
};
router.post("/:user_id", createEntry);

// Change One
// {entry_id, user_id, date, notes, mood, hours_slept, weight, screen_time, medication}
const updateEntry = async (req: Request, res: Response) => {
  const { user_id, entry_id } = req.body;

  const doc = await Entry.findOneAndUpdate(
    { user_id, "entries._id": entry_id },
    {
      $set: {
        "entries.$.date": req.body.date,
        "entries.$.notes": req.body.notes,
        "entries.$.mood": req.body.mood,
        "entries.$.hours_slept": req.body.hours_slept,
        "entries.$.weight": req.body.weight,
        "entries.$.screen_time": req.body.screen_time,
        "entries.$.medication": req.body.medication,
      },
    },
    { new: true }, // returns the updated doc instead of the original
  );

  if (!doc) return res.status(404).send("user or entry not found");
  res.send(doc);
};

router.put("/edit", updateEntry);

export default router;
