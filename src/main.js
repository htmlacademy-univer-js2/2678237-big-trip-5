import Presenter from './presenter/presenter';
import MockService from './service/mockService';
import DestinationsModel from './model/destinationsModel';
import OffersModel from './model/offersModel';
import PointsModel from './model/pointsModel';

const service = new MockService();
const destinationsModel = new DestinationsModel(service);
const offersModel = new OffersModel(service);
const pointsModel = new PointsModel(service);

new Presenter({
  destinationsModel,
  offersModel,
  pointsModel
}).init();
