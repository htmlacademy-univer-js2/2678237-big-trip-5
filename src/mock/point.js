import { v4 as uuidv4 } from 'uuid';
import {getRandom} from '../utils/utils';
import {PRICE} from './consts';
import dayjs from 'dayjs';

function generateFlightDates() {
  const startInMinutesMin = 15;
  const startInMinutesMax = 14 * 24 * 60;
  const durationMinutesMin = 30;
  const durationMinutesMax = 40 * 60;

  const departure = dayjs().add(getRandom(startInMinutesMin, startInMinutesMax), 'minute');
  const arrival = departure.add(getRandom(durationMinutesMin, durationMinutesMax), 'minute');

  return {
    departure: departure.toISOString(),
    arrival: arrival.toISOString(),
  };
}

export function generatePoint(destinationId, offerIds, type) {
  const flightDates = generateFlightDates();

  return {
    id: uuidv4(),
    basePrice: getRandom(PRICE.MIN, PRICE.MAX),
    dateFrom: flightDates.departure,
    dateTo: flightDates.arrival,
    destination: destinationId,
    isFavorite: Boolean(getRandom(0, 1)),
    offers: offerIds,
    type: type
  };
}
