import dayjs from 'dayjs';

const FORM_INPUT_FULL = 'DD/MM/YY HH:mm';
const VISIBLE_TIME = 'HH:mm';
const VISIBLE_SHORT_DATE = 'MMM D';
const MACHINE_DATE = 'YYYY-MM-DD';
const MACHINE_DATETIME = 'YYYY-MM-DDTHH:mm';

function formatForInput(date) {
  return dayjs(date).format(FORM_INPUT_FULL);
}

function formatVisibleTime(date) {
  return dayjs(date).format(VISIBLE_TIME);
}

function formatVisibleShortDate(date) {
  return dayjs(date).format(VISIBLE_SHORT_DATE);
}

function formatMachineDate(date) {
  return dayjs(date).format(MACHINE_DATE);
}

function formatMachineDateTime(date) {
  return dayjs(date).format(MACHINE_DATETIME);
}

function formatDuration(start, end) {
  const countSymbol = 2;
  const symbol = '0';
  const diff = Math.abs(dayjs(end).diff(dayjs(start), 'minute'));

  if (diff < 60) {
    return `${String(diff).padStart(countSymbol, symbol)}M`;
  }

  const days = Math.floor(diff / (24 * 60));
  const hours = Math.floor((diff % (24 * 60)) / 60);
  const minutes = diff % 60;

  const hStr = String(hours).padStart(countSymbol, symbol);
  const mStr = String(minutes).padStart(countSymbol, symbol);

  if (days === 0) {
    return `${hStr}H ${mStr}M`;
  }

  const dStr = String(days).padStart(countSymbol, symbol);

  return `${dStr}D ${hStr}H ${mStr}M`;
}

export {
  formatForInput,
  formatVisibleTime,
  formatVisibleShortDate,
  formatMachineDate,
  formatMachineDateTime,
  formatDuration
};
