import Observable from '@framework/observable';
import {UpdateType} from '@/const';

export default class OffersModel extends Observable {
  #service = null;
  #offers = [];

  constructor(service) {
    super();
    this.#service = service;
  }

  async init() {
    try {
      this.#offers = await this.#service.offers;
      this._notify(UpdateType.INIT, {offersLoad: true});
    } catch (err) {
      this.#offers = [];
      this._notify(UpdateType.ERROR);
      throw err;
    }
  }

  get offers() {
    return this.#offers;
  }

  getByPoint(point) {
    const currentTypeOffer = this.#offers.find((offer) => offer.type === point.type);
    if (!currentTypeOffer) {
      return [];
    }
    return currentTypeOffer.offers.filter((offer) => point.offers.includes(offer.id));
  }
}
