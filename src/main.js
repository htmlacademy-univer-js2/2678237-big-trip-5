import Presenter from './presenter/presenter';

const tripEventsElement = document.querySelector('.trip-events');
const controlsFiltersElement = document.querySelector('.trip-controls__filters');

new Presenter({
  tripEvents: tripEventsElement,
  filters: controlsFiltersElement
}).init();
