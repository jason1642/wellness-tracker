import * as React from "react";
import { updateSingleEntryById } from "../../api-helpers/tracker-api";

interface IRecentEntriesProps {
  // eslint-disable-next-line
  entryData: any;
  // eslint-disable-next-line
  userData: any;
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

const MOOD_OPTIONS = Object.keys(MOOD_STYLE);

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

// Converts an ISO date string to the yyyy-mm-dd format <input type="date"> expects
function toDateInputValue(iso: string) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

const inputClass =
  "w-full rounded-md border border-[#2C303A] bg-[#0F1116] px-2.5 py-1.5 text-sm text-[#F2F3F5] outline-none focus:border-[#5B8DEF]";
const labelClass = "text-[11px] uppercase tracking-wide text-[#5F6570]";

const RecentEntries: React.FunctionComponent<IRecentEntriesProps> = ({
  entryData,
  userData,
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  // eslint-disable-next-line
  const [formValues, setFormValues] = React.useState<any>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // Local copy of entries so a successful save reflects immediately without
  // waiting on a parent refetch. Resyncs whenever new entryData comes in.
  const [entries, setEntries] = React.useState(entryData.entries);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(entryData.entries);
    console.log("entry set state", entryData);
  }, [entryData]);

  const toggleRow = (i: number) => {
    // collapsing the row should also cancel any in-progress edit on it
    if (openIndex === i) {
      setEditIndex(null);
    }
    setOpenIndex((prev) => (prev === i ? null : i));
  };
  // eslint-disable-next-line
  const startEdit = (i: number, entry: any) => {
    setEditIndex(i);
    setSaveError(null);
    setFormValues({
      date: toDateInputValue(entry.date),
      notes: entry.notes || "",
      mood: entry.mood || "neutral",
      hours_slept: entry.hours_slept ?? "",
      weight: entry.weight ?? "",
      screen_time: entry.screen_time ?? "",
      medication: entry.medication ?? "",
    });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setSaveError(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };
  // eslint-disable-next-line
  const saveEdit = async (entry: any) => {
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      date: new Date(formValues.date).toISOString(),
      notes: formValues.notes,
      mood: formValues.mood,
      hours_slept: Number(formValues.hours_slept),
      weight: Number(formValues.weight),
      screen_time: Number(formValues.screen_time),
      medication: Number(formValues.medication),
    };

    try {
      // updateSingleEntryById takes user_id and the specific entry_id being edited
      console.log(
        "TEST HERE",
        {
          user_id: userData._id,
          entry_id: entry._id,
          ...payload,
        },
        userData,
      );
      // eslint-disable-next-line
      const updated = await updateSingleEntryById({
        user_id: userData._id,
        entry_id: entry._id,
        ...payload,
      });

      setEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? { ...e, ...payload } : e)),
      );
      setEditIndex(null);
      // eslint-disable-next-line
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save entry. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111318] p-8 font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <div className="mx-auto max-w-[640px] rounded-xl border border-[#262A33] bg-[#181B22] px-[22px] py-5">
        <h2 className="m-0 mb-4 text-base font-semibold text-[#F2F3F5]">
          Recent entries
        </h2>

        <div className="flex flex-col">
          {entries.map((entry, i) => {
            const mood = MOOD_STYLE[entry.mood] || MOOD_STYLE.neutral;
            const isOpen = openIndex === i;
            const isEditing = editIndex === i;

            return (
              <div
                key={entry._id ?? i}
                className={i === 0 ? "border-t-0" : "border-t border-[#24272F]"}
              >
                {/* Clickable row */}
                <button
                  type="button"
                  onClick={() => toggleRow(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3.5 py-3.5 text-left transition-colors hover:bg-[#1D212B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B8DEF] rounded-md px-1 -mx-1"
                >
                  <div className="w-16 shrink-0 text-[13px] text-[#8B92A1]">
                    {formatDay(entry.date)}
                  </div>

                  <div
                    className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[15px]"
                    style={{ background: `${mood.color}22` }}
                    title={entry.mood}
                  >
                    {mood.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#F2F3F5]">
                      {entry.notes || "No note"}
                    </div>
                    <div className="mt-0.5 text-xs capitalize text-[#8B92A1]">
                      {entry.mood}
                    </div>
                  </div>

                  <div className="min-w-[48px] shrink-0 text-right text-[13px] font-medium text-[#C7CBD3]">
                    {entry.hours_slept}h
                    <div className="text-[11px] font-normal text-[#5F6570]">
                      slept
                    </div>
                  </div>

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

                {/* Expanded panel: read-only view or edit form */}
                {isOpen && (
                  <div className="mb-3 rounded-lg bg-[#14161C] px-4 py-3.5">
                    {!isEditing ? (
                      <>
                        <div className="mb-3 text-xs text-[#5F6570]">
                          {formatFullDate(entry.date)}
                        </div>

                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                          <div>
                            <dt className={labelClass}>Mood</dt>
                            <dd className="mt-0.5 text-sm capitalize text-[#F2F3F5]">
                              {mood.emoji} {entry.mood}
                            </dd>
                          </div>

                          <div>
                            <dt className={labelClass}>Hours slept</dt>
                            <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                              {entry.hours_slept}h
                            </dd>
                          </div>

                          {entry.weight !== undefined && (
                            <div>
                              <dt className={labelClass}>Weight</dt>
                              <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                                {entry.weight} lbs
                              </dd>
                            </div>
                          )}

                          {entry.medication !== undefined && (
                            <div>
                              <dt className={labelClass}>Medication</dt>
                              <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                                {entry.medication}
                              </dd>
                            </div>
                          )}

                          {entry.screen_time !== undefined && (
                            <div>
                              <dt className={labelClass}>Screen time</dt>
                              <dd className="mt-0.5 text-sm text-[#F2F3F5]">
                                {entry.screen_time} min
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div className="mt-3 border-t border-[#24272F] pt-3">
                          <dt className={labelClass}>Notes</dt>
                          <dd className="mt-0.5 text-sm text-[#C7CBD3]">
                            {entry.notes || "No note"}
                          </dd>
                        </div>

                        <button
                          type="button"
                          onClick={() => startEdit(i, entry)}
                          className="mt-4 rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#C7CBD3] transition-colors hover:bg-[#1D212B]"
                        >
                          Edit entry
                        </button>
                      </>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                          <div>
                            <label className={labelClass} htmlFor={`date-${i}`}>
                              Date
                            </label>
                            <input
                              id={`date-${i}`}
                              type="date"
                              className={`${inputClass} mt-1`}
                              value={formValues.date}
                              onChange={(e) =>
                                handleFieldChange("date", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label className={labelClass} htmlFor={`mood-${i}`}>
                              Mood
                            </label>
                            <select
                              id={`mood-${i}`}
                              className={`${inputClass} mt-1 capitalize`}
                              value={formValues.mood}
                              onChange={(e) =>
                                handleFieldChange("mood", e.target.value)
                              }
                            >
                              {MOOD_OPTIONS.map((m) => (
                                <option
                                  key={m}
                                  value={m}
                                  className="capitalize"
                                >
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`sleep-${i}`}
                            >
                              Hours slept
                            </label>
                            <input
                              id={`sleep-${i}`}
                              type="number"
                              step="0.1"
                              className={`${inputClass} mt-1`}
                              value={formValues.hours_slept}
                              onChange={(e) =>
                                handleFieldChange("hours_slept", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`weight-${i}`}
                            >
                              Weight (lbs)
                            </label>
                            <input
                              id={`weight-${i}`}
                              type="number"
                              step="0.1"
                              className={`${inputClass} mt-1`}
                              value={formValues.weight}
                              onChange={(e) =>
                                handleFieldChange("weight", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`medication-${i}`}
                            >
                              Medication
                            </label>
                            <input
                              id={`medication-${i}`}
                              type="number"
                              className={`${inputClass} mt-1`}
                              value={formValues.medication}
                              onChange={(e) =>
                                handleFieldChange("medication", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`screen-time-${i}`}
                            >
                              Screen time (min)
                            </label>
                            <input
                              id={`screen-time-${i}`}
                              type="number"
                              className={`${inputClass} mt-1`}
                              value={formValues.screen_time}
                              onChange={(e) =>
                                handleFieldChange("screen_time", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-3 border-t border-[#24272F] pt-3">
                          <label className={labelClass} htmlFor={`notes-${i}`}>
                            Notes
                          </label>
                          <textarea
                            id={`notes-${i}`}
                            rows={2}
                            className={`${inputClass} mt-1 resize-none`}
                            value={formValues.notes}
                            onChange={(e) =>
                              handleFieldChange("notes", e.target.value)
                            }
                          />
                        </div>

                        {saveError && (
                          <div className="mt-3 text-xs text-[#D97757]">
                            {saveError}
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => saveEdit(entry)}
                            className="rounded-md bg-[#5B8DEF] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4A7BDB] disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save changes"}
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={cancelEdit}
                            className="rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#C7CBD3] transition-colors hover:bg-[#1D212B] disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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
