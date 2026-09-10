import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import _ from "lodash";
import Entry from "../models/entry.ts";
const router = Router();

// Find entry list by user id
const getEntriesByUserId = async (req: Request, res: Response) => {
  console.log(req.params.user_id);
  let entries;
  try {
    await Entry.findOne({ user_id: req.params.user_id }).then(
      (ele) => (entries = ele),
    );
  } catch (err) {
    return res.status(404).send("User id not found");
  }

  console.log(entries);
  return res.send(entries);
};
router.get("/:user_id", getEntriesByUserId);

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
