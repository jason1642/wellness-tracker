// import { useEffect } from "react";
import { Moon, Footprints, Smartphone, GlassWater } from "lucide-react";
import { EntryModel, SleepSession } from "../../types";

interface ITopRowProps {
  entryData: EntryModel[];
  sleepData: SleepSession[];
}
// repurposed to show averages of past 2 weeks, can add more fields when possible
const TopRow: React.FunctionComponent<ITopRowProps> = ({
  entryData,
  sleepData,
}) => {
  // useEffect(() => {
  //   console.log(entryData, sleepData);
  // }, []);
  // maybe dont include todays entry and sleep data values as its always gonna be a low number and
  // it'll bring the average value down
  const average = (values: number[]) =>
    values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : null;
  // two weeks of entries/data
  const recentEntries = [...(entryData ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 14);
  const recentSleepSessions = [...(sleepData ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 14);

  const averageSteps = average(
    recentEntries
      .map((entry) => (entry.steps == null ? Number.NaN : Number(entry.steps)))
      .filter(Number.isFinite),
  );
  const averageScreenTime = average(
    recentEntries
      .map((entry) =>
        entry.screen_time == null ? Number.NaN : Number(entry.screen_time),
      )
      .filter(Number.isFinite),
  );
  const averageWater = average(
    recentEntries
      .map((entry) => (entry.water == null ? Number.NaN : Number(entry.water)))
      .filter(Number.isFinite),
  );
  const averageSleep = average(
    recentSleepSessions
      .map((session) =>
        session.hoursSlept == null ? Number.NaN : Number(session.hoursSlept),
      )
      .filter(Number.isFinite),
  );

  const stats = [
    {
      icon: Moon,
      label: "Sleep",
      value: averageSleep === null ? "—" : `${averageSleep.toFixed(1)}h`,
    },
    {
      icon: Footprints,
      label: "Steps",
      value:
        averageSteps === null ? "—" : Math.round(averageSteps).toLocaleString(),
    },
    {
      icon: Smartphone,
      label: "Screen time",
      value:
        averageScreenTime === null
          ? "—"
          : `${Math.round(averageScreenTime)} min`,
    },
    // water/screentime is placeholder to demonstrate this side bar better
    // wont add hardcoded numbers cause averages can still be calculated when user edits entries
    {
      icon: GlassWater,
      label: "Water",
      value: averageWater === null ? "—" : `${averageWater.toFixed(0)} cups`,
    },
  ];
  // not sure what else to add to make this sidebar look more useful or interactive
  return (
    <div className="mb-4 rounded-2xl border border-neutral-800 bg-[#181B22] p-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-neutral-100">
          14-day averages
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-neutral-800 bg-[#14161C] p-3"
          >
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Icon size={14} strokeWidth={1.75} />
              <span className="truncate text-xs">{label}</span>
            </div>
            <span className="text-2xl font-medium text-neutral-50 tabular-nums">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRow;
