import {
  type SleepData,
  type SleepInterval,
  type SleepSession,
} from "../types.ts";

// Sleep data from zealthy api returns array of objects that represent 10 min intervals
// the data is not enough to fill out the initial weekly sleep chart which is fine
// Now that dummy data isnt being created where it was hardcoded to make sure each night always had long stretches
// of 10 min intervals, this data has long stretches of numbers less than 10 which doesnt really make sense but is fine
// Displaying this data can be the same just having each point on the chart represent total hours slept that night

// how many 0 mins of sleep max before its seen as no longer asleep
const MAX_GAP_INTERVALS = 1;
const MIN_SESSION_MINUTES = 30;

function toUTCDateString(iso: string): string {
  return iso.slice(0, 10); // "2026-09-29T07:50:00Z" -> "2026-09-29"
}

// This reads the sleep data full of only 10 min intervals and organizes them by data to calculate total hours slept
const createSleepSessions = ({ data }: SleepData): SleepSession[] => {
  //
  const intervals = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  // organize interval groups by date
  const sessionsArray: SleepInterval[][] = [];
  let currentSession: SleepInterval[] = [];
  let gapCount = 0;

  for (const item of intervals) {
    if (item.sleepMinutes > 0) {
      currentSession.push(item);
      gapCount = 0;
    } else if (currentSession.length > 0) {
      gapCount += 1;
      if (gapCount > MAX_GAP_INTERVALS) {
        sessionsArray.push(currentSession);
        currentSession = [];
        gapCount = 0;
      } else {
        currentSession.push(item);
      }
    }
  }

  if (currentSession.length > 0) sessionsArray.push(currentSession);

  return sessionsArray
    .map((session) => {
      const totalSleepMinutes = session.reduce(
        (sum, i) => sum + i.sleepMinutes,
        0,
      );
      const first = session[0];
      const last = session[session.length - 1];

      return {
        startTimestamp: first.timestamp,
        endTimestamp: last.timestamp,
        totalSleepMinutes,
        hoursSlept: Math.round((totalSleepMinutes / 60) * 10) / 10,
        date: toUTCDateString(last.timestamp),
        intervals: session,
      };
    })
    .filter((session) => session.totalSleepMinutes >= MIN_SESSION_MINUTES);
};

interface DateRange {
  startTime: Date;
  endTime: Date;
}

export async function fetchSleepSessionsForUser(
  email: string,
  range?: DateRange,
): Promise<SleepSession[]> {
  const params = new URLSearchParams({ email });

  if (range) {
    params.set("startTime", range.startTime.toISOString());
    params.set("endTime", range.endTime.toISOString());
  }
  console.log(range);
  const res = await fetch(
    `https://zealthy-personal-wellness-tracker-a.vercel.app/sleep_data?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(`Sleep API request failed: ${res.status}`);
  }

  const json: SleepData = await res.json();
  return createSleepSessions(json);
}
