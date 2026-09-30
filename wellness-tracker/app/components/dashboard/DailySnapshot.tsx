import * as React from "react";

// -- Types -------------------------------------------------------------

interface TodayEntry {
  mood?: string;
  weight?: number;
  medication?: number;
  screen_time?: number;
}

interface IDailySnapshotProps {
  selectedDate: Date;
  sleepHours?: number; // device-sourced, from SleepData — read-only here
  stepsToday?: number; // device-sourced, from Tracker/step API — read-only here
  todayEntry?: TodayEntry; // user-authored, from today's Entry — editable
  onSaveField: (
    field: keyof TodayEntry,
    value: string | number,
  ) => Promise<void>;
}

const MOOD_STYLE: Record<string, { emoji: string; color: string }> = {
  happy: { emoji: "🙂", color: "#7FB8A0" },
  energetic: { emoji: "⚡", color: "#E8C468" },
  calm: { emoji: "😌", color: "#7FB8A0" },
  content: { emoji: "🙂", color: "#7FB8A0" },
  neutral: { emoji: "😐", color: "#9AA3AF" },
  tired: { emoji: "😴", color: "#9AA3AF" },
  stressed: { emoji: "😣", color: "#D97757" },
  anxious: { emoji: "😟", color: "#D97757" },
  low: { emoji: "😔", color: "#D97757" },
};
const MOOD_OPTIONS = Object.keys(MOOD_STYLE);

type MetricKey =
  | "sleep"
  | "steps"
  | "mood"
  | "weight"
  | "medication"
  | "screen_time";

interface MetricDef {
  key: MetricKey;
  label: string;
  icon: string;
  value: string;
  subLabel: string;
  editable: boolean;
  source: string; // shown in the detail panel, explains where the number comes from
}

const inputClass =
  "w-full rounded-md border border-[#2C303A] bg-[#0F1116] px-2.5 py-1.5 text-sm text-[#F2F3F5] outline-none focus:border-[#7FB8A0]";

const DailySnapshot: React.FunctionComponent<IDailySnapshotProps> = ({
  sleepHours,
  stepsToday,
  todayEntry,
  onSaveField,
}) => {
  const [openMetric, setOpenMetric] = React.useState<MetricKey | null>(null);
  const [draftValue, setDraftValue] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mood = todayEntry?.mood ? MOOD_STYLE[todayEntry.mood] : undefined;

  const metrics: MetricDef[] = [
    {
      key: "sleep",
      label: "Sleep",
      icon: "🌙",
      value: sleepHours !== undefined ? `${sleepHours}h` : "—",
      subLabel: "last night",
      editable: false,
      source: "Synced automatically from your sleep tracker overnight.",
    },
    {
      key: "steps",
      label: "Steps",
      icon: "🦶",
      value: stepsToday !== undefined ? stepsToday.toLocaleString() : "—",
      subLabel: "today",
      editable: false,
      source: "Synced automatically from your step tracker throughout the day.",
    },
    {
      key: "mood",
      label: "Mood",
      icon: mood?.emoji ?? "😐",
      value: todayEntry?.mood
        ? todayEntry.mood.charAt(0).toUpperCase() + todayEntry.mood.slice(1)
        : "Not logged",
      subLabel: "today",
      editable: true,
      source: "Logged by you — tap to update.",
    },
    {
      key: "weight",
      label: "Weight",
      icon: "⚖️",
      value:
        todayEntry?.weight !== undefined
          ? `${todayEntry.weight} lbs`
          : "Not logged",
      subLabel: "today",
      editable: true,
      source: "Logged by you — tap to update.",
    },
    {
      key: "medication",
      label: "Medication",
      icon: "💊",
      value:
        todayEntry?.medication !== undefined
          ? `${todayEntry.medication}`
          : "Not logged",
      subLabel: "doses today",
      editable: true,
      source: "Logged by you — tap to update.",
    },
    {
      key: "screen_time",
      label: "Screen time",
      icon: "📱",
      value:
        todayEntry?.screen_time !== undefined
          ? `${todayEntry.screen_time} min`
          : "Not logged",
      subLabel: "today",
      editable: true,
      source: "Logged by you — tap to update.",
    },
  ];

  const openMetricDef = metrics.find((m) => m.key === openMetric);

  const handleCardClick = (metric: MetricDef) => {
    setError(null);
    if (openMetric === metric.key) {
      setOpenMetric(null);
      return;
    }
    setOpenMetric(metric.key);
    if (metric.editable) {
      if (metric.key === "mood") {
        setDraftValue(todayEntry?.mood ?? "neutral");
      } else if (metric.key === "weight") {
        setDraftValue(todayEntry?.weight?.toString() ?? "");
      } else if (metric.key === "medication") {
        setDraftValue(todayEntry?.medication?.toString() ?? "");
      } else if (metric.key === "screen_time") {
        setDraftValue(todayEntry?.screen_time?.toString() ?? "");
      }
    }
  };

  const handleSave = async () => {
    if (!openMetric || openMetric === "sleep" || openMetric === "steps") return;
    setIsSaving(true);
    setError(null);
    try {
      const value = openMetric === "mood" ? draftValue : Number(draftValue);
      await onSaveField(openMetric, value);
      setOpenMetric(null);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err?.message || "Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#262A33] bg-[#181B22] p-4">
      <h2 className="mb-3 text-sm font-semibold text-[#8B92A1]">
        Daily snapshot
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => {
          const isOpen = openMetric === metric.key;
          return (
            <button
              key={metric.key}
              type="button"
              onClick={() => handleCardClick(metric)}
              className={`flex min-w-0 flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors ${
                isOpen
                  ? "border-[#7FB8A0] bg-[#1D212B]"
                  : "border-[#262A33] bg-[#14161C] hover:bg-[#1D212B]"
              }`}
            >
              <span className="text-base">{metric.icon}</span>
              <span className="mt-1 w-full truncate text-base font-semibold text-[#F2F3F5]">
                {metric.value}
              </span>
              <span className="w-full truncate text-[11px] text-[#8B92A1]">
                {metric.label} · {metric.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail / edit panel for whichever metric is selected */}
      {openMetricDef && (
        <div className="mt-3 rounded-lg border border-[#262A33] bg-[#14161C] px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-[#F2F3F5]">
              {openMetricDef.label}
            </p>
            <button
              type="button"
              onClick={() => setOpenMetric(null)}
              className="text-xs text-[#8B92A1] hover:text-[#F2F3F5]"
            >
              Close
            </button>
          </div>

          <p className="mb-3 text-xs text-[#5F6570]">{openMetricDef.source}</p>

          {openMetricDef.editable && (
            <>
              {openMetricDef.key === "mood" ? (
                <select
                  className={inputClass}
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m} className="capitalize">
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  step={openMetricDef.key === "weight" ? "0.1" : "1"}
                  className={inputClass}
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  placeholder={
                    openMetricDef.key === "weight"
                      ? "lbs"
                      : openMetricDef.key === "screen_time"
                        ? "minutes"
                        : "doses"
                  }
                />
              )}

              {error && (
                <div className="mt-2 text-xs text-[#D97757]">{error}</div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="rounded-md bg-[#7FB8A0] px-3 py-1.5 text-xs font-medium text-[#0F1116] transition-colors hover:bg-[#6FA890] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setOpenMetric(null)}
                  className="rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#C7CBD3] transition-colors hover:bg-[#1D212B] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DailySnapshot;
