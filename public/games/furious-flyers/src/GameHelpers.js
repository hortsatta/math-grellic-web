
export const randomNumsArray = (numLength) => {

  const sequenceArr = [...Array(numLength).keys()];

  let randomArrNum = [...sequenceArr];

  for (let i = randomArrNum.length - 1; i > 0; i--) {

    const randomIndex = getRandomWholeNumber(0, sequenceArr.length);

    [randomArrNum[i], randomArrNum[randomIndex]] = [randomArrNum[randomIndex], randomArrNum[i]];

  }

  return randomArrNum;

};