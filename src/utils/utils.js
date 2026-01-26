import dayjs from 'dayjs';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItemArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function appendElement(container, element) {
  container.getElement().appendChild(element.getElement());
}

function byChecked(a, b) {
  if (a.checked !== b.checked) {
    return Number(b.checked) - Number(a.checked);
  }
  return 0;
}

export {
  getRandom,
  getRandomItemArray,
  appendElement,
  byChecked
};
