import Form from '@view/Form/Form';
import ItemList from '@view/itemList/ItemList';
import {appendElement} from '@utils/common';
import {remove, render, RenderPosition} from '@framework/render';
import {BLANK_POINT, UpdateType, UserAction} from '@/const';

export default class NewPointPresenter {
  #pointListContainer = null;
  #stateManager = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointEditComponent = null;
  #itemListComponent = new ItemList();

  constructor({pointListContainer, destinationsModel, offersModel, stateManager, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#stateManager = stateManager;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new Form({
      point: {...BLANK_POINT, type: 'flight'},
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onSubmitForm: this.#handleSubmitForm,
      onCloseForm: this.#handleCloseClick
    });

    appendElement(this.#itemListComponent, this.#pointEditComponent);
    render(this.#itemListComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    this.#stateManager.openPresenter(this);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving() {
    this.#pointEditComponent.updateElement({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborting() {
    const resetForm = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    this.#pointEditComponent.shake(resetForm);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    remove(this.#itemListComponent);
    this.#pointEditComponent = null;

    this.#stateManager.closePresenter();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetToView() {
    this.destroy();
  }

  #handleSubmitForm = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleCloseClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
