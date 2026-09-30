interface EntryModel {
  user_id: string;
  weight: number;
  medication: number;
  screen_time: number;
  mood: string;
  notes: string;
  date: Date;
  steps: number;
  calories: number;
  water: number;
}
// This is the 10 minute intervals that populate the data value in zealthys api
interface SleepInterval {
  timestamp: string;
  sleepMinutes: number;
}

// This is a single night session that is used to group up minutes and calculate total minutes
// slept each night
interface SleepSession {
  startTimestamp: string;
  endTimestamp: string;
  totalSleepMinutes: number;
  hoursSlept: number;
  // this should date is the morning after the minutes start counting the night before
  date: string;
  intervals: SleepInterval[];
}
// https://zealthy-personal-wellness-tracker-a.vercel.app/sleep_data?email=alice@email.net
interface SleepData {
  user: { email: string };
  sleepSessions: SleepSession[];
}
export {
  type EntryModel,
  type SleepInterval,
  type SleepData,
  type SleepSession,
};
