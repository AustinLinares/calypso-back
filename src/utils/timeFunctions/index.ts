export interface TimeRange {
  start: Date;
  end: Date;
}

export function getDayMonthYearFromDate(date: Date) {
  return [date.getDate(), date.getMonth(), date.getFullYear()];
}

export function getEarliestTime(timeList: string[]): string | null {
  if (timeList.length === 0) {
    return null;
  }

  timeList.sort();

  return timeList[0];
}

export function getLatestTime(timeList: string[]): string | null {
  if (timeList.length === 0) {
    return null;
  }

  timeList.sort();

  return timeList.at(-1);
}

export function dateFromHours(hours: string) {
  const now = new Date();
  const [year, month, day] = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ];
  const dateString = `${year}-${month}-${day}T${hours}-03:00`;

  return new Date(dateString);
}

export function parseDateStringToDate(dateString: string) {
  const [day, month, year] = dateString.split('-');
  const dateObject = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return dateObject;
}

export function timeOnDifferentTimeZone(
  date: Date,
  countryCode: string = 'es-CL',
  timeZone: string = 'America/Santiago',
) {
  const localeString = date.toLocaleString(countryCode, { timeZone });

  return localeString.split(' ')[1];
}

export function dateFromHoursAndData(
  hours: string,
  day: number,
  month: number,
  year: number,
) {
  return new Date(`${year}-${month}-${day}T${hours}-03:00`);
}

// export function dateFromHours(hours: string) {
//   const now = new Date();
//   const dateString = `${now.getFullYear()}-${
//     now.getMonth() + 1
//   }-${now.getDate()}T${hours}`;

//   return utcToZonedTime(new Date(dateString), 'America/Santiago');
// }

// export function parseDateStringToDate(dateString: string) {
//   const [day, month, year] = dateString.split('-');
//   const dateObject = new Date(`${year}-${month}-${day}T00:00:00`);

//   // Convierte la fecha y hora a la zona horaria de Santiago
//   return utcToZonedTime(dateObject, 'America/Santiago');
// }

// export function timeOnDifferentTimeZone(
//   date: Date,
//   timeZone: string = 'America/Santiago',
// ) {
//   const localeString = format(date, 'HH:mm:ss', {
//     timeZone,
//   });
//   return localeString;
// }

// export function dateFromHoursAndData(
//   hours: string,
//   day: number,
//   month: number,
//   year: number,
// ) {
//   const dateString = `${year}-${month}-${day}T${hours}`;

//   // Convierte la fecha y hora a la zona horaria de Santiago
//   return utcToZonedTime(new Date(dateString), 'America/Santiago');
// }
