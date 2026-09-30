// SLEEP TYPES
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

// STEPS TYPES

interface StepDataInterval {
  timestamp: string;
  stepCount: number;
}
//response from zealthy step api
interface StepData {
  user: { email: string };
  data: StepDataInterval[];
}
// sessions total by date
interface DailySteps {
  date: string;
  totalSteps: number;
}

export {
  type SleepInterval,
  type SleepData,
  type SleepSession,
  type StepDataInterval,
  type StepData,
  type DailySteps,
};
