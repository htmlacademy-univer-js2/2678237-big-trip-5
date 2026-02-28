import Observable from '@framework/observable';
import {UpdateType} from '@/const';

export default class DestinationsModel extends Observable {
  #service = null;
  #destinations = [];

  constructor(service) {
    super();
    this.#service = service;
  }

  async init() {
    try {
      this.#destinations = await this.#service.destinations;
      this._notify(UpdateType.INIT, {destinationsLoad: true});
    } catch (err) {
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
      throw err;
    }
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id) || null;
  }
}
