"use client";
import * as React from "react";
import {
  getTrackerByUserId,
  getEntriesByUserId,
} from "../api-helpers/tracker-api";
import TopRow from "../components/dashboard/TopRow";
import ChartSection from "../components/dashboard/ChartSection";
import RecentEntries from "../components/dashboard/RecentEntries";
import { verifyUser } from "../api-helpers/user-api";
interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const [userData, setUserData] = React.useState();
  const [trackerData, setTrackerData] = React.useState();
  const [entryData, setEntryData] = React.useState();

  React.useEffect(() => {
    verifyUser()
      .then((res) => {
        console.log("dashboardVerifyUser", res.data);
        setUserData(res);
        getTrackerByUserId(res.data._id)
          .then((res1) => {
            console.log("tracker data: ", res1);
            setTrackerData(res1.data);
          })
          .catch((err) => {
            console.log(err);
          });
        getEntriesByUserId(res.data._id)
          .then((res2) => {
            console.log("entry data", res2.data);
            setEntryData(res2.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("dashboard");
  }, []);

  //  console.log(userData.data)

  return (
    <div className="bg-[#111318]  p-4 rounded-lg">
      <h2>Dashboard</h2>
      {userData && trackerData ? (
        <div className="flex flex-col ">
          <TopRow trackerData={trackerData} />
          <ChartSection trackerData={trackerData} />
          <RecentEntries entryData={entryData} />
        </div>
      ) : (
        <div> loading... </div>
      )}
    </div>
  );
};

export default Dashboard;
