import {getRandomNumber} from './modules/util.js';
import getFilterElement from './modules/make-filter.js';
import {tasks} from './data/tasks-list.js';
import {filters} from './data/filters-list.js';
import {Task} from './modules/task.js';
import {TaskEdit} from './modules/task-edit.js';

const getFilterTemplate = ()=> {
  const filtersContainer = document.querySelector(`.main__filter`);
  let fragment = ``;

  filters.forEach((item, index) => {
    fragment += getFilterElement(item, getRandomNumber(), index === 0 ? true : ``);
  });

  filtersContainer.innerHTML = fragment;
};

getFilterTemplate();

const filtersWrapper = document.querySelector(`.main__filter`);

const handleFilterClick = (event) => {
  if (event.target.tagName === `INPUT`) {
    getTasksTemplate(tasks, getRandomNumber(10));
  }
};

filtersWrapper.addEventListener(`click`, handleFilterClick);

const tasksContainer = document.querySelector(`.board__tasks`);

const getTasksTemplate = (arrayTasks, count)=> {
  tasksContainer.innerHTML = ``;

  for (let i = 0; i < count; i++) {
    const taskComponent = new Task(tasks[i]);
    const editTaskComponent = new TaskEdit(tasks[i]);
    taskComponent.onEdit = () => {
      editTaskComponent.render();
      tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };
    tasksContainer.appendChild(taskComponent.render());
  }
};

getTasksTemplate(tasks, 7);
