import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

import * as React from 'react'
import { TrackerModel } from '../../types'


const  aggregateByDay = async (rawData) => {
  const totals = {};
 
  rawData.forEach(({ timestamp, sleepMinutes }) => {
    const date = new Date(timestamp);
    // Group by calendar date (YYYY-MM-DD)
    const dayKey = date.toISOString().slice(0, 10);
    totals[dayKey] = (totals[dayKey] || 0) + sleepMinutes;
  });
 
  return Object.entries(totals)
    .map(([day, minutes]) => ({
      day,
      hours: Math.round((minutes / 60) * 10) / 10,
    }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-7); // last 7 days
}

// const getIntroOfPage = (label: string | number | undefined) => {
//   if (label === 'Page A') {
//     return "Page A is about men's clothing";
//   }
//   if (label === 'Page B') {
//     return "Page B is about women's dress";
//   }
//   if (label === 'Page C') {
//     return "Page C is about women's bag";
//   }
//   if (label === 'Page D') {
//     return 'Page D is about household goods';
//   }
//   if (label === 'Page E') {
//     return 'Page E is about food';
//   }
//   if (label === 'Page F') {
//     return 'Page F is about baby food';
//   }
//   return '';
// };

// const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
//   const firstPayload = payload?.[0];
//   const isVisible = active && firstPayload != null;
//   return (
//     <div
//       className="custom-tooltip"
//       style={{
//         // ...theme?.typography,
//         // ...theme?.tooltip?.contentStyle,
//         visibility: isVisible ? 'visible' : 'hidden',
//       }}
//     >
//       {isVisible && (
//         <>
//           <p className="label">{`${label} : ${firstPayload.value}`}</p>
//           <p className="intro">{getIntroOfPage(label)}</p>
//           <p className="desc">Anything you want can be displayed here.</p>
//         </>
//       )}
//     </div>
//   );
// };

const ChartSection = ({
  isAnimationActive,
//   defaultIndex,
  trackerData
}: {
  isAnimationActive?: boolean;
//   defaultIndex?: TooltipIndex;
  trackerData: TrackerModel
}) => {
    const [sleepData, setSleepData ] = React.useState<Array<any>>()
//     const chartData = React.useMemo(() => aggregateByDay(trackerData.sleep_data), [trackerData.sleep_data]);
//   const lastIndex = chartData.length - 1;
    React.useEffect(()=>{
            console.log("Recent entries", trackerData)
            aggregateByDay(trackerData.sleep_data).then(res=>{
                setSleepData(res)
                console.log("this is the aggregate sleep data", res)
            }).catch(err=> {
                console.log("sleep data error")
            })
            // console.log("memo chart data", chartData)
        },[])
  return (
    <>{
         sleepData ? 
         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-5">
      <p className="text-sm font-medium text-neutral-50 mb-4">
        Sleep trend, last 7 days
      </p>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sleepData} barCategoryGap="20%">
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {sleepData && sleepData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === sleepData.length - 1 ? "#7ba7e8" : "#0f2647"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    : 
    <div>Loading</div>
    }
    </>
    
  );
};

export default ChartSection;