import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

function isFuturePoint(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPresentPoint(point) {
  return dayjs().isSameOrAfter(point.dateFrom) && dayjs().isSameOrBefore(point.dateTo);
}

function isPastPoint(point) {
  return dayjs().isAfter(point.dateTo);
}

export {
  isFuturePoint,
  isPresentPoint,
  isPastPoint
};
