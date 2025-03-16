import BaseScene from './BaseScene';

import isOnline from 'is-online'; 

export const scaleBasedOnResolution = (image, xScalePercentage, YScalePercentage) => {

  const xResolution = BaseScene.windowWidth;
  const YResolution = BaseScene.windowHeight;

  const scaleX = xResolution * xScalePercentage / image.width;
  const scaleY = YResolution * YScalePercentage / image.height;

  return image.setScale(scaleX, scaleY);
  
}

export const sizeBasedOnResolutionProportion = (image, widthPercentage) => {

  const xResolution = BaseScene.windowWidth;

  const spriteWidth = xResolution * widthPercentage;

  image.displayWidth = spriteWidth;

  image.displayHeight = spriteWidth;

  return image;

};

export const scaleBasedOnImage = (parentImgBounds, childImg, xPercent, yPercent) => {

  const scaleX = parentImgBounds.width * xPercent / childImg.width;
  const scaleY = parentImgBounds.height * yPercent / childImg.height;

  return childImg.setScale(scaleX, scaleY);

}

export const sizeBasedOnImageProportion = (parentImg, childImg, percent) => {
  
  const parentImgWidth = parentImg.displayWidth;

  const targetSpriteSize = parentImgWidth * percent;

  childImg.displayWidth = targetSpriteSize;

  childImg.displayHeight = targetSpriteSize;

  return childImg;

};

export const positionBasedOnResolution = (xPercentage, yPercentage) => {

  const xResolution = BaseScene.windowWidth;
  const YResolution = BaseScene.windowHeight;

  const xPosition = xResolution * xPercentage;
  const yPosition = YResolution * yPercentage;

  return {xPosition, yPosition}
}

export const calculateQuotient = (dividend, divisor) => {
  return dividend / divisor;
}

export const calculateDifference = (minuend, subtrahend) => {
  return minuend - subtrahend;
}

export const calculateSum = (num1, num2) => {
  return num1 + num2;
}

export const calculateProduct =(multiplicand, multiplier) => {
  return multiplicand * multiplier;
}

export const toPercent = (value) => {

  return value / 100;

}

export const toWholeNumber = (value) => {

  return value * 100;

}

export const toTwoDecimalPlace = (value) => {

  return Math.floor(value * 100) / 100
  
}

export const getTopCoordinate = (obj) => {
  const bounds = obj.getBounds();

  return bounds.top;
}

export const leftBotMostXYCoordinate = (obj) => {
  const bounds = obj.getBounds();

  const x = bounds.left;
  const y = bounds.bottom;

  return {x, y};
}

export const getHeightCoordinate = (obj, percent) => {

  const bounds = obj.getBounds();

  return bounds.top + (bounds.height * percent);

}

export const getWidthCoordinate = (obj, percent) => {

  const bounds = obj.getBounds();

  return bounds.left + (bounds.width * percent);

}

export const topLeftPercentage = (obj) => {
  const bounds = obj.getBounds();

  const x = bounds.left

  const y = bounds.bottom;

  return {x, y};

}

export const convertHeightCoordinateToPercent = (objBounds, yCoordinate) => {

  const relativeY = yCoordinate - objBounds.top;

  return relativeY / objBounds.height;

}

export const occupy = (obj1, obj2) => {
  const bounds1 = obj1.getBounds();
  const bounds2 = obj2.getBounds();

  const percentage = (bounds1.width / bounds2.width) * 100;

  const x = bounds1.left + (bounds1.width * percentage);


  return x;
}

export const changeTextColor = (element, {isCorrectAnswer = false, targetColor = ''}) => {

  if (targetColor === ''){
    
    targetColor = isCorrectAnswer ? '#32CD32' : '#D0312D';
    
  }

  element.setFill(targetColor);

}

export const checkInternetConnection = async () => {

  return await isOnline();
  
};

export const waitForInternetConnection = () => {

  return new Promise((resolve) => {

    const intervalId = setInterval(async () => {

      if (await checkInternetConnection()) {

        clearInterval(intervalId);

        resolve(true);

      }

    }, 5000);

  });

};