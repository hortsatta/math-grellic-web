import { getRandomWholeNumber } from './Common.js';

export const generateRandomLetters = (count) => {

  let generatedLetters = [];

  const getRandomLetter = () => {

    let letter;

    do {

      const randomNumber = getRandomWholeNumber(65, 90);

      letter = String.fromCharCode(randomNumber);

    } while (generatedLetters.includes(letter));

    generatedLetters.push(letter);

  };

  
  for (let i = 0; i < count; i++) {

    getRandomLetter();

  }

  return generatedLetters;
}

export const getUniqueRandomNumber = (count, min, max) => {

  const uniqueNumbers = [];

  while (uniqueNumbers.length < count) {

    const randomNum = getRandomWholeNumber(min, max);

    if (!uniqueNumbers.includes(randomNum)) {
      uniqueNumbers.push(randomNum);
    }

  }

  return uniqueNumbers;

}

export const randomNumsArray = (numLength) => {

  const randomArrNum = Array.from({ length: numLength }, (_, i) => i);

  for (let i = randomArrNum.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [randomArrNum[i], randomArrNum[randomIndex]] = [randomArrNum[randomIndex], randomArrNum[i]];
  }

  return randomArrNum;
  
};



