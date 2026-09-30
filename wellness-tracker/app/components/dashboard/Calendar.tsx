import * as React from "react";
import Card from "./CardContainer";
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ICalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  // Dates (as "YYYY-MM-DD" strings) that have logged data — shown with a
  // small dot under the day number, so it's clear at a glance which days
  // have something to look at before clicking in.
  datesWithData?: Set<string>;
  // Disallow picking days after this date (defaults to today — you can't
  // view a wellness snapshot for a day that hasn't happened yet).
  maxDate?: Date;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const Calendar: React.FunctionComponent<ICalendarProps> = ({
  selectedDate,
  onSelectDate,
  datesWithData,
  maxDate = new Date(),
}) => {
  // The month currently being viewed — independent from `selectedDate` so
  // navigating months doesn't change the selection until a day is clicked.
  const [viewMonth, setViewMonth] = React.useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const goToPrevMonth = () => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const today = new Date();

  const { year, month, firstWeekday, daysInMonth } = React.useMemo(() => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    return {
      year: y,
      month: m,
      firstWeekday: new Date(y, m, 1).getDay(),
      daysInMonth: new Date(y, m + 1, 0).getDate(),
    };
  }, [viewMonth]);

  const cells: (Date | null)[] = React.useMemo(() => {
    const leadingBlanks = Array(firstWeekday).fill(null);
    const days = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    );
    return [...leadingBlanks, ...days];
  }, [year, month, firstWeekday, daysInMonth]);

  return (
    // <Card>
    <div className="w-full max-w-100 rounded-xl border border-[#262A33] bg-[#181B22] px-3 py-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="rounded-md p-1.5 text-[#8B92A1] transition-colors hover:bg-[#1D212B] hover:text-[#F2F3F5]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M12.5 5l-5 5 5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="text-sm font-medium text-[#F2F3F5]">
          {MONTH_NAMES[month]} {year}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="rounded-md p-1.5 text-[#8B92A1] transition-colors hover:bg-[#1D212B] hover:text-[#F2F3F5]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M7.5 5l5 5-5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[11px] text-[#5F6570]">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;

          const key = toDateKey(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isFuture = date.getTime() > maxDate.getTime();
          const hasData = datesWithData?.has(key);

          return (
            <button
              key={key}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDate(date)}
              className={`relative aspect-square rounded-md text-sm transition-colors ${
                isFuture
                  ? "cursor-not-allowed text-[#3A3E47]"
                  : isSelected
                    ? "bg-[#7FB8A0] font-medium text-[#0F1116]"
                    : isToday
                      ? "border border-[#5F6570] text-[#F2F3F5] hover:bg-[#1D212B]"
                      : "text-[#C7CBD3] hover:bg-[#1D212B]"
              }`}
            >
              {date.getDate()}
              {hasData && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#7FB8A0]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
    // </Card>
  );
};

export default Calendar;
