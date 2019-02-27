export default (caption, amount, isChecked = false) => {
  return `
    <input
          type="radio"
          id="filter__${caption}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}
          ${amount ? `` : `disabled`}
        />
        <label for="filter__${caption}" class="filter__label">
          ${caption} <span class="filter__all-count">${amount}</span></label
        >
  `;
};
