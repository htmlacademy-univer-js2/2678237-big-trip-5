import AbstractView from '@framework/view/abstract-view';
import {createTripInfoTemplate} from '@view/TripInfo/templates';

export default class TripInfo extends AbstractView {
  #title = '';
  #dates = '';
  #cost = 0;

  constructor({title, dates, cost}) {
    super();
    this.#title = title;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return createTripInfoTemplate(this.#title, this.#dates, this.#cost);
  }
}
