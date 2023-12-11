import { format, getDate, getMonth, getYear, parse, set } from 'date-fns';

export interface TimeRange {
  start: Date;
  end: Date;
}

export function getDayMonthYearFromDate(date: Date) {
  const day = getDate(date);
  const month = getMonth(date) + 1;
  const year = getYear(date);

  return [day, month, year];
}

export function getEarliestTime(timeList: string[]): string | null {
  if (timeList.length === 0) return null;

  timeList.sort();

  return timeList[0];
}

export function getLatestTime(timeList: string[]): string | null {
  if (timeList.length === 0) return null;

  timeList.sort();

  return timeList.at(-1);
}

export function dateFromHours(hoursString: string) {
  const now = new Date();
  const [hours, minutes, seconds] = hoursString.split(':').map(Number);

  const resultDate = set(now, {
    hours,
    minutes,
    seconds: seconds || 0,
  });

  return resultDate;
}

export function dateFromHoursAndData(
  hoursString: string,
  day: number,
  month: number,
  year: number,
) {
  const [hours, minutes, seconds] = hoursString.split(':').map(Number);

  const resultDate = set(new Date(), {
    year,
    month: month - 1,
    date: day,
    hours,
    minutes,
    seconds: seconds || 0,
    milliseconds: 0,
  });

  return resultDate;
}

export function parseDateStringToDate(dateString: string) {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());

  const chileMidnight = set(parsedDate, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  return chileMidnight;
}

export function timeOnDifferentTimeZone(date: Date) {
  const formattedTime = format(date, 'HH:mm');

  return formattedTime;
}
