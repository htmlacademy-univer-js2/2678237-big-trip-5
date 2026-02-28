import {generateSorts} from '@utils/sortUtils';
import {remove, render, RenderPosition} from '@framework/render';
import {
  filterByType,
  FilterType,
  MessagesBoard,
  sortByType,
  SortType,
  TIME_LIMIT,
  UpdateType,
  UserAction
} from '@/const';

import List from '@view/List/List';
import Sort from '@view/Sort/Sort';
import Message from '@view/Message/Message';

import PointPresenter from '@presenter/pointPresenter';
import PresenterState from '@/state/presenterState';
import NewPointPresenter from '@presenter/newPointPresenter';
import UiBlocker from '@framework/ui-blocker/ui-blocker';

export default class BoardPresenter {
  #boardContainer = null;
  #pointListComponent = new List();
  #messageComponent = null;
  #sortComponent = null;

  #newAddPointPresenter = null;
  #destroyNewPoint = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT,
  });

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #pointManagerState = new PresenterState();

  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;

  #isLoading = true;
  #isDestinationsLoaded = false;
  #isOffersLoaded = false;
  #isPointsLoaded = false;

  constructor({boardContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#destroyNewPoint = onNewPointDestroy;

    this.#newAddPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      stateManager: this.#pointManagerState,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#cancelNewPoint
    });

    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#destinationsModel.addObserver(this.#handleModeEvent);
    this.#offersModel.addObserver(this.#handleModeEvent);
    this.#filterModel.addObserver(this.#handleModeEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filterByType[this.#filterType](points);

    return sortByType[this.#currentSortType](filteredPoints);
  }

  createNewPoint() {
    this.#newAddPointPresenter.init();
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }
  }

  #cancelNewPoint = () => {
    this.#destroyNewPoint();
    if (this.points.length === 0) {
      this.#renderBoard();
    }
  };

  #handleViewAction = async (actionType, updateType, data) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newAddPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, data);
          this.#newAddPointPresenter.destroy();
        } catch (err) {
          this.#newAddPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(data.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, data);
          this.#pointPresenters.get(data.id).resetToView();
        } catch (err) {
          this.#pointPresenters.get(data.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(data).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, data);
        } catch (err) {
          this.#pointPresenters.get(data).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModeEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if (data?.destinationsLoad) {
          this.#isDestinationsLoaded = true;
        }
        if (data?.offersLoad) {
          this.#isOffersLoaded = true;
        }
        if (data?.pointsLoad) {
          this.#isPointsLoaded = true;
        }

        if (!this.#isDestinationsLoaded || !this.#isOffersLoaded || !this.#isPointsLoaded) {
          return;
        }

        this.#isLoading = false;
        remove(this.#messageComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#renderMessage(MessagesBoard.FAILED);
        break;
    }
  };

  #renderMessage = (message) => {
    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }

    this.#messageComponent = new Message({message});
    render(this.#messageComponent, this.#boardContainer);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      stateManager: this.#pointManagerState,
      onDataChange: this.#handleViewAction,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPointList(points) {
    render(this.#pointListComponent, this.#boardContainer);
    this.#renderPoints(points);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort() {
    const sorts = generateSorts();
    this.#sortComponent = new Sort({
      sorts,
      currentSortType: this.#currentSortType,
      onChangeSortType: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (typeSort) => {
    if (this.#currentSortType === typeSort) {
      return;
    }

    this.#currentSortType = typeSort;

    this.#clearBoard();
    this.#renderBoard();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#clearPointList();

    remove(this.#sortComponent);

    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    const points = this.points;

    if (this.#isLoading) {
      this.#renderMessage(MessagesBoard.LOADING);
      return;
    }

    this.#renderPointList(points);

    if (points.length === 0) {
      const currentFilterKey = this.#filterType.toUpperCase();
      this.#renderMessage(MessagesBoard[currentFilterKey]);
      return;
    }

    this.#renderSort();
  }
}
