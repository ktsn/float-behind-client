import moment from 'moment';

export default function format(value, formatStr) {
  return moment(value).format(formatStr);
}
