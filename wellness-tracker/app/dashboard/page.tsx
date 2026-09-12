"use client";
import * as React from "react";
import TopRow from "../components/dashboard/TopRow";
import ChartSection from "../components/dashboard/ChartSection";
import RecentEntries from "../components/dashboard/RecentEntries";
import { verifyUser } from "../api-helpers/user-api";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line
interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["verifyUser"],
    queryFn: verifyUser,
  });

  if (isLoading) return <div>loading...</div>;
  if (error || !data) return <div>Not authenticated</div>;

  const { tracker, entry, ...userData } = data.data;

  console.log(userData && tracker);

  return (
    <div className="bg-[#111318]  p-4 rounded-lg">
      <h2>Dashboard</h2>
      {userData && tracker ? (
        <div className="flex flex-col ">
          <TopRow trackerData={tracker} />
          <ChartSection trackerData={tracker} />
          <RecentEntries userData={userData} entryData={entry} />
        </div>
      ) : (
        <div> loading... </div>
      )}
    </div>
  );
};

export default Dashboard;
