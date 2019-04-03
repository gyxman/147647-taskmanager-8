import Component from './component.js';

class Filter extends Component {
  constructor(data) {
    super();

    this._name = data;
    this._isChecked = false;
    this._isDisabled = false;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    this._isChecked = !this._isChecked;

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
    <div>
      <input type="radio" class="filter__input visually-hidden" name="filter"
        id="filter__${this._name.toLowerCase()}"
        ${this._isChecked && `checked`}
        ${this._isDisabled && `disabled`}
      >
      <label
        for="filter__${this._name.toLowerCase()}"
        class="filter__label">${this._name.toUpperCase()}
          <span
            class="filter__${this._name.toLowerCase()}-count">
          </span>
      </label>
    </div>`.trim();
  }

  createListeners() {
    this._element.querySelector(`.filter__input`)
      .addEventListener(`change`, this._onFilterClick);
  }

  removeListeners() {
    this._element.querySelector(`.filter__input`)
      .removeEventListener(`change`, this._onFilterClick);
  }
}

export default Filter;
