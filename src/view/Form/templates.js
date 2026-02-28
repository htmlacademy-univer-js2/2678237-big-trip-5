import {formatForInput} from '@utils/dateUtils';
import {byChecked} from '@utils/common';
import he from 'he';

function createDestinationTemplate(destinations) {
  return destinations
    .map((d) => `<option value="${d.name}" data-id="${d.id}"></option>`)
    .join('');
}

function createOfferTemplate(offers) {
  if (!offers?.length) {
    return '';
  }

  return offers
    .map((offer) => `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${offer.id}"
          type="checkbox"
          name="event-offer-${offer.id}"
          data-id="${offer.id}"
          ${offer.checked ? 'checked' : ''}
        >
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `)
    .join('');
}

function createPictureTemplate(pictures = []) {
  if (!pictures.length) {
    return '';
  }

  return pictures
    .map((pic) => `
      <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Destination photo'}">
    `)
    .join('');
}

function createOffersSection(preparedOffers) {
  if (preparedOffers.length === 0) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOfferTemplate(preparedOffers)}
      </div>
    </section>
  `;
}

function createTypeItemsTemplate(allOffers, type) {
  return allOffers.map(({ type: t }) => {
    const label = t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ');
    return `
        <div class="event__type-item">
          <input
            id="event-type-${t}-1"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${t}"
            ${t === type ? 'checked' : ''}
          >
          <label class="event__type-label event__type-label--${t}" for="event-type-${t}-1">
            ${label}
          </label>
        </div>
      `;
  }).join('');
}

function createButtonsTemplate(id, isDeleting, isDisabled) {
  return id ?
    `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
        ${isDeleting ? 'Deleting...' : 'Delete'}
     </button>
     <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
     </button>`
    :
    '<button class="event__reset-btn" type="reset">Cancel</button>';
}

function createDescriptionTemplate(currentDestination) {
  const description = (currentDestination.description || '').trim();
  const pictures = currentDestination.pictures || [];

  if (!description && pictures.length === 0) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      ${description ? `
        <p class="event__destination-description">
          ${description}
        </p>
      ` : ''}

      ${pictures.length ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictureTemplate(pictures)}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

export function createFormTemplate({
  point = {},
  destinations = [],
  offers: allOffers = [] }
) {
  const {
    id = null,
    basePrice = 0,
    dateFrom = null,
    dateTo = null,
    destination: destId = null,
    offers: selectedOfferIds = [],
    type = 'Flight',
    isSaving,
    isDeleting,
    isDisabled,
  } = point;

  const currentDestination = destinations.find((d) => d.id === destId) || {
    name: '',
    description: '',
    pictures: []
  };

  const offersForType = allOffers.find((o) => o.type === type)?.offers || [];
  const preparedOffers = offersForType.map((offer) => ({
    ...offer,
    checked: selectedOfferIds.includes(offer.id)
  }));

  preparedOffers.sort(byChecked);

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeItemsTemplate(allOffers, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${he.encode(currentDestination.name || '')}"
            list="destination-list-1"
            placeholder="Select destination"
            required
          >
          <datalist id="destination-list-1">
            ${createDestinationTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${dateFrom ? formatForInput(dateFrom) : ''}"
            required
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${dateTo ? formatForInput(dateTo) : ''}"
            required
          >
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${he.encode(String(basePrice))}"
            min="0"
            required
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
        </button>
        ${createButtonsTemplate(id, isDeleting, isDisabled)}
      </header>

      <section class="event__details">
        ${createOffersSection(preparedOffers)}

        ${createDescriptionTemplate(currentDestination)}
      </section>
    </form>
  `;
}
