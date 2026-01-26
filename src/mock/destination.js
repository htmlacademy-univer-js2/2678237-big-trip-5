import { v4 as uuidv4 } from 'uuid';
import {getRandom, getRandomItemArray} from '../utils/utils';
import {CITIES, COUNT_PICTURES, DESCRIPTIONS} from './consts';

export function generateDestination() {
  const minCountPicture = 1;
  const maxCountPicture = 20;
  const description = getRandomItemArray(DESCRIPTIONS);
  const city = getRandomItemArray(CITIES);

  const generatePicture = () => ({
    src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandom(minCountPicture, maxCountPicture)}.jpg`,
    description: `${city} ${description}`
  });

  return {
    id: uuidv4(),
    description: getRandomItemArray(DESCRIPTIONS),
    name: city,
    pictures: Array.from({length: getRandom(1, COUNT_PICTURES)}, generatePicture),
  };
}
