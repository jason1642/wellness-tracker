import * as React from "react";
// import { TrackerModel } from '../../types'

interface IRecentEntriesProps {
  entryData: any;
}

const MOOD_STYLE = {
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

function formatDay(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const RecentEntries: React.FunctionComponent<IRecentEntriesProps> = ({
  entryData,
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const toggleRow = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  React.useEffect(() => {
    console.log("Entry section", entryData);
  }, []);
  return (
    <div className="min-h-screen bg-[#111318] p-8 font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <div className="mx-auto max-w-[640px] rounded-xl border border-[#262A33] bg-[#181B22] px-[22px] py-5">
        <h2 className="m-0 mb-4 text-base font-semibold text-[#F2F3F5]">
          Recent entries
        </h2>

        <div className="flex flex-col">
          {entryData.entries.map((entry, i) => {
            const mood = MOOD_STYLE[entry.mood] || MOOD_STYLE.neutral;
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className={i === 0 ? "border-t-0" : "border-t border-[#24272F]"}
              >
                {/* Clickable row */}
                <button
                  type="button"
                  onClick={() => toggleRow(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3.5 py-3.5 text-left transition-colors hover:bg-[#1D212B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B8DEF] rounded-md px-1 -mx-1"
                >
                  {/* Date column */}
                  <div className="w-16 shrink-0 text-[13px] text-[#8B92A1]">
                    {formatDay(entry.date)}
                  </div>

                  {/* Mood chip */}
                  <div
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[15px] ${mood.bg}`}
                    title={entry.mood}
                  >
                    {mood.emoji}
                  </div>

                  {/* Note + mood label */}
                  <div className="min-w-0 flex-1">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#F2F3F5]">
                      {entry.notes || "No note"}
                    </div>
                    <div className="mt-0.5 text-xs capitalize text-[#8B92A1]">
                      {entry.mood}
                    </div>
                  </div>

                  {/* Sleep hours */}
                  <div className="min-w-[48px] shrink-0 text-right text-[13px] font-medium text-[#C7CBD3]">
                    {entry.hours_slept}h
                    <div className="text-[11px] font-normal text-[#5F6570]">
                      slept
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`h-4 w-4 shrink-0 text-[#5F6570] transition-transform duration-150 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Expanded detail panel */}
                {isOpen && (
                  <div className="mb-3 rounded-lg bg-[#14161C] px-4 py-3.5">
                    <div className="mb-3 text-xs text-[#5F6570]">
                      {formatFullDate(entry.date)}
                    </div>

                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                          Mood
                        </dt>
                        <dd className="mt-0.5 text-sm capitalize text-[#F2F3F5]">
                          {mood.emoji} {entry.mood}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                          Hours slept
                        </dt>
                        <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                          {entry.hours_slept}h
                        </dd>
                      </div>

                      {entry.weight !== undefined && (
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                            Weight
                          </dt>
                          <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                            {entry.weight} lbs
                          </dd>
                        </div>
                      )}

                      {entry.medication !== undefined && (
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                            Medication
                          </dt>
                          <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                            {entry.medication}
                          </dd>
                        </div>
                      )}

                      {entry.screen_time !== undefined && (
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                            Screen time
                          </dt>
                          <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                            {entry.screen_time} min
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-3 border-t border-[#24272F] pt-3">
                      <dt className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                        Notes
                      </dt>
                      <dd className="mt-0.5 text-sm text-[#C7CBD3]">
                        {entry.notes || "No note"}
                      </dd>
                    </div>
                    <button>edit</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentEntries;
