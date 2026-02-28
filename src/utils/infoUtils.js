import dayjs from 'dayjs';

const INFO_DATE_FORMAT = 'D MMM';
const MAX_SHOW_ROUTE = 3;

export function formatInfoDate(start, end) {
  const dayStart = dayjs(start).format(INFO_DATE_FORMAT);
  const dayEnd = dayjs(end).format(INFO_DATE_FORMAT);

  return `${dayStart} &nbsp;&mdash;&nbsp; ${dayEnd}`;
}

export function formatRouteString(destinationNames) {
  let title;
  if (destinationNames.length > MAX_SHOW_ROUTE) {
    title = `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
  } else {
    title = destinationNames.join(' &mdash; ');
  }
  return title;
}
