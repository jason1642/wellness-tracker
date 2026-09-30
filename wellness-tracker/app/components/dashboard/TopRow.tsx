import * as React from "react";
import { Moon, Footprints, GlassWater, Flame } from "lucide-react";
import { EntryModel } from "../../types";
import Card from "./CardContainer";

interface ITopRowProps {
  entryData: EntryModel;
}

const TopRow: React.FunctionComponent<ITopRowProps> = ({
  entryData = { steps: 1252, calories: 2050, water: 7 },
}) => {
  const stats = [
    { icon: Moon, label: "Sleep", value: "7.2h" },
    { icon: Footprints, label: "Steps", value: entryData.steps },
    { icon: GlassWater, label: "Water", value: entryData.water },
    { icon: Flame, label: "Calories", value: entryData.calories },
  ];

  React.useEffect(() => {
    // console.log("top row", trackerData);
  }, []);
  return (
    <Card>
      <div className="bg-[#181B22] border border-neutral-800 rounded-2xl px-8 py-6 flex mb-4">
        <div className="flex justify-around gap-y-6 w-full">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-2 w-[20%]">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Icon size={14} strokeWidth={1.75} />
                <span className="text-lg">{label}</span>
              </div>
              <span className="text-4xl font-medium text-neutral-50 tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TopRow;
