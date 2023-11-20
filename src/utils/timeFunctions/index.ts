export interface TimeRange {
  start: Date;
  end: Date;
}

export function dateFromHours(hours: string) {
  const now = new Date();
  const [year, month, date] = [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ];
  const dateString = `${year}-${month}-${date}T${hours}-03:00`;

  return new Date(dateString);
}

export function timeOnDifferentTimeZone(
  date: Date,
  countryCode: string = 'es-CL',
  timeZone: string = 'America/Santiago',
) {
  const localeString = date.toLocaleString(countryCode, { timeZone });

  return localeString.split(' ')[1];
}
