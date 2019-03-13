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
  for (let i = 0; i < daysArray.length; i++) {
    daysElement += getRepeatingDayElement(id, daysArray[i][0], daysArray[i][1]);
  }

  return daysElement;
};
