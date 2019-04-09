import filters from './data/filters-list.js';
import Task from './modules/task.js';
import TaskEdit from './modules/task-edit.js';
import Statistics from './modules/statistics.js';
import Filter from "./modules/filter";
import moment from "moment";
import API from "./modules/api";

const AUTHORIZATION = `Basic lT2LMSQGFTKYBS72vZ5`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filtersWrapper = document.querySelector(`.main__filter`);
const tasksControl = document.querySelector(`#control__task`);
const noTasksContainer = document.querySelector(`.board__no-tasks`);
const tasksContainer = document.querySelector(`.board__tasks`);
const tasksBoardContainer = document.querySelector(`.board.container`);
const statisticsContainer = document.querySelector(`.statistic.container`);
const statisticsControl = document.querySelector(`#control__statistic`);
let tasks = [];


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
      renderTasks(filteredTasks);
    };

    filtersWrapper.appendChild(filterComponent.render());
  });
};

getFiltersTemplate(filters, tasks);

const renderTasks = (arrayTasks)=> {
  // const cards = arrayTasks.filter((it) => !it.isDeleted);
  tasksBoardContainer.classList.remove(`visually-hidden`);
  statisticsContainer.classList.add(`visually-hidden`);
  tasksContainer.innerHTML = ``;

  for (let task of arrayTasks) {
    const taskComponent = new Task(task);
    const editTaskComponent = new TaskEdit(task);
    taskComponent.onEdit = () => {
      editTaskComponent.render();
      tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    // editTaskComponent.onSubmit = (newObject) => {
    //   cards[i] = Object.assign({}, cards[i], newObject);
    //
    //   taskComponent.update(cards[i]);
    //   taskComponent.render();
    //   tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
    //   editTaskComponent.unrender();
    // };

    editTaskComponent.onSubmit = (newObject) => {
      task.title = newObject.title;
      task.tags = newObject.tags;
      task.color = newObject.color;
      task.repeatingDays = newObject.repeatingDays;
      task.dueDate = newObject.dueDate;

      api.updateTask({id: task.id, data: task.toRAW()})
        .then((newTask) => {
          editTaskComponent.block();
          editTaskComponent.saving();
          taskComponent.update(newTask);
          taskComponent.render();

          tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);

          editTaskComponent.unrender();
        }).catch(() => {
          editTaskComponent.shake();
          setTimeout(() => {
            editTaskComponent.unshake();
            editTaskComponent.unblock();
          }, 300);
        });
    };

    editTaskComponent.onDelete = (id) => {
      api.deleteTask(id)
        .then(() => {
          editTaskComponent.block();
          editTaskComponent.deleting();
          api.getTasks()
        })
        .then(() => {
          tasksContainer.removeChild(editTaskComponent.element);
        }).catch(() => {
          editTaskComponent.shake();
          setTimeout(() => {
            editTaskComponent.unshake();
            editTaskComponent.unblock();
          }, 300);
        });
    };

    tasksContainer.appendChild(taskComponent.render());
  }
};

const setStart = () => {
  noTasksContainer.classList.remove(`visually-hidden`);
  noTasksContainer.innerHTML = `Loading tasks...`;
  tasksContainer.classList.add(`visually-hidden`);
};
setStart();

api.getTasks()
  .then((items) => {
    tasks = items; // set local tasks
    noTasksContainer.classList.add(`visually-hidden`);
    tasksContainer.classList.remove(`visually-hidden`);
    renderTasks(tasks);
  }).catch(() => {
    noTasksContainer.innerHTML = `Something went wrong while loading your tasks. Check your connection or try again later`;
  });

// renderTasks(tasks, 7);
// tasksControl.addEventListener(`click`, renderTasks);

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
