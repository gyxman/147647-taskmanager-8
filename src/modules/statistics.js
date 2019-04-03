import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import moment from 'moment';
import * as _ from 'lodash';
import Component from './component';
import {getColorsArray} from './util';

class statistics extends Component {
  constructor(tasks) {
    super();

    this._data = tasks;
    this._periodStart = moment().startOf(`isoWeek`);
    this._periodEnd = moment().endOf(`isoWeek`);
    this._tagsChart = null;
    this._colorsChart = null;
    this._onShowStatistics = null;
    this._onShowStatisticsButtonClick = this._onShowStatisticsButtonClick.bind(this);
    this._onUpdateStatistics = this._onUpdateStatistics.bind(this);
  }

  _onShowStatisticsButtonClick() {
    if (typeof this._onShowStatistics === `function`) {
      this._onShowStatistics();
    }
  }

  _partialUpdate() {
    this._element.querySelector(`.statistic__task-found`).innerHTML = this._getFilteredTasks().length;
  }

  _onUpdateStatistics() {
    const period = this._element.querySelector(`.statistic__period-input`).value.split(` - `);
    this._periodStart = moment(period[0], `DD MMM`).startOf(`day`);
    this._periodEnd = period.length > 1 ? moment(period[1], `DD MMM`).endOf(`day`) : moment(period[0], `DD MMM`).endOf(`day`);

    this._colorsChart.destroy();
    this._tagsChart.destroy();
    this.createCharts();
  }

  _getFilteredTasks() {
    return this._data.filter((it) =>
      moment(it.dueDate).isSameOrAfter(this._periodStart) && moment(it.dueDate).isSameOrBefore(this._periodEnd));
  }

  _getTagsData() {
    const data = {};
    const filteredTasks = this._getFilteredTasks();
    const tags = [];
    for (const task of filteredTasks) {
      if (task.tags) {
        task.tags.forEach((tag) => {
          tags.push(tag);
        });
      }
    }
    const uniqueTags = _.countBy(tags);

    data.name = `TAGS`;
    data.labels = Object.entries(uniqueTags).map((it) => it[0]);
    data.value = Object.values(uniqueTags);

    return data;
  }

  _getColorsData() {
    const data = {};
    const filteredTasks = this._getFilteredTasks();
    const colors = filteredTasks.map((it) => it.color);
    const uniqueColors = _.countBy(colors);

    data.name = `COLORS`;
    data.labels = Object.entries(uniqueColors).map((it) => it[0]);
    data.value = Object.values(uniqueColors);

    return data;
  }

  _getChartSettings(name, labelsArray, dataArray, colorsArray) {
    return {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: labelsArray,
        datasets: [{
          data: dataArray,
          backgroundColor: colorsArray
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: ${name}`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    };
  }

  set onShowStatistics(fn) {
    this._onShowStatistics = fn;
  }

  get template() {
    return `<div>
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>
  
          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="${moment(this._periodStart).format(`DD MMMM`)} - ${moment(this._periodEnd).format(`DD MMMM`)}"
            />
          </div>
  
          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">0</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic visually-hidden">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>
  
      <div class="statistic__circle">
        <div class="statistic__tags-wrap visually-hidden">
          <canvas class="statistic__tags" width="400" height="300"></canvas>
        </div>
        <div class="statistic__colors-wrap visually-hidden">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </div>`.trim();
  }

  createCharts() {
    this._element.querySelector(`.statistic__tags-wrap`).classList.remove(`visually-hidden`);
    this._element.querySelector(`.statistic__colors-wrap`).classList.remove(`visually-hidden`);
    const tagsCtx = this._element.querySelector(`.statistic__tags`);
    const colorsCtx = this._element.querySelector(`.statistic__colors`);

    const tagsData = this._getTagsData();
    this._tagsChart = new Chart(tagsCtx, this._getChartSettings(tagsData.name, tagsData.labels, tagsData.value, getColorsArray(tagsData.labels.length)));

    const colorsData = this._getColorsData();
    this._colorsChart = new Chart(colorsCtx, this._getChartSettings(colorsData.name, colorsData.labels, colorsData.value, colorsData.labels));

    this._partialUpdate();
  }

  createListeners() {
    flatpickr(`.statistic__period-input`, {
      mode: `range`,
      altFormat: `j F`,
      altInput: true,
      dateFormat: `j F`,
      defaultDate: [
        moment(this._periodStart).format(`DD MMMM`),
        moment(this._periodEnd).format(`DD MMMM`)
      ],
      locale: {
        rangeSeparator: ` - `,
        firstDayOfWeek: 1
      },
      onClose: this._onUpdateStatistics
    });
  }

  removeListeners() {}
}

export default statistics;
