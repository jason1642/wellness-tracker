import * as React from 'react';
import { TrackerModel } from '../../types'

interface IRecentEntriesProps {
    trackerData: TrackerModel;
}

const RecentEntries: React.FunctionComponent<IRecentEntriesProps> = (trackerData) => {

      React.useEffect(()=>{
            console.log("top row", trackerData)
        },[])
  return (
    <div>
        RecentEntries
    </div>
  );
};

export default RecentEntries;
