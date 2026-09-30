import { useState, useEffect, useMemo } from "react";
import {
  updateSingleEntryById,
  createNewEntry,
  deleteEntry,
} from "../../api-helpers/entry-api";

interface IRecentEntriesProps {
  // eslint-disable-next-line
  entryData: any[];
  userId: string;
  sleepByDate?: Map<string, number>;
}
// This is the createNewEntry function, add user input into the data prop aswell as user_id
// export const createNewEntry = async (data) =>
//  await api.post(`/entry/${data.user_id}`).then(res=>res).catch(err=>err)

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

function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString(undefined, { month: "short" }),
  };
}

const Metric = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) => (
  <div className="flex items-center gap-2 rounded-lg bg-[#14161C] px-2.5 py-1.5">
    <span className="text-sm">{icon}</span>
    <div className="leading-tight">
      <div className="text-[13px] font-medium text-[#F2F3F5]">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[#5F6570]">
        {label}
      </div>
    </div>
  </div>
);

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const inputClass =
  "w-full rounded-md border border-[#2C303A] bg-[#0F1116] px-2.5 py-1.5 text-sm text-[#F2F3F5] outline-none focus:border-[#5B8DEF]";
const labelClass = "text-[11px] uppercase tracking-wide text-[#5F6570]";
function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}
const emptyFormValues = {
  date: todayInputValue(),
  notes: "",
  mood: "neutral",
  hours_slept: "",
  weight: "",
  screen_time: "",
  medication: "",
};

const RecentEntries: React.FunctionComponent<IRecentEntriesProps> = ({
  entryData,
  userId,
  sleepByDate,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // eslint-disable-next-line
  const [formValues, setFormValues] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [newEntryValues, setNewEntryValues] = useState(emptyFormValues);
  const [isCreatingSave, setIsCreatingSave] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // eslint-disable-next-line
  const [entries, setEntries] = useState<any[]>(entryData ?? []);

  useEffect(() => {
    // eslint-disable-next-line
    setEntries(entryData ?? []);
  }, [entryData]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [entries]);

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
      // date: toDateInputValue(entry.date),
      notes: entry.notes || "",
      mood: entry.mood || "neutral",
      calories: entry.calories ?? "",
      water: entry.water ?? "",

      // hours_slept: entry.hours_slept ?? "",
      weight: entry.weight ?? "",
      screen_time: entry.screen_time ?? "",
      medication: entry.medication ?? "",
    });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setSaveError(null);
  };
  const handleNewEntryFieldChange = (field: string, value: string) => {
    setNewEntryValues((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateForm = () => {
    // opening a new-entry form should colapse any expanded /editing row
    setOpenIndex(null);
    setEditIndex(null);
    setCreateError(null);
    setNewEntryValues(emptyFormValues);
    setIsCreating(true);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setCreateError(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };
  // eslint-disable-next-line
  const saveEdit = async (entry: any) => {
    setIsSaving(true);
    setSaveError(null);
    const toNum = (v: unknown) => (v === "" || v == null ? null : Number(v));

    const payload = {
      calories: toNum(formValues.calories),
      water: toNum(formValues.water),
      notes: formValues.notes,
      mood: formValues.mood,
      weight: Number(formValues.weight),
      screen_time: Number(formValues.screen_time),
      medication: Number(formValues.medication),
    };

    try {
      await updateSingleEntryById({
        user_id: userId,
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

  const saveNewEntry = async () => {
    setIsCreatingSave(true);
    setCreateError(null);

    const payload = {
      date: new Date(newEntryValues.date).toISOString(),
      notes: newEntryValues.notes,
      mood: newEntryValues.mood,
      // hours_slept: Number(newEntryValues.hours_slept),
      weight: Number(newEntryValues.weight),
      screen_time: Number(newEntryValues.screen_time),
      medication: Number(newEntryValues.medication),
    };

    try {
      const created = await createNewEntry({
        user_id: userId,
        ...payload,
      });
      // console.log("this is the created entry", payload);
      // Fall back to a locally-generated temp id if the API response doesn't
      // hand back the new entry's real _id for some reason.
      const returnedEntries = created?.data?.entries;

      const createdEntry =
        returnedEntries && returnedEntries.length > 0
          ? returnedEntries[returnedEntries.length - 1]
          : { ...payload, _id: `temp-${Date.now()}` };

      setEntries((prev) => [createdEntry, ...prev]);
      // if (created?.data?.entries) {
      //   setEntries(created.data.entries);
      // }
      console.log("!!!this is the entries state after creation", entries);
      setIsCreating(false);
      // eslint-disable-next-line
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create entry. Try again.");
    } finally {
      setIsCreatingSave(false);
    }
  };
  // eslint-disable-next-line
  const handleDelete = async (entry: any) => {
    setIsDeleting(true);
    setDeleteError(null);
    console.log(entry);
    console.log(userId);
    try {
      await deleteEntry({
        user_id: userId,
        entry_id: entry._id,
      });

      setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      setOpenIndex(null); // collapse the row since it no longer exists
      // eslint-disable-next-line
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete entry. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  // sort entries by date, not date created
  // right now the user can create notes with dates in the future - fix later
  // fix the entry row to not have date and emote backgrounds and not have a column flex in the middle section
  // also have pagnation or date/month search rather than have it go down infinitely
  // include uneditable steps in form, have the notes attribute look more attractive to edit or see
  return (
    <div className="w-full rounded-xl border border-[#262A33] bg-[#181B22] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-base font-semibold text-[#F2F3F5]">
          Recent entries
        </h2>
        <button
          type="button"
          onClick={isCreating ? cancelCreate : openCreateForm}
          className="flex items-center gap-1.5 rounded-md bg-[#7FB8A0] px-3 py-1.5 text-xs font-medium text-[#0F1116] transition-colors hover:bg-[#6FA890]"
        >
          {/* nav row buttons to exit creation mode */}
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 4v12M4 10h12" strokeLinecap="round" />
              </svg>
              New entry
            </>
          )}
        </button>
      </div>

      {/* entry form to create not edit*/}
      {isCreating && (
        <div className="mb-4 rounded-lg border border-[#262A33] bg-[#14161C] px-4 py-3.5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="new-mood">
                Mood
              </label>
              <select
                id="new-mood"
                className={`${inputClass} mt-1 capitalize`}
                value={newEntryValues.mood}
                onChange={(e) =>
                  handleNewEntryFieldChange("mood", e.target.value)
                }
              >
                {MOOD_OPTIONS.map((m) => (
                  <option key={m} value={m} className="capitalize">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="new-sleep">
                Hours slept
              </label>
              <input
                id="new-sleep"
                type="number"
                step="0.1"
                className={`${inputClass} mt-1`}
                value={newEntryValues.hours_slept}
                onChange={(e) =>
                  handleNewEntryFieldChange("hours_slept", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="new-weight">
                Weight (lbs)
              </label>
              <input
                id="new-weight"
                type="number"
                step="0.1"
                className={`${inputClass} mt-1`}
                value={newEntryValues.weight}
                onChange={(e) =>
                  handleNewEntryFieldChange("weight", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="new-medication">
                Medication
              </label>
              <input
                id="new-medication"
                type="number"
                className={`${inputClass} mt-1`}
                value={newEntryValues.medication}
                onChange={(e) =>
                  handleNewEntryFieldChange("medication", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="new-screen-time">
                Screen time (min)
              </label>
              <input
                id="new-screen-time"
                type="number"
                className={`${inputClass} mt-1`}
                value={newEntryValues.screen_time}
                onChange={(e) =>
                  handleNewEntryFieldChange("screen_time", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-3 border-t border-[#24272F] pt-3">
            <label className={labelClass} htmlFor="new-notes">
              Notes
            </label>
            <textarea
              id="new-notes"
              rows={2}
              className={`${inputClass} mt-1 resize-none`}
              value={newEntryValues.notes}
              onChange={(e) =>
                handleNewEntryFieldChange("notes", e.target.value)
              }
            />
          </div>

          {createError && (
            <div className="mt-3 text-xs text-[#D97757]">{createError}</div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={isCreatingSave}
              onClick={saveNewEntry}
              className="rounded-md bg-[#7FB8A0] px-3 py-1.5 text-xs font-medium text-[#0F1116] transition-colors hover:bg-[#6FA890] disabled:opacity-50"
            >
              {isCreatingSave ? "Saving..." : "Save entry"}
            </button>
            <button
              type="button"
              disabled={isCreatingSave}
              onClick={cancelCreate}
              className="rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#C7CBD3] transition-colors hover:bg-[#1D212B] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {sortedEntries.map((entry, i) => {
          const dateKey = String(entry.date).slice(0, 10);
          const hours = sleepByDate?.get(dateKey) ?? entry.hours_slept;
          const hasSleep = hours != null && hours !== "";
          const mood = MOOD_STYLE[entry.mood] || MOOD_STYLE.neutral;
          const isOpen = openIndex === i;
          const isEditing = editIndex === i;
          const { weekday, day, month } = dateParts(entry.date);

          return (
            <div
              key={entry._id ?? i}
              className={`rounded-xl border transition-colors ${
                isOpen
                  ? "border-[#2C303A] bg-[#1A1D25]"
                  : "border-[#24272F] bg-[#16181F] hover:border-[#2C303A] hover:bg-[#1A1D25]"
              }`}
            >
              {/* Clickable row */}
              <button
                type="button"
                onClick={() => toggleRow(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B8DEF]"
              >
                <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-[#14161C] py-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-[#5F6570]">
                    {weekday}
                  </span>
                  <span className="text-lg font-semibold leading-none text-[#F2F3F5]">
                    {day}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#8B92A1]">
                    {month}
                  </span>
                </div>

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${mood.color}22` }}
                  title={entry.mood}
                >
                  {mood.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium text-[#F2F3F5]">
                    {entry.notes || "No note"}
                  </div>
                  <div className="mt-0.5 text-[15px] truncate text-[#8B92A1]">
                    <span className="capitalize">
                      {entry.mood || "No mood"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {entry.weight != null && entry.weight !== "" && (
                      <Metric
                        icon="⚖️"
                        value={`${entry.weight} lbs`}
                        label="Weight"
                      />
                    )}
                    {entry.screen_time != null && entry.screen_time !== "" && (
                      <Metric
                        icon="📱"
                        value={`${entry.screen_time} min`}
                        label="Screen"
                      />
                    )}
                    {entry.screen_time != null && entry.screen_time !== "" && (
                      <Metric
                        icon="👟"
                        value={`${entry.steps}`}
                        label="Steps"
                      />
                    )}
                    {entry.medication != null && entry.medication !== "" && (
                      <Metric
                        icon="💊"
                        value={String(entry.medication)}
                        label="Meds"
                      />
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {/* {hasSleep ? `${hours}h` : "—"} */}
                  <div className="text-right">
                    <div className="text-xl font-semibold text-[#F2F3F5]">
                      {hasSleep ? `${hours}h` : "—"}
                    </div>
                    <div className="text-[11px] uppercase tracking-wide text-[#5F6570]">
                      slept
                    </div>
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

              {/* drop down read only view or edit form */}
              {isOpen && (
                <div className="mb-3 mx-3 rounded-lg bg-[#14161C] px-4 py-3.5">
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
                            {hasSleep ? `${hours}h` : "—"}
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

                      {deleteError && (
                        <div className="mb-2 text-xs text-[#D97757]">
                          {deleteError}
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(i, entry)}
                          className="rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#C7CBD3] transition-colors hover:bg-[#1D212B]"
                        >
                          Edit entry
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(entry)}
                          className="rounded-md border border-[#2C303A] px-3 py-1.5 text-xs font-medium text-[#D97757] transition-colors hover:bg-[#1D212B] disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete entry"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                        <div>
                          <div className={labelClass}>Date</div>
                          <div className="mt-1 text-sm text-[#F2F3F5]">
                            {formatFullDate(entry.date)}
                          </div>
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
                              <option key={m} value={m} className="capitalize">
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className={labelClass}>Hours slept</div>
                          <div className="mt-1 text-sm text-[#F2F3F5]">
                            {hasSleep ? `${hours}h` : "—"}
                          </div>
                        </div>

                        <div>
                          <label className={labelClass} htmlFor={`weight-${i}`}>
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
  );
};

export default RecentEntries;
