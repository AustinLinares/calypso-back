import { isBefore, parse } from 'date-fns';

export interface TimeRange {
  start_time: Date;
  end_time: Date;
}

export function newTime(time: string) {
  return parse(time, 'HH:mm', new Date());
}

export function areTimeRangesValid(range1: TimeRange, range2: TimeRange) {
  const case1 = isBefore(range1.end_time, range2.start_time);

  const case2 = isBefore(range2.end_time, range1.start_time);

  const case3 = range1.end_time.getTime() === range2.start_time.getTime();

  const case4 = range2.end_time.getTime() === range1.start_time.getTime();

  return case1 || case2 || case3 || case4;
}
