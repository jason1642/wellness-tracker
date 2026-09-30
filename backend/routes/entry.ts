import { Router, type Request, type Response } from "express";

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
    console.log("this is request body", req.body);
    const {
      date,
      notes,
      mood,
      medication,
      weight,
      screen_time,
      steps,
      water,
      calories,
    } = req.body;
    console.log(notes);
    let newEntry = {
      date,
      notes,
      mood,
      medication,
      weight,
      screen_time,
      steps,
      water,
      calories,
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
  try {
    const { user_id, entry_id } = req.body;
    const editableFields = [
      "date",
      "notes",
      "mood",
      "medication",
      "weight",
      "screen_time",
      "steps",
      "water",
      "calories",
    ];
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [`entries.$.${field}`, req.body[field]]),
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No entry fields provided to update");
    }

    const doc = await Entry.findOneAndUpdate(
      { user_id, "entries._id": entry_id },
      { $set: updates },
      { new: true }, // returns the updated doc instead of the original
    );

    if (!doc) return res.status(404).send("user or entry not found");
    res.send(doc);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to update entry");
  }
};

router.patch("/", updateEntry);

const deleteEntry = async (req: Request, res: Response) => {
  console.log(req.body);
  const { user_id } = req.body;
  const existing = await Entry.findOne({
    user_id,
    "entries._id": req.params.entry_id,
  });
  if (!existing) return res.status(404).send("user or entry not found");
  // using $unset will make the value null instead of deleting it entirely from the array
  const result = await Entry.findOneAndUpdate(
    { user_id },
    { $pull: { entries: { _id: req.params.entry_id } } },
    { new: true },
  );
  res.send(result);
};

router.delete("/delete/:entry_id", deleteEntry);

export default router;
