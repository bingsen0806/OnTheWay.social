import moment, { Moment } from 'moment';

/**
 * Assuming dates are the same day, return the range in terms of hh:mm am/pm.
 */
export function convertDateRangeToTimeRangeStr(date1: string, date2: string) {
  return (
    moment(date1).format('hh:mm A') + ' - ' + moment(date2).format('hh:mm A')
  );
}

export function convertDateToDateStr(date: string) {
  const momentDate = moment(date);
  if (momentDate.isSame(moment(), 'day')) {
    return 'Today';
  }
  return momentDate.format('DD MMM');
}

export function roundToNext15mins(moment: Moment) {
  let intervals = Math.floor(moment.minutes() / 15);
  if (moment.minutes() % 15 !== 0) intervals++;
  if (intervals === 4) {
    moment.add(1, 'hours');
    intervals = 0;
  }
  moment.minutes(intervals * 15);
  moment.seconds(0);
  return moment;
}
