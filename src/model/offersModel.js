export default class OffersModel {
  constructor(service) {
    this.offers = service.getOffers();
  }

  get() {
    return this.offers;
  }

  findOffers(type, ids) {
    const offersByType = this.offers.find((offer) => offer.type === type);
    if (!offersByType) {
      return [];
    }
    return offersByType.offers.filter((offer) => ids.includes(offer.id));
  }
}
