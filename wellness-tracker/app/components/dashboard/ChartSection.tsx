import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import * as React from "react";
import { TrackerModel } from "../../types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const aggregateByDay = async (rawData) => {
  const totals = {};

  rawData.forEach(({ timestamp, sleepMinutes }) => {
    const date = new Date(timestamp);
    // Group by calendar date (YYYY-MM-DD)
    const dayKey = date.toISOString().slice(0, 10);
    totals[dayKey] = (totals[dayKey] || 0) + sleepMinutes;
  });

  return Object.entries(totals)
    .map(([day, minutes]) => {
      const date = new Date(day);
      const totalHours = minutes / 60 + 6;
      const wholeHours = Math.floor(totalHours);
      const remainderMinutes = Math.round((totalHours - wholeHours) * 60);
      return {
        day,
        dayLabel: DAY_LABELS[date.getUTCDay()],
        fullDate: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        hours: Math.round(totalHours * 10) / 10,
        durationLabel: `${wholeHours}h ${remainderMinutes}m`,
      };
    })
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-7); // last 7 days
};

const ChartTooltip = ({ active, payload }) => {
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

const ChartSection = ({
  isAnimationActive,
  trackerData,
}: {
  isAnimationActive?: boolean;
  trackerData: TrackerModel;
}) => {
  const [sleepData, setSleepData] = React.useState<Array<any>>();

  React.useEffect(() => {
    console.log("Recent entries", trackerData);
    aggregateByDay(trackerData.sleep_data)
      .then((res) => {
        setSleepData(res);
        console.log("this is the aggregate sleep data", res);
      })
      .catch((err) => {
        console.log("sleep data error");
      });
    // console.log("memo chart data", chartData)
  }, []);
  return (
    <>
      {sleepData ? (
        <div className="bg-[#181B22] border border-neutral-800 rounded-2xl px-6 py-5 min-w-5xl mx-auto">
          <p className="text-xl font-medium text-neutral-50 mb-4">
            Sleep trend, last 7 days
          </p>
          <div className="h-28 min-h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData} barCategoryGap="20%">
                <XAxis
                  dataKey="dayLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8a8a8a", fontSize: 12 }}
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
                  content={
                    <ChartTooltip
                      active={isAnimationActive}
                      payload={sleepData}
                    />
                  }
                  cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {sleepData &&
                    sleepData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === sleepData.length - 1 ? "#7ba7e8" : "#0f2647"
                        }
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default ChartSection;
