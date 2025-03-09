export const getRandomElementFromArray = (array) => array[Math.floor(Math.random() * array.length)];

export const stringsMatchCaseInsensitive = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();