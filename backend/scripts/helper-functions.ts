export function toISODate(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00.000Z`);
}

export const sameCalendarDate = (a: Date, b: Date): boolean => {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
};

export const getOneMonthRange = () => {
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setDate(startTime.getDate() - 30);
  //   Important - end time should be a date further in the past than start time
  return { startTime: endTime, endTime: startTime };
};
