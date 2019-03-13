import {getRandomNumber} from './util.js';

const getHashtagElement = (name) => {
  return `<span class="card__hashtag-inner">
    <input
      type="hidden"
      name="hashtag"
      value="repeat"
      class="card__hashtag-hidden-input"
    />
    <button type="button" class="card__hashtag-name">
      #${name}
    </button>
    <button type="button" class="card__hashtag-delete">
      delete
    </button>
  </span>`;
};

export default (hashtags) => {
  const hashtagsArray = [...hashtags];
  let hashtagsElement = ``;
  for (let i = 0; i < getRandomNumber(3); i++) {
    hashtagsElement += getHashtagElement(hashtagsArray[getRandomNumber(hashtagsArray.length - 1)]);
  }

  return hashtagsElement;
};
