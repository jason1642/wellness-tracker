import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.ts";
import Entry from "../models/entry.ts";
import { fetchDailyStepsForUser } from "./aggregateSteps.ts";
import {
  toISODate,
  sameCalendarDate,
  getOneMonthRange,
} from "./helper-functions.ts";
// This will use the aggregate steps script to organize the fetched steps data
// into sessions to insert them into its respective entry document based on the dates matched

const connectToDatabase = async () =>
  await mongoose
    .connect(`${process.env.MONGODB_URI}`)
    .then((res) => {
      console.log("db connected ");
    })
    .catch((err) => {
      console.log(err);
      console.log("Cannot connect to database");
    });

const syncUser = async (user: InstanceType<typeof User>) => {
  console.log("syncing steps data");
  const range = getOneMonthRange();
  let dailySteps;

  try {
    dailySteps = await fetchDailyStepsForUser(user.email, range);
  } catch (err) {
    console.error(`failed to get data for ${user.email}`, err);
    return;
  }

  if (dailySteps.length === 0) {
    console.log(`no step data was found for ${user.email}`);
    return;
  }

  let entryDoc = await Entry.findOne({ user_id: user._id });
  if (!entryDoc) {
    entryDoc = new Entry({ user_id: user._id, entries: [] });
  }

  let created = 0;
  let updated = 0;

  for (const day of dailySteps) {
    const date = toISODate(day.date);
    const existing = entryDoc.entries.find((e: any) =>
      sameCalendarDate(e.date, date),
    );

    if (existing) {
      existing.steps = day.totalSteps;
      updated += 1;
    } else {
      entryDoc.entries.push({ date, steps: day.totalSteps });
      created += 1;
    }
  }
  await entryDoc.save();
  console.log(
    `completed — ${created} new entr${created === 1 ? "y" : "ies"} created, ${updated} updated.`,
  );
};

async function main() {
  await connectToDatabase();

  const users = await User.find({});
  console.log(`Found ${users.length} user(s) to sync.\n`);

  for (const user of users) {
    await syncUser(user);
  }

  console.log("\nSync complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Sync script failed:", err);
  process.exit(1);
});
