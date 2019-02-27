import {getRandomNumber} from './modules/util.js';
import getFilterElement from './modules/make-filter.js';
import getCardElement from './modules/make-task.js';

const filtersName = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `tags`,
  `archive`
];

const getFilterTemplate = ()=> {
  const filtersContainer = document.querySelector(`.main__filter`);
  let fragment = ``;

  filtersName.forEach((item, index) => {
    fragment += getFilterElement(item, getRandomNumber(), index === 0 ? true : ``);
  });

  filtersContainer.innerHTML = fragment;
};

getFilterTemplate();

const getCardsTemplate = (count)=> {
  const cardsContainer = document.querySelector(`.board__tasks`);
  let fragment = ``;

  for (let i = 0; i < count; i++) {
    fragment += getCardElement();
  }

  cardsContainer.innerHTML = fragment;
};

getCardsTemplate(7);

const filtersWrapper = document.querySelector(`.main__filter`);

const handleFilterClick = (event) => {
  if (event.target.tagName === `INPUT`) {
    getCardsTemplate(getRandomNumber());
  }
};

filtersWrapper.addEventListener(`click`, handleFilterClick);
