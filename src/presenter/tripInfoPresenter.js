import TripInfo from '@view/TripInfo/TripInfo';
import {remove, render, RenderPosition, replace} from '@framework/render';
import {isSortByDay} from '@utils/sortUtils';
import {formatInfoDate, formatRouteString} from '@utils/infoUtils';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({infoContainer, pointsModel, destinationsModel, offersModel}) {
    this.#container = infoContainer;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#destinationsModel.addObserver(this.#handleModeEvent);
    this.#offersModel.addObserver(this.#handleModeEvent);
  }

  get info() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      return {};
    }

    const pointsByDay = points.toSorted(isSortByDay);

    const cost = pointsByDay.reduce((total, point) => {
      const offersCost = this.#offersModel.getByPoint(point).reduce((sum, offer) => sum + offer.price, 0);
      return total + point.basePrice + offersCost;
    }, 0);

    const destinationNames = pointsByDay.map((point) => {
      const dest = this.#destinationsModel.getById(point.destination);
      return dest ? dest.name : '';
    });

    const title = formatRouteString(destinationNames);

    const firstDate = pointsByDay[0].dateFrom;
    const lastDate = pointsByDay[pointsByDay.length - 1].dateTo;
    const dates = formatInfoDate(firstDate, lastDate);

    return {title, dates, cost};
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;
    const {title, dates, cost} = this.info;

    if (!title || !dates || !cost) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    this.#tripInfoComponent = new TripInfo({title, dates, cost});

    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModeEvent = () => {
    this.init();
  };
}
