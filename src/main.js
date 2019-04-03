import tasks from './data/tasks-list.js';
import filters from './data/filters-list.js';
import Task from './modules/task.js';
import TaskEdit from './modules/task-edit.js';
import Statistics from './modules/statistics.js';
import Filter from "./modules/filter";
import moment from "moment";

const filtersWrapper = document.querySelector(`.main__filter`);
const tasksControl = document.querySelector(`#control__task`);
const tasksContainer = document.querySelector(`.board__tasks`);
const tasksBoardContainer = document.querySelector(`.board.container`);
const statisticsContainer = document.querySelector(`.statistic.container`);
const statisticsControl = document.querySelector(`#control__statistic`);


const filterTasks = (data, filterName)=> {
  switch (filterName) {
    case `all`:
      return data;

    case `overdue`:
      return data.filter((it) => moment(it.dueDate).format(`D MMMM YYYY`) < moment().format(`D MMMM YYYY`));

    case `today`:
      return data.filter((it) => moment(it.dueDate).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));

    case `repeating`:
      return data.filter((it) => Object.values(it._repeatingDays)
        .some((item) => item === true));

    case `tags`:
      return data.filter((it) => [...it.tags].length);
  }

  return null;
};

const getFiltersTemplate = (filtersData, tasksData) => {
  filtersWrapper.innerHTML = ``;

  filtersData.forEach((item) => {
    const filterComponent = new Filter(item);

    filterComponent.onFilter = () => {
      const filteredTasks = filterTasks(tasksData, item);
      tasksContainer.innerHTML = ``;
      showTasks(filteredTasks, filteredTasks.length);
    };

    filtersWrapper.appendChild(filterComponent.render());
  });
};

getFiltersTemplate(filters, tasks);

const deleteTask = (arrayTasks, i) => {
  arrayTasks[i].isDeleted = true;
  return arrayTasks;
};

const showTasks = (arrayTasks = tasks, count = tasks.length)=> {
  const cards = arrayTasks.filter((it) => !it.isDeleted);
  tasksBoardContainer.classList.remove(`visually-hidden`);
  statisticsContainer.classList.add(`visually-hidden`);
  tasksContainer.innerHTML = ``;

  for (let i = 0; i < count; i++) {
    const taskComponent = new Task(cards[i]);
    const editTaskComponent = new TaskEdit(cards[i]);
    taskComponent.onEdit = () => {
      editTaskComponent.render();
      tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = (newObject) => {
      cards[i] = Object.assign({}, cards[i], newObject);

      taskComponent.update(cards[i]);
      taskComponent.render();
      tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    editTaskComponent.onDelete = () => {
      deleteTask(cards, i);
      tasksContainer.removeChild(editTaskComponent.element);
      editTaskComponent.unrender();
    };
    tasksContainer.appendChild(taskComponent.render());
  }
};

showTasks(tasks, 7);
tasksControl.addEventListener(`click`, showTasks);

const showStatistics = ()=> {
  statisticsContainer.innerHTML = ``;
  tasksBoardContainer.classList.add(`visually-hidden`);
  statisticsContainer.classList.remove(`visually-hidden`);

  const statisticsComponent = new Statistics(tasks);
  statisticsContainer.appendChild(statisticsComponent.render());
  statisticsComponent.createListeners();
  statisticsComponent.createCharts();
};

statisticsControl.addEventListener(`click`, showStatistics);
