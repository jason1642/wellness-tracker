"use client";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getEntriesByUserId } from "../api-helpers/entry-api";
import TopRow from "../components/dashboard/TopRow";
import ChartSection from "../components/dashboard/ChartSection";
import RecentEntries from "../components/dashboard/RecentEntries";
import Calendar from "../components/dashboard/Calendar";
import DailySnapshot from "../components/dashboard/DailySnapshot";
import { verifyUser } from "../api-helpers/user-api";
import {
  getSleepDataByUserId,
  updateSingleEntryById,
  createNewEntry,
} from "../api-helpers/entry-api";
import { EntryModel } from "../types";
// eslint-disable-next-line
interface IDashboardProps {}
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 1. Verify the user first — the dashboard query depends on their _id.
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => verifyUser(),
  });
  const userId = userData?.data?._id;
  const queryClient = useQueryClient();

  const { data: sleepData, isLoading: isSleepLoading } = useQuery({
    queryKey: ["sleep", userId],
    queryFn: () =>
      getSleepDataByUserId(userId)
        .then((res) => res.data)
        .catch(() => null),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  console.log(userData?.data);
  const entryData = userData?.data?.entry?.entries ?? [];
  console.log("entry data", entryData);
  // Union of every date that has either a logged entry or a sleep session —
  // drives the small dots under days in the calendar.
  const datesWithData = useMemo(() => {
    const set = new Set<string>();
    console.log("entry data memo", entryData);
    // eslint-disable-next-line
    entryData?.forEach((e: any) => set.add(toDateKey(new Date(e.date))));
    console.log(sleepData);
    // eslint-disable-next-line
    sleepData?.forEach((s: any) => set.add(toDateKey(new Date(s.date))));
    return set;
  }, [entryData, sleepData]);

  const selectedKey = toDateKey(selectedDate);

  const selectedEntry = useMemo(
    () =>
      // eslint-disable-next-line
      entryData.find((e: any) => String(e.date).slice(0, 10) === selectedKey),
    [entryData, selectedKey],
  );

  const selectedSleep = useMemo(
    () =>
      // eslint-disable-next-line
      sleepData?.find((s: any) => toDateKey(new Date(s.date)) === selectedKey),
    [sleepData, selectedKey],
  );

  const handleSaveField = async (
    field: keyof EntryModel,
    value: string | number,
  ) => {
    if (!userId) return;
    if (selectedEntry) {
      await updateSingleEntryById({
        user_id: userId,
        entry_id: selectedEntry._id,
        [field]: value,
      });
    } else {
      await createNewEntry({
        user_id: userId,
        date: new Date(selectedKey).toISOString(),
        [field]: value,
      });
    }
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };
  if (isUserLoading) return <div>loading...</div>;
  if (isUserError || !userData.data) {
    return <div>You need to be logged in to view this page.</div>;
  }
  return (
    <div className="mx-auto w-full bg-[#111318]  max-w-7xl p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#F2F3F5]">Dashboard</h2>

      <div className="grid gap-4 lg:grid-cols-[288px_minmax(0,1fr)] lg:items-start">
        {/* Sidebar: everything driven by the selected date */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            datesWithData={datesWithData}
          />
          <DailySnapshot
            key={selectedKey} // remounts on date change, which resets the open panel and draft state
            selectedDate={selectedDate}
            sleepHours={selectedSleep?.hours_slept}
            todayEntry={selectedEntry}
            onSaveField={handleSaveField}
          />
        </aside>

        <main className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <TopRow entryData={entryData} />
            <ChartSection
              sleepSessions={sleepData ?? []}
              // isLoading={isSleepLoading}
            />
            <RecentEntries userId={userData.data?._id} entryData={entryData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
