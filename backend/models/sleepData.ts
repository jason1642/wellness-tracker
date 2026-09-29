import mongoose from "mongoose";

const { Schema } = mongoose;

// single interval object
const sleepIntervalSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    sleepMinutes: { type: Number, required: true },
  },
  { _id: false },
);

const sleepSessionSchema = new Schema({
  date: { type: Date, required: true },
  startTimestamp: { type: Date, required: true },
  endTimestamp: { type: Date, required: true },
  totalSleepMinutes: { type: Number, required: true },
  hoursSlept: { type: Number, required: true },
  intervals: [sleepIntervalSchema],
});

const sleepDataSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one sleep-data document per user
  },
  sleepSessions: [sleepSessionSchema],
});

const SleepData = mongoose.model("SleepData", sleepDataSchema);

export default SleepData;
