import EventsListView from '../view/eventsListView';
import {render} from '../render';
import FormEditingView from '../view/formEditingView';
import EventView from '../view/eventView';
import FormCreationView from '../view/formCreationView';
import SortingView from '../view/sortingView';
import FiltersView from '../view/filtersView';

export default class Presenter {
  eventList = new EventsListView();

  constructor({tripEvents, filters}) {
    this.tripEvents = tripEvents;
    this.filters = filters;
  }

  init() {
    render(new FiltersView(), this.filters);
    render(new SortingView(), this.eventList.getElement());
    render(new FormEditingView(), this.eventList.getElement());
    render(this.eventList, this.tripEvents);

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventList.getElement());
    }

    render(new FormCreationView(), this.tripEvents);
  }
}
