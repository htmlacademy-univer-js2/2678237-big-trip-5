export default class DestinationsModel {
  constructor(service) {
    this.destinations = service.getDestinations();
  }

  get() {
    return this.destinations;
  }

  findDestination(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
