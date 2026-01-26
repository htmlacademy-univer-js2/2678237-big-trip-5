import {getRandom, getRandomItemArray} from '../utils/utils';
import {CITIES, COUNT_OFFERS, COUNT_POINTS, OFFERS_TITLE, TYPES} from '../mock/consts';
import {generateDestination} from '../mock/destination';
import {generateOffer} from '../mock/offer';
import {generatePoint} from '../mock/point';

export default class MockService {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    this.#destinations = this.#generateDestinations();
    this.#offers = this.#generateOffers();
    this.#points = this.#generatePoints();
  }

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  #generateDestinations() {
    return Array.from({length: getRandom(1, CITIES.length)}, generateDestination);
  }

  #generateOffers() {
    return Array.from({length: getRandom(1, OFFERS_TITLE.length)}, generateOffer);
  }

  #generatePoints() {
    return Array.from({length: COUNT_POINTS}, () => {
      const type = getRandomItemArray(TYPES);
      const destination = getRandomItemArray(this.#destinations);
      const offersByType = this.#offers.find((o) => o.type === type);

      let offerIds = [];
      if (offersByType?.offers?.length > 0) {
        const available = offersByType.offers;
        const howMany = getRandom(1, COUNT_OFFERS);

        offerIds = Array.from({ length: Math.min(howMany, available.length) }, () =>
          getRandomItemArray(available).id
        );
      }

      return generatePoint(destination.id, offerIds, type);
    });
  }
}
