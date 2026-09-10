import * as React from 'react';
// import { TrackerModel } from '../../types'

interface IRecentEntriesProps {
    entryData: any;
}

const RecentEntries: React.FunctionComponent<IRecentEntriesProps> = ({entryData}) => {

      React.useEffect(()=>{
            console.log("Entry section", entryData)
        },[])
  return (
    <div>
        RecentEntries 
    </div>
  );
};

export default RecentEntries;
