interface TrackerModel {
  user_id: string;
  // eslint-disable-next-line
  sleep_data: any;
  steps_data: number;
  calories_data: number;
  water_data: number;
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
  type TrackerModel,
  type SleepInterval,
  type SleepData,
  type SleepSession,
};
