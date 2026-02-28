import DestinationsModel from '@model/destinationsModel';
import OffersModel from '@model/offersModel';
import PointsModel from '@model/pointsModel';
import BoardPresenter from '@presenter/boardPresenter';
import FilterModel from '@model/filterModel';
import FilterPresenter from '@presenter/filterPresenter';
import TripApiService from '@service/tripApiService';
import TripInfoPresenter from '@presenter/tripInfoPresenter';

const API_SERVICE = 'https://24.objects.htmlacademy.pro/big-trip';
const TOKEN = 'Basic dm0v143op22002d';

const boardContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointAddButton = document.querySelector('.trip-main__event-add-btn');
pointAddButton.disabled = true;

const service = new TripApiService(API_SERVICE, TOKEN);

const destinationsModel = new DestinationsModel(service);
const offersModel = new OffersModel(service);
const pointsModel = new PointsModel(service);
const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter({
  infoContainer,
  pointsModel,
  destinationsModel,
  offersModel
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

const boardPresenter = new BoardPresenter({
  boardContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleCloseNewPoint
});

function handleCreateNewPoint() {
  boardPresenter.createNewPoint();
  pointAddButton.disabled = true;
}

function handleCloseNewPoint() {
  pointAddButton.disabled = false;
}

pointAddButton.addEventListener('click', handleCreateNewPoint);

filterPresenter.init();
boardPresenter.init();

Promise.all([
  destinationsModel.init(),
  offersModel.init(),
  pointsModel.init()
]).then(() => {
  tripInfoPresenter.init();
  pointAddButton.disabled = false;
}).catch(() => {
  pointAddButton.disabled = true;
});
