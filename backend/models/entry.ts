import mongoose from "mongoose";

const { Schema } = mongoose;

export const SingleEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, required: false, default: "" },
  mood: { type: String, required: false, default: "" },
  hours_slept: { type: Number, required: false, default: 7 },
  medication: { type: Number, required: false, default: 0 },
  weight: { type: Number, required: false, default: 140 },
  screen_time: { type: Number, required: false, default: 0 },
});

const entrySchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  entries: {
    type: [SingleEntrySchema],
    default: [],
  },
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
