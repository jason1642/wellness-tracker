"use client";
import * as React from "react";
import TopRow from "../components/dashboard/TopRow";
import ChartSection from "../components/dashboard/ChartSection";
import RecentEntries from "../components/dashboard/RecentEntries";
import { verifyUser } from "../api-helpers/user-api";
import { useQuery } from "@tanstack/react-query";
import { getSleepDataByUserId } from "../api-helpers/tracker-api";
// eslint-disable-next-line
interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const [sleepData, setSleepData] = React.useState();
  const { data, isLoading, error } = useQuery({
    queryKey: ["verifyUser"],
    queryFn: verifyUser,
  });
  React.useEffect(() => {
    // console.log(data);
    if (data) {
      getSleepDataByUserId(data.data._id).then((res) => {
        console.log(res);
        setSleepData(res.data);
      });
    }
    // console.log("running use effect");
  }, [data]);

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
          {/* create skeleton or conditional render based on sleepdata response */}
          <ChartSection sleepSessions={sleepData} />

          <RecentEntries userData={userData} entryData={entry} />
        </div>
      ) : (
        <div> loading... </div>
      )}
    </div>
  );
};

export default Dashboard;
