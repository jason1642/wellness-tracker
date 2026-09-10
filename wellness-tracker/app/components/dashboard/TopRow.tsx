import * as React from 'react';
import { Moon, Footprints, GlassWater, Flame } from "lucide-react";


interface ITopRowProps {
    trackerData: any;
}

const TopRow: React.FunctionComponent<ITopRowProps> = (trackerData) => {
    const stats = [
  { icon: Moon, label: "Sleep", value: "7.2h" },
  { icon: Footprints, label: "Steps", value: "8,412" },
  { icon: GlassWater, label: "Water", value: "6 cups" },
  { icon: Flame, label: "Calories", value: "1,840" },
];

    React.useEffect(()=>{
        console.log("top row", trackerData)
    },[])
  return (
      <div className="bg-neutral-900 px-8 py-6">
      <div className="flex flex-wrap gap-x-14 gap-y-6">

        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Icon size={14} strokeWidth={1.75} />
              <span className="text-sm">{label}</span>
            </div>
            <span className="text-2xl font-medium text-neutral-50 tabular-nums">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRow;
