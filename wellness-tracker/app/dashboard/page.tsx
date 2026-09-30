"use client";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEntriesByUserId } from "../api-helpers/entry-api";
import TopRow from "../components/dashboard/TopRow";
import ChartSection from "../components/dashboard/ChartSection";
import RecentEntries from "../components/dashboard/RecentEntries";
import Calendar from "../components/dashboard/Calendar";
import { verifyUser } from "../api-helpers/user-api";
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
    queryFn: () =>
      verifyUser()
        .then((res) => res.data)
        .catch(() => null),
  });

  // 2. Tracker + entry data in a single request, instead of two separate queries.
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboard", userData?._id],
    queryFn: () => getEntriesByUserId(userData._id).then((res) => res),
    enabled: !!userData?._id, // don't fire until userData._id exists
  });

  console.log(dashboardData);
  // const trackerData = dashboardData?.tracker;
  const entryData = dashboardData?.entry;
  console.log("entry data", entryData);
  // Union of every date that has either a logged entry or a sleep session —
  // drives the small dots under days in the calendar.
  const datesWithData = useMemo(() => {
    const set = new Set<string>();
    entryData?.entries?.forEach((e: any) =>
      set.add(toDateKey(new Date(e.date))),
    );
    dashboardData?.sleep?.sleepSessions?.forEach((s: any) =>
      set.add(toDateKey(new Date(s.date))),
    );
    return set;
  }, [entryData, dashboardData]);

  const isLoading = isUserLoading || isDashboardLoading;

  return (
    <div className="bg-[#111318] p-4 rounded-lg">
      <h2>Dashboard</h2>
      {isUserError || (!isUserLoading && !userData) ? (
        <div>You need to be logged in to view this page.</div>
      ) : isLoading && entryData ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            datesWithData={datesWithData}
          />

          <div className="flex flex-1 flex-col gap-4">
            <TopRow entryData={entryData} />
            <ChartSection sleepSessions={dashboardData} />
            <RecentEntries userData={userData} entryData={entryData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
