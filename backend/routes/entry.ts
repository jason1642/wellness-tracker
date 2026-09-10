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

export default router;
