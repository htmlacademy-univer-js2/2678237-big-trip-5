import ListView from '../view/listView';
import {render} from '../render';
import ItemListView from '../view/itemListView';
import FormEditingView from '../view/formEditingView';
import FiltersView from '../view/filtersView';
import SortingView from '../view/sortingView';
import FormCreationView from '../view/formCreationView';
import PointView from '../view/pointView';
import {appendElement} from '../utils/utils';

export default class Presenter {
  eventList = new ListView();
  tripEvents = document.querySelector('.trip-events');
  filters = document.querySelector('.trip-controls__filters');

  constructor({pointsModel, destinationsModel, offersModel}) {
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.points = [...this.pointsModel.get()];
    this.destinations = [...this.destinationsModel.get()];
    this.offers = [...this.offersModel.get()];

    render(new FiltersView(), this.filters);
    render(new SortingView(), this.tripEvents);
    render(this.eventList, this.tripEvents);

    const firstPoint = this.points[0];
    const editItemList = new ItemListView();

    appendElement(editItemList, new FormEditingView({
      point: firstPoint,
      destinations: this.destinations,
      offers: this.offers,
    }));

    render(editItemList, this.eventList.getElement());

    for (let i = 1; i < this.points.length - 1; i++) {
      const itemList = new ItemListView();
      const currentPoint = this.points[i];
      appendElement(itemList, new PointView({
        point: currentPoint,
        destination: this.destinationsModel.findDestination(currentPoint.destination),
        offers: this.offers,
      }));
      render(itemList, this.eventList.getElement());
    }

    const lastPoint = this.points[this.points.length - 1];
    const addItemList = new ItemListView();

    appendElement(addItemList, new FormCreationView({
      point: lastPoint,
      destinations: this.destinations,
      offers: this.offers,
    }));

    render(addItemList, this.eventList.getElement());
  }
}
