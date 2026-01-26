import { v4 as uuidv4 } from 'uuid';
import {getRandom, getRandomItemArray} from '../utils/utils';
import {OFFERS_TITLE, PRICE, TYPES} from './consts';

export function generateOffer() {
  const generateOffers = () => ({
    id: uuidv4(),
    title: getRandomItemArray(OFFERS_TITLE),
    price: getRandom(PRICE.MIN, PRICE.MAX),
  });

  return {
    type: getRandomItemArray(TYPES),
    offers: Array.from({length: getRandom(0, OFFERS_TITLE.length)}, generateOffers),
  };
}
