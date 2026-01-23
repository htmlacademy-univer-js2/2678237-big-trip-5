import {createElement} from '../render';

function createItemListTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class ItemListView {
  getTemplate() {
    return createItemListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
