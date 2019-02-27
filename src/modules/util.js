export const getRandomNumber = (max = 20) => {
  const MIN = 0;
  return Math.floor(Math.random() * (max - MIN)) + MIN;
};
