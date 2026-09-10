'use client'
import * as React from 'react';
import {getUserInfoById} from '../api-helpers/user-api'
import TopRow from '../components/dashboard/TopRow';
import ChartSection from '../components/dashboard/ChartSection';
import RecentEntries from '../components/dashboard/RecentEntries';
import { verifyUser } from '../api-helpers/user-api';
interface IDashboardProps {
}


const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {

    const [userData, setUserData ] = React.useState()



    React.useEffect(() => {
        verifyUser().then(res => {
            console.log('dashboardVerifyUser', res.data)
            setUserData(res)
        }).catch(err=>{console.log(err)})
        console.log('dashboard')
    }, [])

//  console.log(userData.data)

  return (
        <div className="bg-grey border border-white p-4 rounded-lg">

            <h2>Dashboard</h2>
            {
                userData ? 
                 <div>
                <TopRow />
                <ChartSection />
                <RecentEntries />
            </div> 
            : 
            <div> loading</div>
            }
           
          
        </div>
  );
};

export default Dashboard;
