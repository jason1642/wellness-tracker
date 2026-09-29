import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.ts";
import SleepData from "../models/sleepData.ts";
import { fetchSleepSessionsForUser } from "../scripts/nightlyHoursSlept.ts";

const connectToDatabase = async () =>
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

function toISODate(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00.000Z`);
}

const sameCalendarDate = (a: Date, b: Date): boolean => {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
};

const getOneMonthRange = () => {
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setDate(startTime.getDate() - 30);
  //   Important - end time should be a date further in the past than start time
  return { startTime: endTime, endTime: startTime };
};

// This will sync users based on emails to fetch sleep data from zealthys api and
// incorporate it within this database, it can be used at any point. im not sure if i should
// include an intervals data dump within sleed data or just organize them in sessions as they are received.
// When the user uploads their sleep interval logs via device or whatever that data should be stored atleast temporarily
// before running a session parse function so maybe have all intervals stored, in a larger scale project
// this can be very data intensive so limiting the backlog to 2 weeks for example can save on memory since
// dates are static and users cant inject data as much as they want

const syncUser = async (user: InstanceType<typeof User>) => {
  console.log(`Syncing sleep data for ${user.email}...`);
  const range = getOneMonthRange();

  let sessions;
  try {
    sessions = await fetchSleepSessionsForUser(user.email, range);
  } catch (err) {
    console.error(`  Failed to fetch sleep data for ${user.email}:`, err);
    return;
  }

  if (sessions.length === 0) {
    console.log(`  No sleep sessions found for ${user.email}`);
    return;
  }

  let sleepDataDoc = await SleepData.findOne({ user_id: user._id });
  if (!sleepDataDoc) {
    sleepDataDoc = new SleepData({ user_id: user._id, sleepSessions: [] });
  }

  let created = 0;
  let updated = 0;

  for (const session of sessions) {
    const date = toISODate(session.date);

    const existing = sleepDataDoc.sleepSessions.find((s: any) =>
      sameCalendarDate(s.date, date),
    );

    const sessionFields = {
      date,
      startTimestamp: new Date(session.startTimestamp),
      endTimestamp: new Date(session.endTimestamp),
      totalSleepMinutes: session.totalSleepMinutes,
      hoursSlept: session.hoursSlept,
      intervals: session.intervals.map((p) => ({
        timestamp: new Date(p.timestamp),
        sleepMinutes: p.sleepMinutes,
      })),
    };

    if (existing) {
      // update in place rather than removing/re-pushing, so its _id
      // stays stable across syncs
      Object.assign(existing, sessionFields);
      updated += 1;
    } else {
      sleepDataDoc.sleepSessions.push(sessionFields);
      created += 1;
    }
  }

  await sleepDataDoc.save();
  console.log(
    `  Done — ${created} new session(s) created, ${updated} updated.`,
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
