import BaseScene from './BaseScene';

import { scaleBasedOnResolution, positionBasedOnResolution, sizeBasedOnResolutionProportion } from './Utils.js';

import { readjustTextBasedOnContainer } from './AdjustFontSize.js';

class HintScene extends BaseScene{

  constructor(){

    super('HintScene');

    this.hintIcon = null;

    this.hintTextBg = null;

    this.closeButton = null;

    this.hintText = null;

    this.hintTextDefaultFontSize = 0;

    this.hintTextMaxHeight = 0;

    this.hintTextWordWrapWidth = 0;

  }

  create() {

    this.setHintSceneReference(this);

    this.createGraphics();

    this.updateObjectProperties();

    this.createHintText();

    this.hintEventHandler(this.hintIcon);

    this.setSceneVisibility(false);

  }

  createGraphics (){

    this.hintIcon = this.add
      .image(0, 0, 'hintIcon')
      .setOrigin(.5)
      .setAlpha(0)
      .setDepth(1)
      .setInteractive();

    this.hintTextBg = this.add
      .image(0, 0, 'textbg')
      .setOrigin(.5)
      .setInteractive();

    this.closeButton = this.add
      .image(0, 0, 'closebutton')
      .setOrigin(0, .7)
      .setInteractive();

    this.closeEventHandler(this.closeButton);

    this.addRoomInteractiveSprite(this.hintIcon);

  }

  updateObjectProperties() {

    const setHintHolderProperties = () => {

      sizeBasedOnResolutionProportion(this.hintIcon, .095, this);

      const hintIconPosition = positionBasedOnResolution(.17, .81, this);

      this.hintIcon.setPosition(hintIconPosition.xPosition, hintIconPosition.yPosition);

    }

    const setHintTextBgProperties = () => {

      scaleBasedOnResolution(this.hintTextBg, 0.35, 0.6, this);

      const hintHolderPosition = positionBasedOnResolution(.5, .5, this);
  
      this.hintTextBg.setPosition(hintHolderPosition.xPosition, hintHolderPosition.yPosition);

    }
    
    const setCloseButtonProperties = () => {

      const width = this.hintTextBg.displayWidth * 0.06;

      this.closeButton.displayWidth = width;
      this.closeButton.displayHeight = width;

      const position = this.hintTextBg.getTopRight();

      this.closeButton.setPosition(position.x, position.y);
  
    }

    setHintHolderProperties();

    setHintTextBgProperties();

    setCloseButtonProperties();

    this.hintTextDefaultFontSize = this.hintTextBg.displayHeight * .08;

    this.hintTextMaxHeight = this.hintTextBg.displayHeight * .8;

    this.hintTextWordWrapWidth = this.hintTextBg.displayHeight * .8;

  }

  createHintText(){

    const hintHolderTextPosition = this.hintTextBg.getCenter();

    this.hintText = this.add.text(hintHolderTextPosition.x, hintHolderTextPosition.y, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.hintTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.hintTextWordWrapWidth,
        useAdvancedWrap: true
      }
    });

    this.hintText.setOrigin(.5);

  }

  updateHintText(hintText){

    this.hintText.text = hintText;

    this.hintText.setFontSize(this.hintTextDefaultFontSize);

    this.hintText.setWordWrapWidth(this.hintTextWordWrapWidth, true);

    readjustTextBasedOnContainer(
      this.hintText,
      this.hintTextMaxHeight,
      parseFloat(this.hintText.style.fontSize),
      this.hintTextWordWrapWidth,
      .025
    )

  }

  setSceneVisibility(isVisible){

    this.hintTextBg.setVisible(isVisible);

    this.hintText.setVisible(isVisible);

    this.closeButton.setVisible(isVisible);

  }

  //EventHandler

  hintEventHandler = (hintIcon) => {
    
    hintIcon.on('pointerdown', () => {

      if(!this.hintTextBg.visible
        && !BaseScene.accessControlSceneRef.codePanel.visible
        && !BaseScene.questionSceneRef.qAndAContainer.visible){

          BaseScene.holderAudio.play();

          this.setSceneVisibility(true);

        }
  
    });

  }

  closeEventHandler = (button) => {

    button.on('pointerdown', () => {

      BaseScene.holderAudio.play();

      this.setSceneVisibility(false);

    });

  }

}

export default HintScene;