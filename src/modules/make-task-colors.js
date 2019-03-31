const getColorElement = (id, currentColor, color) => {
  return `<input type="radio"
    id="color-${color}-${id}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${color === currentColor && `checked`}
    />
    <label
    for="color-${color}-${id}"
    class="card__color card__color--${color}"
    >${color}</label
    >`;
};

export default (id, currentColor, colors) => {
  const colorsArray = Object.entries(colors);
  let colorsElement = ``;
  for (const color of colorsArray) {
    colorsElement += getColorElement(id, currentColor, color[0]);
  }

  return colorsElement;
};
