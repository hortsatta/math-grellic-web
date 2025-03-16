import BaseScene from './BaseScene.js';

import { sizeBasedOnResolutionProportion, scaleBasedOnImage, getHeightCoordinate, getWidthCoordinate, positionBasedOnResolution, convertHeightCoordinateToPercent, changeTextColor } from './Utils.js';

import { RoomSpriteProperties } from './RoomSpriteProperties.js';

import { generateRandomLetters, getUniqueRandomNumber } from './GameHelpers.js';

class AccessControlPanel extends BaseScene{

  constructor(){

    super('AccessControlPanel');

    this.codePanel;

    this.wordBg;

    this.minimizeIcon;

    this.keypadBgGroup = null;

    this.keypadLetterGroup = null;

    this.codeBgGroup = null;

    this.codeLetterArr = [];

    this.codeLetterCurrentIndex = 0;

    this.keypadCount = 9;

    this.defaultKeyCodeColor = '#ffffff';

    this.defaultKeypadLetterColor = '#000000';

  }
  
  create() {

    this.setAccessControlSceneReference(this);

    this.createGraphics();

    this.setObjectProperties();

    this.createKeyPadBackground(3);

    this.createLetterBackground(3);

    this.setCodeLetter();

    this.setSceneVisibility();

  }

  createGraphics(){

    this.doorAccess = this.add
      .image(0, 0, 'doorAccess')
      .setOrigin(.5)
      .setAlpha(0)
      .setDepth(1)
      .setInteractive();
      
    this.codePanel = this.add
      .image(0, 0, 'codepanel')
      .setOrigin(.5, .5); 

    this.wordBg = this.add
      .image(0, 0, 'wordbg')
      .setOrigin(.5, .5); 

    this.minimizeIcon = this.add
      .image(0, 0, 'minimizeIcon')
      .setOrigin(.5, .5)
      .setInteractive(); 

    this.doorAccessClickEventHandler(this.doorAccess);

    this.closeEventHandler(this.minimizeIcon);

    this.addRoomInteractiveSprite(this.doorAccess);

  }
    
  setObjectProperties() {

    const { doorAccess } = RoomSpriteProperties(BaseScene.currentRoomIndex);

    const setDoorAccessProperties = () => {

      sizeBasedOnResolutionProportion(this.doorAccess, doorAccess.scale);

      const doorAccessPosition = positionBasedOnResolution(doorAccess.xPosition, doorAccess.yPosition);

      this.doorAccess.setPosition(doorAccessPosition.xPosition, doorAccessPosition.yPosition); 

    }

    const setCodePanelProperties = () => {

      sizeBasedOnResolutionProportion(this.codePanel, .33);

      const answerBgPosition = positionBasedOnResolution(.5, .5);

      this.codePanel.setPosition(answerBgPosition.xPosition, answerBgPosition.yPosition); 

    }

    const setWordBgProperties = () => {

      scaleBasedOnImage(this.codePanel.getBounds(), this.wordBg, .995, .15);

      this.wordBg.setPosition(
        getWidthCoordinate(this.codePanel, 0.5), 
        getHeightCoordinate(this.codePanel, 0.3)
      ); 

    }

    const setMinimizeIconProperties = () => {

      scaleBasedOnImage(this.codePanel.getBounds(), this.minimizeIcon, .05, .05);

      this.minimizeIcon.setPosition(
        getWidthCoordinate(this.codePanel, 0.93), 
        getHeightCoordinate(this.codePanel, 0.07)
      ); 

    }

    setDoorAccessProperties();

    setCodePanelProperties();

    setWordBgProperties();

    setMinimizeIconProperties();

  }

  createLetterBackground(letterCount){

    this.codeBgGroup = this.add.group();

    const keypadPaddingPercent = .018;

    const keypadLengthXPercent = .095;

    const keypadLengthYPercent = .65;
   
    const answerBgDisplayWidth = this.codePanel.displayWidth;

    const posXInBetweenPadding = answerBgDisplayWidth * keypadPaddingPercent;

    const totalPercent = this.totalPercent(letterCount, keypadLengthXPercent, keypadPaddingPercent);

    let blockPositionX = getWidthCoordinate(this.wordBg, (1 - totalPercent) / 2);

    for (let i = 0; i < letterCount; i++) {

      const letterbg = this.add
        .image(0, 0, 'letterbg')
        .setOrigin(0, .5); 

      this.codeBgGroup.add(letterbg);

      scaleBasedOnImage(this.wordBg.getBounds(), letterbg, keypadLengthXPercent, keypadLengthYPercent);

      letterbg.setPosition(blockPositionX, this.wordBg.getCenter().y);  

      blockPositionX = getWidthCoordinate(letterbg, 1) + posXInBetweenPadding;

    }

  }

  createKeyPadBackground(){

    this.keypadBgGroup = this.add.group();

    const verticalkeypadLengthYPercent = 3;

    const answerBgBounds = this.codePanel.getBounds();

    const keypadPaddingPercent = .02;

    const keypadLengthPercent = .11;

    const answerBgDisplayWidth = this.codePanel.displayWidth;

    const keypadXPadding = answerBgDisplayWidth * keypadPaddingPercent;

    // vertical start position
    
    const wordBgBottomBound =  this.wordBg.getBottomRight().y;

    const totalHeightPercent = this.totalPercent(verticalkeypadLengthYPercent, keypadLengthPercent, keypadPaddingPercent);

    const wordBgBottomPercent = convertHeightCoordinateToPercent(answerBgBounds, wordBgBottomBound);

    const yCenterCoordinates = (wordBgBottomPercent + 1) / 2;

    const halftotalHeightPercent = totalHeightPercent / 2;

    let keypadPositionY = getHeightCoordinate(this.codePanel, yCenterCoordinates - halftotalHeightPercent);

    // horizontal start position

    const totalWidthPercent = this.totalPercent(verticalkeypadLengthYPercent, keypadLengthPercent, keypadPaddingPercent);

    for (let x = 0; x < 3; x++) {

      let keypadPositionX = getWidthCoordinate(this.codePanel, (1 - totalWidthPercent) / 2);

      let letterbg = null;

      for (let y = 0; y < 3; y++) {

        letterbg = this.add
          .image(0, 0, 'keypad')
          .setOrigin(0)
          .setInteractive(); 

        this.keypadBgGroup.add(letterbg);

        scaleBasedOnImage(this.codePanel.getBounds(), letterbg, keypadLengthPercent, keypadLengthPercent);

        letterbg.setPosition(keypadPositionX, keypadPositionY);  

        keypadPositionX += letterbg.displayWidth + keypadXPadding;

      }

      keypadPositionY += letterbg.displayHeight + keypadXPadding;

    }

  }

  setKeypadValues(){

    const baseFontSize = 38;

    const createKeypadLetter = () => {

      this.keypadLetterGroup = this.add.group();

      const keypadBgGroup = this.keypadBgGroup.getChildren();

      for (let i = 0; i < keypadBgGroup.length; i++) {

        const keypadBg = keypadBgGroup[i];

        const keypadCenterPosition = keypadBg.getCenter();

        const positionX = keypadCenterPosition.x;

        const positionY = keypadCenterPosition.y;

        if (i < keypadBgGroup.length - 1){

          const letter = this.generatedRandomLetters[i];
  
          keypadBg.info = {
            isLetterKey: true,
            key: letter
          };
      
          const targetFontSize = (keypadBg.displayWidth * baseFontSize) / 100;
      
          const letterText = this.add.text(positionX, positionY, letter, {
              fontFamily: BaseScene.fontFamilyStyle,
              fontSize: targetFontSize,
              fill: this.defaultKeypadLetterColor, 
              fontStyle: 'bold'
          });
    
          letterText.setOrigin(.5);
    
          this.keypadLetterGroup.add(letterText);

        } else{

            const backspaceIcon = this.add
              .image(positionX, positionY, 'backspaceicon')
              .setOrigin(.5);

            scaleBasedOnImage(keypadBg.getBounds(), backspaceIcon, .6, .6);

            this.keypadLetterGroup.add(backspaceIcon);
  
            keypadBg.info = {
              isLetterKey: false,
              key: ""
            };

        }

        this.keypadClickEventHandler(keypadBg);

      }

    }

    const updateKeyLetterAndEvent = () => {

      let keypadLetter = this.keypadLetterGroup.getChildren();

      let keypadBg = this.keypadBgGroup.getChildren();

      for (let x = 0; x < keypadLetter.length - 1; x++) {

        const keyLetter = keypadLetter[x];

        const letter = this.generatedRandomLetters[x];

        keyLetter.setText(letter);

        const keyBg = keypadBg[x];

        keyBg.info = {
          isLetterKey: true,
          key: letter
        };

      }

    }

    if (this.keypadLetterGroup !== null){
      updateKeyLetterAndEvent();
    } else {
      createKeypadLetter();
    }

  }

  setCodeLetter(){

    const baseFontSize = 55;

    let children = this.codeBgGroup.getChildren();

    for (let i = 0; i < children.length; i++) {

      let child = children[i];

      const centerPosition = child.getCenter();

      const positionX = centerPosition.x;

      const positionY = centerPosition.y;

      const targetFontSize = (child.displayWidth * baseFontSize) / 100;

      const letterText = this.add.text(positionX, positionY, "", {
          fontFamily: BaseScene.fontFamilyStyle,
          fontSize: targetFontSize,
          fill: this.defaultKeyCodeColor, 
          fontStyle: 'bold'
      });

      letterText.setOrigin(.5);

      this.codeLetterArr.push(letterText);

    }

  }

  totalPercent(spriteCount, spriteLengthByPercent, spriteInBetweenLengthByPercent){

    const totalPercent = (spriteCount * spriteLengthByPercent) + ((spriteCount - 1) * spriteInBetweenLengthByPercent);

    return totalPercent;

  }

  setSceneVisibility(isVisible = false){

    this.codeBgGroup.setVisible(isVisible);

    this.keypadBgGroup.setVisible(isVisible);

    if (this.keypadLetterGroup){
      this.keypadLetterGroup.setVisible(isVisible);
    }

    this.codePanel.setVisible(isVisible);

    this.wordBg.setVisible(isVisible);

    this.minimizeIcon.setVisible(isVisible);

  }

  resetKeyCodeLetter = () => {

    this.codeLetterCurrentIndex = 0;

    this.codeLetterArr.forEach((codeLetter) => {
      codeLetter.setText("");
    });

  }

  resetKeyCodeColor = () => {

    this.codeLetterArr.forEach((codeLetter) => {
      changeTextColor(codeLetter, {targetColor: this.defaultKeyCodeColor});
    });

  }

  setGeneratedRandomLetters(letters){
    this.generatedRandomLetters = letters;
  }

  resetAccessControlPanel(){

    const letterCount = this.keypadCount - 1;

    const keypadLetters = generateRandomLetters(letterCount); // for keypad

    const numberArr = getUniqueRandomNumber(3, 0, letterCount - 1); //for Room Code

    this.setObjectProperties();

    this.resetKeyCodeLetter();

    this.setGeneratedRandomLetters(keypadLetters);

    this.setKeypadValues();

    this.setSceneVisibility();

    return {keypadLetters, numberArr};

  }

  //Event Handler

  doorAccessClickEventHandler = (doorAccess) => {
    
    doorAccess.on('pointerdown', () => {

      if(!this.codePanel.visible
        && !BaseScene.questionSceneRef.qAndAContainer.visible
        && !BaseScene.hintSceneRef.hintTextBg.visible){

          BaseScene.holderAudio.play();

          this.setSceneVisibility(true);

        }

    });

  }
  
  keypadClickEventHandler = (keypad) => {
    
    keypad.on('pointerdown', () => {

      BaseScene.keyAudio.play();
      
      if(this.codeLetterCurrentIndex < this.codeLetterArr.length
        && keypad.info.isLetterKey){

          this.codeLetterArr[this.codeLetterCurrentIndex].setText(keypad.info.key);
    
          this.codeLetterCurrentIndex += 1;

          if (this.codeLetterCurrentIndex === this.codeLetterArr.length){

            let userInputCode = this.codeLetterArr.map(item => item.text).join('');

            const isCodeCorrect = this.checkIfCodeMatch(userInputCode);

            this.codeLetterArr.forEach((codeLetter) => {
              changeTextColor(codeLetter, {isCorrectAnswer: isCodeCorrect})
            });

            // audio
            const audioToPlay = isCodeCorrect 
              ? BaseScene.correctCodeAudio 
              : BaseScene.incorrectCodeAudio;
        
            audioToPlay.play();

            //go to next scene and reset key code properties
            setTimeout(() => {

              this.goToNextScene(isCodeCorrect);

              this.resetKeyCodeColor(),

              this.resetKeyCodeLetter()

            }, 800);

          }

        } else if (this.codeLetterCurrentIndex > 0
            && !keypad.info.isLetterKey) {

              if (this.codeLetterCurrentIndex === this.codeLetterArr.length){

                this.resetKeyCodeColor();

              }

              this.codeLetterCurrentIndex -= 1;

              this.codeLetterArr[this.codeLetterCurrentIndex].setText("");
        
        }

    });

  }

  closeEventHandler = (button) => {

    button.on('pointerdown', () => {

      BaseScene.holderAudio.play();

      this.setSceneVisibility();

      this.resetKeyCodeLetter();

      this.resetKeyCodeColor();

    });

  }

}
  
  export default AccessControlPanel;