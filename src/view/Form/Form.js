import {createFormTemplate} from './templates';
import AbstractStatefulView from '@framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {FLATPICKR_DATE_FORMAT} from '@utils/dateUtils';

export default class Form extends AbstractStatefulView {
  #destinations = null;
  #offers = null;

  #handleSubmitForm = null;
  #handleDeleteEdit = null;
  #handleCloseForm = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, destinations, offers, onSubmitForm, onDelete, onCloseForm}) {
    super();
    this._setState({...point, currentOffers: point.offers, currentType: point.type});
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleSubmitForm = onSubmitForm;
    this.#handleDeleteEdit = onDelete;
    this.#handleCloseForm = onCloseForm;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    const eventRollupBtn = this.element.querySelector('.event__rollup-btn');
    if (eventRollupBtn) {
      eventRollupBtn.addEventListener('click', this.#closeHandleClick);
    }

    const eventAvailableOffers = this.element.querySelector('.event__available-offers');
    if (eventAvailableOffers) {
      eventAvailableOffers.addEventListener('change', this.#handleOfferChange);
    }

    this.element.addEventListener('submit', this.#submitHandleClick);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetHandleClick);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#handleTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#handleCostChange);

    this.#setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  get template() {
    return createFormTemplate({
      point: this._state,
      destinations: this.#destinations,
      offers: this.#offers
    });
  }

  reset(point) {
    this.updateElement(point);
  }

  #setDatepicker() {
    const [dateFromInput, dateToInput] = this.element.querySelectorAll('.event__input--time');

    this.#datepickerFrom = flatpickr(
      dateFromInput,
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        allowInput: true,
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#handleDateFromChange
      }
    );

    this.#datepickerTo = flatpickr(
      dateToInput,
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        allowInput: true,
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#handleDateToChange
      }
    );
  }

  #resetHandleClick = (evt) => {
    evt.preventDefault();
    if (this._state.id) {
      this.#handleDeleteEdit(this._state.id);
    }else {
      this.#handleCloseForm();
    }
  };

  #closeHandleClick = (evt) => {
    evt.preventDefault();
    this.#handleCloseForm();
  };

  #submitHandleClick = (evt) => {
    evt.preventDefault();

    delete this._state.currentType;
    delete this._state.currentOffers;

    this.#handleSubmitForm(this._state);
  };

  #setErrorState(input) {
    input.classList.add('event__input--error');
    this.element.querySelector('.event__save-btn').disabled = true;
  }

  #clearErrorState(input) {
    input.classList.remove('event__input--error');
    this.element.querySelector('.event__save-btn').disabled = false;
  }

  #handleTypeChange = (evt) => {
    if (evt.target.name === 'event-type') {
      const newType = evt.target.value;
      let isSourceType = false;

      if (newType === this._state.currentType) {
        isSourceType = true;
      }

      this.updateElement({
        offers: isSourceType ? this._state.currentOffers : [],
        type: newType
      });
    }
  };

  #handleDestinationChange = (evt) => {
    const selectedDestinationName = evt.target.value;
    const selectedDestination = this.#destinations.find((destination) => destination.name === selectedDestinationName);

    if (!selectedDestination) {
      this.#setErrorState(evt.target);
      return;
    }

    this.updateElement({destination: selectedDestination.id});
  };

  #handleDateFromChange = ([selectedDate]) => {
    this._setState({ dateFrom: selectedDate.toISOString() });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', selectedDate);
    }
  };

  #handleDateToChange = ([selectedDate]) => {
    this._setState({ dateTo: selectedDate.toISOString() });
  };

  #handleCostChange = (evt) => {
    const inputCost = evt.target;
    const currentCost = Number(inputCost.value);

    if (currentCost < inputCost.min) {
      this.#setErrorState(inputCost);
      return;
    } else {
      this.#clearErrorState(inputCost);
    }

    this._setState({ basePrice: currentCost });
  };

  #handleOfferChange = (evt) => {
    const input = evt.target;

    if (input.tagName !== 'INPUT') {
      return;
    }

    const selectedOffers = new Set(this._state.offers || []);

    if (input.checked) {
      selectedOffers.add(input.dataset.id);
    } else {
      selectedOffers.delete(input.dataset.id);
    }

    this._setState({ offers: Array.from(selectedOffers) });
  };
}
