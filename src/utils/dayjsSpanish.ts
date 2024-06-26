import dayjsSpanish, { ConfigType } from 'dayjs';
import 'dayjs/locale/es';
import utcPlugin from 'dayjs/plugin/utc';

dayjsSpanish.locale('es');
dayjsSpanish.extend(utcPlugin);

const transformValidDate = (date?: ConfigType) => {
  const isValid = dayjsSpanish(date).isValid();
  if (!date || !isValid) return dayjsSpanish();
  return date.toString().includes('GMT') ||
    date.toString().includes('T00:00:00.000Z')
    ? dayjsSpanish.utc(date)
    : dayjsSpanish(date);
};

// Returns time in "7:18 PM" format
export const formatTimeUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('h:mm A');
};

// Returns time with seconds in "7:18:53 PM" format
export const formatTimeSecondsUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('h:mm:ss A');
};

// Returns date in "15/05/2024" format
export const formatDateUtc = (date?: ConfigType, separator: string = '/') => {
  const validDate = transformValidDate(date);
  return validDate.format(`DD${separator}MM${separator}YYYY`);
};

export const formatDateDefault = (date?: ConfigType, format?: string) => {
  const validDate = transformValidDate(date);
  return validDate.format(format);
};

// Returns date in "9/5/2024" format
export const formatDateNoZeroUtc = (
  date?: ConfigType,
  separator: string = '/'
) => {
  const validDate = transformValidDate(date);
  return validDate.format(`D${separator}M${separator}YYYY`);
};

// Returns date in "15/05/2024 7:18 PM" format
export const formatDateTimeUtc = (
  date?: ConfigType,
  separator: string = '/'
) => {
  const validDate = transformValidDate(date);
  return validDate.format(`DD${separator}MM${separator}YYYY h:mm A`);
};

// Returns date in "9/5/2024 7:18 PM" format
export const formatDateNoZeroTimeUtc = (
  date?: ConfigType,
  separator: string = '/'
) => {
  const validDate = transformValidDate(date);
  return validDate.format(`D${separator}M${separator}YYYY h:mm:ss A`);
};

// Returns date in "15 de mayo de 2024" format
export const formatFullDateUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('D [de] MMMM [de] YYYY');
};

// Returns date in "15 de may. de 2024" format
export const formatShortDateUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('D [de] MMM. [de] YYYY');
};

// Returns date and time in "15 de mayo de 2024 7:18 PM" format
export const formatFullDateTimeUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('D [de] MMMM [de] YYYY h:mm A');
};
// Returns date and time in "15 de mayo" format
export const formatDayMonthTimeUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('DD [de] MMMM');
};

// Returns date and time in "15 de may. de 2024 7:18 PM" format
export const formatShortDateTimeUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('D [de] MMM. [de] YYYY h:mm A');
};

// Returns date, weekday, and time in "miércoles, 15 de mayo de 2024" format
export const formatDateWeekdayUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('dddd, D [de] MMMM [de] YYYY');
};

// Returns date, abbreviated weekday, and time in "mié., 15 de may. de 2024" format
export const formatShortDateWeekdayUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('ddd., D [de] MMM. [de] YYYY');
};

// Returns date, weekday, and time in "miércoles, 15 de mayo de 2024 7:18 PM" format
export const formatDateTimeWeekdayUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('dddd, D [de] MMMM [de] YYYY h:mm A');
};
// Returns date, weekday, and time in "mayo" format
export const formatMonth = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('MMMM');
};

// Returns date, abbreviated weekday, and time in "mié., 15 de may. de 2024 16:19" format
export const formatShortDateTimeWeekdayUtc = (date?: ConfigType) => {
  const validDate = transformValidDate(date);
  return validDate.format('ddd., D [de] MMM. [de] YYYY h:mm A');
};

export default dayjsSpanish;
