export const getRandomNumber = (max = 20) => {
  const MIN = 0;
  return Math.floor(Math.random() * (max - MIN)) + MIN;
};

export const getDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const monthNumber = date.getMonth();
  const monthArray = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
  const monthText = monthArray[monthNumber];
  return `${day} ${monthText}`;
};

export const getDay = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDay();
  const daysArray = [`Mo`, `Tu`, `We`, `Th`, `Fr`, `Sa`, `Su`];

  return daysArray[day];
};

export const getTime = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const dayHalf = hours >= 12 ? `pm` : `am`;
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0 ${minutes}` : minutes;

  return `${hours}:${minutes} ${dayHalf.toUpperCase()}`;
};

export const getRandomBoolean = () => !!Math.round(Math.random());

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
