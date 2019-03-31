const getRepeatingDayElement = (id, name, value) => {
  return `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${name}-${id}"
    name="repeat"
    value="${name}"
    ${value ? `checked="true"` : ``}
  />
  <label class="card__repeat-day" for="repeat-${name}-${id}"
        >${name}</label
  >`;
};

export default (id, days) => {
  const daysArray = Object.entries(days);
  let daysElement = ``;
  for (const day of daysArray) {
    daysElement += getRepeatingDayElement(id, day[0], day[1]);
  }

  return daysElement;
};
