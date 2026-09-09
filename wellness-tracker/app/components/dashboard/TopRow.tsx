import * as React from 'react';

interface ITopRowProps {
}

const TopRow: React.FunctionComponent<ITopRowProps> = (props) => {
  return (
    <div className="flex flex-row justify-between">

        <div className='flex flex-col'>
            <p>Sleep</p>
            <p>7.2h</p>
            </div>

           <div className='flex flex-col'>
            <p>Steps</p>
            <p>5,214</p>
            </div>

               <div className='flex flex-col'>
            <p>Water</p>
            <p>6 Cups</p>
            </div>

               <div className='flex flex-col'>
            <p>Calories</p>
            <p>1,524</p>
            </div>
    </div>
  );
};

export default TopRow;
