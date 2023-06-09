const ZONE_LOCALE = 'es-PE';
const CONFIG_DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {};

const formatDate = (
  date: Date,
  config?: Intl.DateTimeFormatOptions
): string => {
  const formato = new Intl.DateTimeFormat(ZONE_LOCALE, {
    ...config,
    ...CONFIG_DATE_TIME_FORMAT,
  }).format;
  return formato(date);
};

export const parseDate = (value: string, sing: string, replace: string) => {
  const toArray = value.split(sing);
  const reverseValue = toArray.reverse().join();
  const parseValue = reverseValue.replace(/,/g, replace);
  return parseValue; //retorna: yyyy/mm/dd
};

export const _date = (date: Date) => {
  const _date = formatDate(new Date(date), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parse = parseDate(_date, '/', '-');
  return parse;
};

export const parseUTC = (date: string) => {
  const getDate = new Date(date).getTime();
  const UTCHours = new Date().getUTCHours();
  const hours = new Date().getHours();
  const parseUTC = UTCHours - hours;
  const _utc = parseUTC * 60 * 60 * 1000;
  return new Date(getDate + _utc);
};

export const getValueByType = (value: string, type: string) => {
  if (type === 'select-one') return parseInt(value);
  if (type === 'date') return parseUTC(value);
  if (type === 'number') return parseFloat(value);
  return value;
};

export default formatDate;
