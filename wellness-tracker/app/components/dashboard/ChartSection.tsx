import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import * as React from "react";
import { SleepSession } from "../../types";
import Card from "./CardContainer";
interface ChartDataPoint {
  day: string;
  dayLabel: string;
  dateLabel: string; // "09/29"
  fullDate: string;
  hours: number;
  durationLabel: string;
}
const PAGE_SIZE = 7;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// this will be a number that changes the bar color depending on if the user met the hours slept goal or not
const LOW_SLEEP_HOURS = 7.2;
const BAR_COLORS = {
  normal: "#0f2647",
  normalLatest: "#7ba7e8",
  low: "#4a2c2a",
  lowLatest: "#D97757",
};
function mapSessionsToChartData(sessions: SleepSession[]): ChartDataPoint[] {
  return sessions.map((session) => {
    const date = new Date(session.date);
    const wholeHours = Math.floor(session.totalSleepMinutes / 60);
    const remainderMinutes = session.totalSleepMinutes % 60;
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return {
      day: session.date,
      dayLabel: DAY_LABELS[date.getUTCDay()],
      dateLabel: `${month}/${day}`,
      fullDate: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      hours: session.hoursSlept,
      durationLabel: `${wholeHours}h ${remainderMinutes}m`,
    };
  });
}

function renderAxisTick(pageData: ChartDataPoint[]) {
  // eslint-disable-next-line
  return function AxisTick(props: any) {
    const { x, y, index } = props;
    const point = pageData[index];
    if (!point) return null;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill="#8a8a8a"
          fontSize={16}
        >
          {point.dayLabel}
        </text>
        <text
          x={0}
          y={0}
          dy={26}
          textAnchor="middle"
          fill="#5F6570"
          fontSize={14}
        >
          {point.dateLabel}
        </text>
      </g>
    );
  };
}
// eslint-disable-next-line
const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const { fullDate, durationLabel } = payload[0].payload;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-neutral-400">{fullDate}</p>
      <p className="text-sm font-medium text-neutral-50">
        {durationLabel} slept
      </p>
    </div>
  );
};

//
const ChartSection = ({
  sleepSessions,
}: {
  sleepSessions?: SleepSession[];
}) => {
  const [page, setPage] = React.useState(0); // 0 = most recent 7 sessions
  const allChartData = React.useMemo(
    () =>
      sleepSessions
        ? mapSessionsToChartData(sleepSessions).sort(
            (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
          )
        : [],
    [sleepSessions],
  );

  const totalPages = Math.ceil(allChartData.length / PAGE_SIZE);

  // page 0 = the most recent PAGE_SIZE entries, page 1 = the PAGE_SIZE
  // before that, etc. — reverse the sorted array, chunk, then re-reverse
  // each chunk so it still displays oldest-to-newest left to right.
  const pageData = React.useMemo(() => {
    const reversed = [...allChartData].reverse();
    const chunk = reversed.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE,
    );
    return [...chunk].reverse();
  }, [allChartData, page]);

  const canGoNewer = page > 0;
  const canGoOlder = page < totalPages - 1;

  const rangeLabel =
    pageData.length > 0
      ? `${pageData[0].fullDate} – ${pageData[pageData.length - 1].fullDate}`
      : "";
  return (
    <>
      {sleepSessions ? (
        // <Card>
        <div className="min-w-0 overflow-hidden rounded-xl border border-[#262A33] bg-[#181B22] p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xl font-medium text-neutral-50">Sleep trend</p>
              <p className="text-sm text-neutral-500">{rangeLabel}</p>
              <p className="text-sm text-neutral-500">
                {/* change this cause people might not want to calculate how many minutes is 7.2 hours */}
                Sleep goal: <b>{LOW_SLEEP_HOURS} </b>hours
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canGoOlder}
                aria-label="Previous week"
                className="rounded-md border border-neutral-700 p-1.5 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12.5 5l-5 5 5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={!canGoNewer}
                aria-label="Next week"
                className="rounded-md border border-neutral-700 p-1.5 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M7.5 5l5 5-5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-28 min-h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageData} barCategoryGap="20%">
                {/* line represents threshold of sleep goal where under it it turns orange, should explain this somewhere on ui */}
                <ReferenceLine
                  y={LOW_SLEEP_HOURS}
                  stroke="#D97757"
                  strokeOpacity={0.35}
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="dayLabel"
                  axisLine={false}
                  tickLine={false}
                  height={36}
                  tick={renderAxisTick(pageData)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8a8a8a", fontSize: 12 }}
                  width={32}
                  tickFormatter={(value) => `${Math.floor(value)}h`}
                  domain={[0, "dataMax + 1"]}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {pageData.map((point, index) => {
                    const isLatest =
                      page === 0 && index === pageData.length - 1;
                    const isLow = point.hours < LOW_SLEEP_HOURS;
                    const fill = isLow
                      ? isLatest
                        ? BAR_COLORS.lowLatest
                        : BAR_COLORS.low
                      : isLatest
                        ? BAR_COLORS.normalLatest
                        : BAR_COLORS.normal;
                    // replace this cell component with how barcharts wants me to do it
                    return <Cell key={point.day} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // </Card>
        //
        <Card>
          <div>Loading</div>
        </Card>
      )}
    </>
  );
};

export default ChartSection;
