import ListView from '../view/listView';
import {render} from '../render';
import ItemListView from '../view/itemListView';
import FormEditingView from '../view/formEditingView';
import FiltersView from '../view/filtersView';
import SortingView from '../view/sortingView';
import FormCreationView from '../view/formCreationView';
import EventView from '../view/eventView';

export default class Presenter {
  eventList = new ListView();

  constructor({tripEvents, filters}) {
    this.tripEvents = tripEvents;
    this.filters = filters;
  }

  init() {
    const editItemList = new ItemListView();
    const addItemList = new ItemListView();
    editItemList.getElement().appendChild(new FormEditingView().getElement());
    addItemList.getElement().appendChild(new FormCreationView().getElement());

    render(new FiltersView(), this.filters);
    render(new SortingView(), this.tripEvents);
    render(this.eventList, this.tripEvents);
    render(editItemList, this.eventList.getElement());

    for (let i = 0; i < 3; i++) {
      const itemList = new ItemListView();
      itemList.getElement().appendChild(new EventView().getElement());
      render(itemList, this.eventList.getElement());
    }

    render(addItemList, this.eventList.getElement());
  }
}
