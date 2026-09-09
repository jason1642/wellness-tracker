'use client'
import * as React from 'react';
import {getUserInfoById} from '../api-helpers/user-api'

interface IDashboardProps {
}


const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {



    React.useEffect(() => {
      
        console.log('dashboard')
    }, [])



  return (
        <div className="bg-grey border border-white p-4 rounded-lg">

            <h2>Dashboard</h2>
          
        </div>
  );
};

export default Dashboard;
