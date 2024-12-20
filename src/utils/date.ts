import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export function formatDate(dateString: string): string {
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
}
export function formatToTime(
  date: moment.MomentInput = undefined,
  hasSeconds = false
): string {
  if (hasSeconds) {
    return moment(date).format('HH:mm:ss');
  }
  return moment(date).format('HH:mm');
}
