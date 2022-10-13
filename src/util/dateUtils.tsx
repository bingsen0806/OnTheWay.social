import moment from 'moment';

/**
 * Assuming dates are the same day, return the range in terms of hh:mm am/pm.
 */
export function convertDateRangeToTimeRangeStr(date1: string, date2: string) {
  return (
    moment(date1).format('hh:mm A') + ' - ' + moment(date2).format('hh:mm A')
  );
}

export function convertDateToDateStr(date: string) {
  // console.log(date);
  const momentDate = moment(date);
  // console.log(momentDate);
  if (momentDate.isSame(moment(), 'day')) {
    return 'Today';
  }
  return momentDate.format('DD MMM');
}
