export const readjustTextBasedOnContainer = (textReference, maxTextHeight, defaultFontSize, wordWrapWidth, reductionFactor) => {

  let textHeight = textReference.getBounds().height;

  const fontResizeCount = .95 / reductionFactor; //.95 for 5% minimum font size

  if (textHeight > maxTextHeight){

    for (let i = 1; i < fontResizeCount; i++) {

      const fontSizeReduction = defaultFontSize * (i * reductionFactor);

      const textFontSize = defaultFontSize - fontSizeReduction;

      textReference.setFontSize(textFontSize);

      textReference.setWordWrapWidth(wordWrapWidth, true);

      textHeight = textReference.getBounds().height;

      if (textHeight < maxTextHeight){
        break;
      }

    }

  }
    
};

export default readjustTextBasedOnContainer;