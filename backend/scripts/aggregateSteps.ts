import {
  type StepDataInterval,
  type StepData,
  type DailySteps,
} from "../types.ts";
import { getOneMonthRange } from "./nightlyHoursSlept.ts";

function toUTCDateString(iso: string): string {
  return iso.slice(0, 10); // "2026-08-10T22:10:00Z" -> "2026-08-10"
}

// this function will sum up total steps from 12 am to 11:59 pm
// doesn't worry about 0 values unlike sleep data

const aggregateStepsByDay = (response: StepData): DailySteps[] => {
  const total: Record<string, number> = {};

  for (const interval of response.data) {
    const day = toUTCDateString(interval.timestamp);
    total[day] = (total[day] || 0) + interval.stepCount;
  }

  return Object.entries(total)
    .map(([date, totalSteps]) => ({ date, totalSteps }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

interface DateRange {
  startTime: Date;
  endTime: Date;
}

const fetchDailyStepsForUser = async (
  email: string,
  range?: DateRange,
): Promise<DailySteps[]> => {
  const params = new URLSearchParams({ email });

  if (range) {
    params.set("startTime", range.startTime.toISOString());
    params.set("endTime", range.endTime.toISOString());
  } else {
    const oneMonth = getOneMonthRange();
    params.set("startTime", oneMonth.startTime.toISOString());
    params.set("endTime", oneMonth.endTime.toISOString());
  }

  const res = await fetch(
    `https://zealthy-personal-wellness-tracker-a.vercel.app/step_data?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(`Step API request failed: ${res.status}`);
  }

  const json: StepData = await res.json();
  return aggregateStepsByDay(json);
};

export { fetchDailyStepsForUser };
