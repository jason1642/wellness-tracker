// This is the 10 minute intervals that populate the data value in zealthys api
interface SleepInterval {
  timestamp: string;
  sleepMinutes: number;
}
// https://zealthy-personal-wellness-tracker-a.vercel.app/sleep_data?email=alice@email.net
interface SleepData {
  user: { email: string };
  data: SleepInterval[];
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

export { type SleepInterval, type SleepData, type SleepSession };
