import fs from "fs";
import mongoose from "mongoose";
import "dotenv/config";
import Tracker from "../models/tracker.ts";
interface SleepEntry {
  timestamp: string;
  sleepMinutes: number;
}

console.log(process.env.MONGODB_USERNAME, "this is the process.env");
const connect = async () =>
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portfolio-website.halgu.mongodb.net/zealthy`,
    )
    .then((res) => {
      console.log("db connected ");
    })
    .catch((err) => {
      console.log(err);
      console.log("Cannot connect to database");
    });
await connect();

const close = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
/**
 * Generates dummy sleep-tracking data in 10-minute intervals
 * for the past `days` days, simulating someone who sleeps
 * roughly 6-8 hours a night with a randomized bedtime.
 */

// can be altered later to generate steps data as well if given the correct parameters
export function generateSleepData(days: number = 7): SleepEntry[] {
  const INTERVAL_MINUTES = 10;
  const entries: SleepEntry[] = [];

  const now = new Date();
  // Start from midnight `days` days ago so each day is complete
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < days; day++) {
    const dayStart = new Date(startDate);
    dayStart.setDate(dayStart.getDate() + day);

    // Randomize bedtime between 22:00 and 23:50 that night
    const bedtimeMinutesFromMidnight =
      22 * 60 + Math.floor(Math.random() * 110);
    // Randomize sleep duration between 6 and 8 hours (in minutes)
    const sleepDurationMinutes = (6 + Math.random() * 2) * 60;

    const sleepStart = new Date(dayStart);
    sleepStart.setMinutes(sleepStart.getMinutes() + bedtimeMinutesFromMidnight);

    const sleepEnd = new Date(sleepStart);
    sleepEnd.setMinutes(sleepEnd.getMinutes() + sleepDurationMinutes);

    // Generate all 10-minute intervals for this calendar day
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    for (
      let current = new Date(dayStart);
      current < dayEnd;
      current.setMinutes(current.getMinutes() + INTERVAL_MINUTES)
    ) {
      const intervalStart = new Date(current);
      const intervalEnd = new Date(current);
      intervalEnd.setMinutes(intervalEnd.getMinutes() + INTERVAL_MINUTES);

      let sleepMinutes = 0;

      // Check overlap between this interval and the sleep window
      // (sleep window may cross midnight into the next calendar day)
      const overlapsSleep =
        (intervalStart >= sleepStart && intervalStart < sleepEnd) ||
        (intervalEnd > sleepStart && intervalEnd <= sleepEnd) ||
        (intervalStart <= sleepStart && intervalEnd >= sleepEnd);

      if (overlapsSleep) {
        // Occasionally simulate a brief wake-up (light interruption)
        const isInterrupted = Math.random() < 0.05;
        sleepMinutes = isInterrupted
          ? Math.floor(Math.random() * 6)
          : INTERVAL_MINUTES;
      }

      entries.push({
        timestamp: intervalStart.toISOString(),
        sleepMinutes,
      });
      //    console.log(entries)
    }
  }

  return entries;
}

let result: any[] = [];

export const assignSleepDataToTrackers = async () => {
  const trackers = await Tracker.find({}).lean().limit(30);
  let documentsArray: any[] = [];

  console.log("TRACKERLIST", trackers);
  trackers.forEach((tracker) => {
    const sleepData = generateSleepData(7);
    const newTrackerData = {
      ...tracker,
      sleep_data: sleepData,
      water_data: Math.floor(Math.random() * 15) + 1,
      steps_data: Math.floor(Math.random() * 10000) + 1,
      calories_data: Math.floor(Math.random() * 2500) + 1,
    };
    documentsArray.push(newTrackerData);
    return newTrackerData;
  });

  // console.log("documentsArray", documentsArray)
  console.log("documents Array", documentsArray);

  await Tracker.deleteMany();
  await Tracker.insertMany(documentsArray);
  result = documentsArray;
};

await assignSleepDataToTrackers()
  .then(() => {
    console.log("Sleep data assigned to trackers");
  })
  .catch((err) => {
    console.error("Error assigning sleep data to trackers:", err);
  });

// const sleepData = generateSleepData(7)
// console.log(JSON.stringify({ data: sleepData }, null, 2))

// parse json
var jsonObj = JSON.parse(`{"sleep_data" :${JSON.stringify(result)}}`);
// console.log(jsonObj);

// stringify JSON Object
var jsonContent = JSON.stringify(result);
// console.log(jsonContent);

fs.writeFile("./sleep-data.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});

close();
