import BaseScene from './BaseScene';

import { scaleBasedOnResolution, positionBasedOnResolution, changeTextColor } from './Utils.js';

import { readjustTextBasedOnContainer } from './AdjustFontSize.js';

import { RoomSpriteProperties } from './RoomSpriteProperties.js';

import { randomNumsArray } from './GameHelpers.js';

import { getQuestionImageUrl } from './api/instance.api.js';

class QuestionScene extends BaseScene
{
  constructor() {

    super('QuestionScene');

    this.roomCode = "";

    this.randomNumArray = [];

    this.answersTextArr = [];

    this.answersImgArr = [];

    this.chosenQandA = {};

    this.qAndAContainer = null;

    this.questionImg = null;

    this.questionText = null;

    this.questionBg = null;

    this.answerBg1 = null;

    this.answerBg2 = null;

    this.answerBg3 = null;

    this.answerBg4 = null;

    this.canAnswer = true;

    this.currentQuestionIndex = 0;

    this.questionTextDefaultFontSize = 0;

    this.questionTextHeightLimit = 0;

    this.questionWidth = 0;

    this.questionImgHeightLimit = 0;

    this.answerTextDefaultFontSize = 0;

    this.answerTextHeightLimit = 0;

    this.answerTextWordWrapWidth = 0;

    this.answerCount = 4;

  }

  async create() {

    this.setQuestionSceneReference(this);

    const { questionHolder } = RoomSpriteProperties(BaseScene.currentRoomIndex);

    this.createQandABgGraphics();

    this.setObjectProperties(questionHolder);

    this.createQuestionTextAndImage();

    this.createAnswerTextAndImage();

    this.setAnswerIndexAndEvent();

    this.setSceneVisibility(false);

    if (BaseScene.levelData.randomizeQuestions){
      BaseScene.questionSceneRef.setRandomNumArray(BaseScene.sortedQuestionArray.length);
    }

    await BaseScene.playSceneRef.launchScene();

  }

  createQandABgGraphics(){

    this.qAndAContainer = this.add.container();

    this.questionHolder = this.add
      .image(0, 0, 'pencilcase')
      .setOrigin(.5)
      .setAlpha(0);

    this.questionBg = this.add
      .image(0, 0, 'textbg')
      .setOrigin(0);

    this.closeButton = this.add
      .image(0, 0, 'closebutton')
      .setOrigin(0, 1)
      .setInteractive();

    this.answerBg1 = this.add
      .image(0, 0, 'textbg')
      .setOrigin(1,0)
      .setInteractive();

    this.answerBg2 = this.add
      .image(0, 0, 'textbg')
      .setOrigin(1, 0)
      .setInteractive();

    this.answerBg3 = this.add
      .image(0, 0, 'textbg')
      .setOrigin(0)
      .setInteractive();

    this.answerBg4 = this.add
      .image(0, 0, 'textbg')
      .setOrigin(0)
      .setInteractive();

    this.qAndAContainer.add(this.closeButton);
    this.qAndAContainer.add(this.questionBg);
    this.qAndAContainer.add(this.answerBg1);
    this.qAndAContainer.add(this.answerBg2);
    this.qAndAContainer.add(this.answerBg3);
    this.qAndAContainer.add(this.answerBg4);
    
    this.closeEventHandler(this.closeButton);

    this.questionHolderEventHandler(this.questionHolder);

    this.addRoomInteractiveSprite(this.questionHolder);

  }

  setObjectProperties(questionHolder) {

    //height

    let availableHeight = BaseScene.windowHeight;

    const questionBgHeight = availableHeight * 0.35;
    const answerBgHeight = availableHeight * 0.25;
    const closeBtnSize = availableHeight * 0.045;

    availableHeight -= closeBtnSize;
    availableHeight -= questionBgHeight;
    availableHeight -= answerBgHeight * 2;
    
    const inbetweenSpace = availableHeight / 4;

    //width

    const questionBgWidth = BaseScene.windowWidth * .4;
    const answerBgWidth = BaseScene.windowWidth * .23;

    const setCloseButtonProperties = () => {

      this.closeButton.displayWidth = closeBtnSize;
      this.closeButton.displayHeight = closeBtnSize;

      this.closeButton.x = this.questionBg.x + this.questionBg.displayWidth;
      this.closeButton.y = this.questionBg.y;

    }

    const setQuestionScale = () => {

      this.questionBg.displayHeight = questionBgHeight;
      this.questionBg.displayWidth = questionBgWidth;

      this.questionBg.y = closeBtnSize;

    };

    const setAnswerProperties = (answerBg, width, height, positionX, positionY) => {

      answerBg.displayWidth = width;
      answerBg.displayHeight = height;

      answerBg.x = positionX;
      answerBg.y = positionY;

    };

    const setQAndAContainerPosition = (centerQuestionBgPos) => {

      this.qAndAContainer.setPosition(
        BaseScene.windowWidth / 2 - centerQuestionBgPos, 
        BaseScene.windowHeight / 2 - this.qAndAContainer.getBounds().height / 2, 
      );

    }

    const setQandATextProperties = () => {

      this.questionTextDefaultFontSize = this.questionBg.displayHeight * .125;

      this.questionTextHeightLimit = this.questionBg.displayHeight * .86;

      this.questionImgHeightLimit = this.questionBg.displayHeight * .9;
  
      this.questionWidth = this.questionBg.displayWidth * .85;
  
      this.answerTextDefaultFontSize = this.answerBg1.displayHeight * .20;
  
      this.answerTextHeightLimit = this.answerBg1.displayHeight * .85;
  
      this.answerTextWordWrapWidth = this.answerBg1.displayWidth * .85;

    }

    setQuestionScale();

    setCloseButtonProperties();

    //spacing

    const centerQuestionBgPos = this.questionBg.x + this.questionBg.displayWidth / 2;

    const halfOfVerticalSpace = inbetweenSpace * .45;

    const leftAnswerBgXposition = centerQuestionBgPos - halfOfVerticalSpace;

    const rightAnswerBgXposition = centerQuestionBgPos + halfOfVerticalSpace;

    const topAnswerBgYposition = this.questionBg.y + this.questionBg.displayHeight + inbetweenSpace;

    setAnswerProperties(this.answerBg1, answerBgWidth, answerBgHeight, leftAnswerBgXposition, topAnswerBgYposition);
    setAnswerProperties(this.answerBg3, answerBgWidth, answerBgHeight, rightAnswerBgXposition, topAnswerBgYposition);

    const botAnswerBgYposition = this.answerBg1.y + this.answerBg1.getBounds().height + inbetweenSpace;

    setAnswerProperties(this.answerBg2, answerBgWidth, answerBgHeight, leftAnswerBgXposition, botAnswerBgYposition);
    setAnswerProperties(this.answerBg4, answerBgWidth, answerBgHeight, rightAnswerBgXposition, botAnswerBgYposition);

    setQandATextProperties();

    setQAndAContainerPosition(centerQuestionBgPos);

    this.setQuestionHolderProperties(questionHolder);

  }

  setQuestionHolderProperties(questionHolder){

    scaleBasedOnResolution(this.questionHolder, questionHolder.xScale, questionHolder.yScale);

    const questionHolderPosition = positionBasedOnResolution(questionHolder.xPosition, questionHolder.yPosition);

    this.questionHolder.setPosition(questionHolderPosition.xPosition, questionHolderPosition.yPosition);

  }

  createQuestionTextAndImage(){

    //answer 1

    const questionBgBounds = this.questionBg.getBounds();

    const xPosition = questionBgBounds.x + questionBgBounds.width / 2;
    const yPosition = questionBgBounds.y + questionBgBounds.height / 2;

    this.questionText = this.add.text(xPosition, yPosition, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.questionTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.questionWidth,
        useAdvancedWrap: true
      }
    });

    this.questionText.setOrigin(.5);

    this.questionImg = this.add
      .image(0, 0, 'placeholder')
      .setOrigin(.5)
      .setScale(0);

    this.questionImg.x = xPosition;
    this.questionImg.y = yPosition;

  }

  createAnswerTextAndImage(){

    //answer 1

    const answer1BgBounds = this.answerBg1.getBounds();
    const answer1BgXPosition = answer1BgBounds.x + answer1BgBounds.width / 2;
    const answer1BgYPosition = answer1BgBounds.y + answer1BgBounds.height / 2;

    const answer1Text = this.add.text(answer1BgXPosition, answer1BgYPosition, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerTextWordWrapWidth,
        useAdvancedWrap: true
      }
    });

    answer1Text.setOrigin(.5);

    const answer1Img = this.add
      .image(0, 0, 'placeholder')
      .setOrigin(.5)
      .setScale(0);

    this.answersTextArr.push(answer1Text);
    this.answersImgArr.push(answer1Img);

    answer1Img.x = answer1BgXPosition;
    answer1Img.y = answer1BgYPosition;

    //answer 2

    const answer2BgBounds = this.answerBg2.getBounds();
    const answer2BgXPosition = answer2BgBounds.x + answer2BgBounds.width / 2;
    const answer2BgYPosition = answer2BgBounds.y + answer2BgBounds.height / 2;

    const answer2Text = this.add.text(answer2BgXPosition, answer2BgYPosition, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerTextWordWrapWidth,
        useAdvancedWrap: true
      }
    });

    answer2Text.setOrigin(.5);

    const answer2Img = this.add
      .image(0, 0, 'placeholder')
      .setOrigin(.5)
      .setScale(0);

    this.answersTextArr.push(answer2Text);
    this.answersImgArr.push(answer2Img);

    answer2Img.x = answer2BgXPosition;
    answer2Img.y = answer2BgYPosition;

    //answer 3

    const answer3BgBounds = this.answerBg3.getBounds();
    const answer3BgXPosition = answer3BgBounds.x + answer3BgBounds.width / 2;
    const answer3BgYPosition = answer3BgBounds.y + answer3BgBounds.height / 2;

    const answer3Text = this.add.text(answer3BgXPosition, answer3BgYPosition, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerTextWordWrapWidth,
        useAdvancedWrap: true
      }
    });

    answer3Text.setOrigin(.5);

    const answer3Img = this.add
      .image(0, 0, 'placeholder')
      .setOrigin(.5)
      .setScale(0);

    this.answersTextArr.push(answer3Text);
    this.answersImgArr.push(answer3Img);

    answer3Img.x = answer3BgXPosition;
    answer3Img.y = answer3BgYPosition;

    //answer 4

    const answer4BgBounds = this.answerBg4.getBounds();
    const answer4BgXPosition = answer4BgBounds.x + answer4BgBounds.width / 2;
    const answer4BgYPosition = answer4BgBounds.y + answer4BgBounds.height / 2;

    const answer4Text = this.add.text(answer4BgXPosition, answer4BgYPosition, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerTextWordWrapWidth,
        useAdvancedWrap: true
      }
    });

    answer4Text.setOrigin(.5);

    const answer4Img = this.add
      .image(0, 0, 'placeholder')
      .setOrigin(.5)
      .setScale(0);

    this.answersTextArr.push(answer4Text);
    this.answersImgArr.push(answer4Img);

    answer4Img.x = answer4BgXPosition;
    answer4Img.y = answer4BgYPosition;

  }

  setQandAText(){

    const setQuestionTextAndImage = () => {

      if (this.chosenQandA.textType === "text"){

        if (this.questionText.scale === 0){
          this.questionText.setScale(1);
        }

        if (this.questionImg.scale > 0){
          this.questionImg.setScale(0);
        }

        this.questionText.setText(this.chosenQandA.text);

        this.questionText.setFontSize(this.questionTextDefaultFontSize);

        readjustTextBasedOnContainer(
          this.questionText,
          this.questionTextHeightLimit,
          parseFloat(this.questionText.style.fontSize),
          this.questionWidth,
          .025
        )

      } else {

        if (this.questionImg.scale === 0){
          this.questionImg.setScale(1);
        }

        if (this.questionText.scale > 0){
          this.questionText.setScale(0);
        }

        const fileName = this.extractFileName(this.chosenQandA.text);

        if (this.textures.exists(fileName)) {
          this.questionImg.setTexture(fileName);
        }

        this.questionImg.displayHeight = Math.min(this.questionImg.displayHeight, this.questionImgHeightLimit);
        this.questionImg.displayWidth = Math.min(this.questionImg.displayWidth, this.questionWidth);

      }

    }

    const setAnswerTextAndImage = async() => {

      for (let i = 0; i < this.answerCount; i++) {

        const imgElement = this.answersImgArr[i];
        const textElement = this.answersTextArr[i];

        if (this.chosenQandA.choices[i].textType === "text"){

          if (textElement.scale === 0){
            textElement.setScale(1);
          }
  
          if (this.answersImgArr[i].scale > 0){
            this.answersImgArr[i].setScale(0);
          }
          
          textElement.setText(this.chosenQandA.choices[i].text);
          
          textElement.setFontSize(this.answerTextDefaultFontSize);
  
          readjustTextBasedOnContainer(
            textElement,
            this.answerTextHeightLimit,
            parseFloat(textElement.style.fontSize),
            this.answerTextWordWrapWidth,
            .025
          )
  
        } else if (this.chosenQandA.choices[i].textType === "image"){
  
          if (imgElement.scale === 0){
            imgElement.setScale(1);
          }
  
          if (this.answersTextArr[i].scale > 0){
            this.answersTextArr[i].setScale(0);
          }
  
          const fileName = this.extractFileName(this.chosenQandA.choices[i].text);
  
          if (this.textures.exists(fileName)) {
            imgElement.setTexture(fileName);
          }
  
          imgElement.displayHeight = Math.min(imgElement.displayHeight, this.answerBg1.displayHeight * .9);
          imgElement.displayWidth = Math.min(imgElement.displayWidth, this.answerBg1.displayWidth * .9);
  
        } else {

          const textureKey = "expression_" + this.chosenQandA.choices[i].id;

          if(textElement.scale > 0){
            textElement.setScale(0);
          }

          const setImageTexture = () => {
            imgElement.setTexture(textureKey);
            imgElement.setScale(1);
          }

          if(this.textures.exists(textureKey)){
            setImageTexture();
          } else {

            //needed for there is a small delay on latex expression conversion
            if(imgElement.scale > 0){
              imgElement.setScale(0);
            }

            const svgFile = await this.latexToSvg(this.chosenQandA.choices[i].text);

            if (svgFile){
  
              this.convertInlineSvgToPhaserTexture(
                svgFile, 
                textureKey, 
                this.answerBg1.displayWidth, 
                this.answerBg1.displayHeight
              );

              this.textures.once(`addtexture-${textureKey}`, () => {
                setImageTexture();
              });

            }
          }

        }
  
      }

    }

    setQuestionTextAndImage();
    setAnswerTextAndImage();

    BaseScene.hintSceneRef.updateHintText(this.chosenQandA.hintText);

  }

  resetAnswerTextColor(){

    this.answersTextArr.forEach(element => {
      changeTextColor(element, {targetColor: '#000000'});
    });

  }

  setSceneVisibility(isVisible){

    this.qAndAContainer.setVisible(isVisible);

    this.answersTextArr.forEach(element => {
      element.setVisible(isVisible);
    });

    this.answersImgArr.forEach(element => {
      element.setVisible(isVisible);
    });

    this.questionText.setVisible(isVisible);

    this.questionImg.setVisible(isVisible);

    this.closeButton.setVisible(isVisible);

  }

  setAnswerIndexAndEvent = () => {

    this.answerBg1.info = {
      index : 0
    };

    this.answerBg2.info = {
      index : 1
    };

    this.answerBg3.info = {
      index : 2
    };

    this.answerBg4.info = {
      index : 3
    };

    this.answerEventHandler(this.answerBg1);

    this.answerEventHandler(this.answerBg2);

    this.answerEventHandler(this.answerBg3);

    this.answerEventHandler(this.answerBg4);

  }

  updateQuestionHolderTexture(sprite){

    this.questionHolder.setTexture(sprite);

  }

  resetQuestionDetails(){

    this.updateQandAData();
    
    this.setQandAText(); 

    this.resetAnswerTextColor();
    
    if(this.getScoreValue() > 0){

      const { questionHolder } = RoomSpriteProperties(BaseScene.currentRoomIndex);

      this.updateQuestionHolderTexture(questionHolder.sprite);

      this.setQuestionHolderProperties(questionHolder);

    }

    this.setSceneVisibility(false);

  }

  //Level Data

  updateQandAData(){

    const targetQuestionIndex = !BaseScene.levelData.randomizeQuestions 
      ? this.currentQuestionIndex 
      : this.randomNumArray[this.currentQuestionIndex];

    console.log("this.currentQuestionIndex: ", this.currentQuestionIndex);

    console.log("targetQuestionIndex: ", targetQuestionIndex);

    this.chosenQandA = BaseScene.sortedQuestionArray[targetQuestionIndex];

    this.chosenQandA.correctAnswerIndex = this.chosenQandA.choices.findIndex(item => item.isCorrect === true);

    this.updateCurrentQuestionIndex();

  }

  updateCurrentQuestionIndex(){

    const questionsTotalCount = BaseScene.sortedQuestionArray.length;

    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % questionsTotalCount;

    // this.currentQuestionIndex = (this.currentQuestionIndex < questionsTotalCount - 1) 
    //   ? this.currentQuestionIndex += 1
    //   : 0;

  }

  //Event Handler

  questionHolderEventHandler = (holder) => {
    
    holder.on('pointerdown', () => {

      if (!BaseScene.codeText.visible
        && !this.qAndAContainer.visible
        && !BaseScene.accessControlSceneRef.codePanel.visible
        && !BaseScene.hintSceneRef.hintTextBg.visible){

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

  answerEventHandler = (answer) => {

    answer.on('pointerdown', () => {
      
      if (this.canAnswer){

        this.setCanAnswerQuestion(false);

        const isSelectedCorrectAnswer = this.chosenQandA.correctAnswerIndex === answer.info.index;

        changeTextColor(this.answersTextArr[answer.info.index], {isCorrectAnswer: isSelectedCorrectAnswer});

        const handleCorrectAnswer = () => {

          this.displayRoomCode();

          this.setSceneVisibility(false);

        }

        const handleInCorrectAnswer = () => {

          if(this.getScoreValue() > 0){
        
            this.backToDefaultLevel();
  
          } else {
            
            this.setCanAnswerQuestion(true);

            this.resetQuestionDetails();           

          }

        }

        const playAudioAndExecute = (audio, callback) => {

          audio.play();

          setTimeout(callback, 1000);

        };

        if (isSelectedCorrectAnswer) {
          playAudioAndExecute(BaseScene.correctAnswerAudio, handleCorrectAnswer);
        } else {
          playAudioAndExecute(BaseScene.wrongAnswerAudio, handleInCorrectAnswer);
        }
      }

    });  

  }

  setCanAnswerQuestion(value) {
    this.canAnswer = value;
  }

  resetCurrentQuestionIndex(){
    this.currentQuestionIndex = 0;
  }

  setRandomNumArray(length){
    this.randomNumArray = randomNumsArray(length);
  }

  //Load Images

  divideQandAArrayImageAndLoad = async () => {

    const targetArrayPercentage = 0.2;

    const targetFirstArrayIndex = BaseScene.sortedQuestionArray.length * targetArrayPercentage;

    if(!BaseScene.levelData.randomizeQuestions){

      const targetFirstArray = BaseScene.sortedQuestionArray
        .slice(0, targetFirstArrayIndex);

      const targetSecondArray = BaseScene.sortedQuestionArray
        .slice(targetFirstArrayIndex);

      console.log("ordered questions 1: ", targetFirstArray);

      console.log("ordered questions 2: ", targetSecondArray);

      await this.loadImageArray(targetFirstArray, { sync: true });

      this.loadImageArray(targetSecondArray);    

    } 
    else {

      const targetFirstArray = this.randomNumArray
        .slice(0, targetFirstArrayIndex)
        .map(index => BaseScene.sortedQuestionArray[index]);

      const targetSecondArray = this.randomNumArray
        .slice(targetFirstArrayIndex)
        .map(index => BaseScene.sortedQuestionArray[index]);

      console.log("random questions array 1: ", targetFirstArray);

      console.log("random questions array 2: ", targetSecondArray);

      await this.loadImageArray(targetFirstArray, { sync: true });

      this.loadImageArray(targetSecondArray);    

    }

  }

  loadImageArray(qandAData, options = { sync: false }, callback) {
    this.load.off('filecomplete', loadImage, this);
    this.load.off('loaderror', errorLoadImage, this);

    let imageIndex = 0;
    const imagePathArr = [];

    qandAData.forEach((data) => {
      if (data.textType === "image") {
        imagePathArr.push(data.text);
      }
      imagePathArr.push(...data.choices
        .filter(choice => choice.textType === "image")
        .map(choice => choice.text));
    });

    if (options.sync) {
      options.promise = new Promise((resolve) => {
        options.resolve = resolve;
      });
    }

    if (imagePathArr.length === 0) {
      if (options.sync) {
        options.resolve(true);
      }
      if (callback) {
        callback();
      }
      return options.sync ? options.promise : undefined;
    }

    const loadCurrentFile = () => {
      const filePath = imagePathArr[imageIndex];
      const fileName = this.extractFileName(filePath);
      const fileUrl = getQuestionImageUrl(filePath);

      if (!this.textures.exists(fileName)) {
        this.load.image(fileName, fileUrl);
      } else {
        loadImage();
      }
    };

    const loadImage = (key, type, texture) => {

      imageIndex += 1;

      if (imageIndex < imagePathArr.length) {
        loadCurrentFile();
      } else {
        if (options.sync) {
          options.resolve(true);
        }
        if (callback) {
          callback();
        }
      }
    };

    const errorLoadImage = async (file) => {
      await this.checkInternetConnectionBanner();
      loadCurrentFile();
      this.load.start();
    };

    this.load.on('filecomplete', loadImage, this);
    this.load.on('loaderror', errorLoadImage, this);

    loadCurrentFile();
    this.load.start();

    return options.sync ? options.promise : undefined;
  }

  extractFileName(filePath) {
    return filePath.match(/[^/]+$/)[0];
  }

  //Latex Expression
  latexToSvg = async (latex) => {
    try {
      const node = await MathJax.tex2svgPromise(latex, { display: true });
      return node.querySelector("svg");
    } catch (err) {
      return null;
    }
  };

  convertInlineSvgToPhaserTexture(svg, textureKey, containerWidth, containerHeight, scaleFactor = 0.55) {
    const svgString = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const aspectRatio = originalWidth / originalHeight;

      let targetWidth = containerWidth * scaleFactor;
      let targetHeight = containerHeight * scaleFactor;

      if (targetWidth / targetHeight > aspectRatio) {
          targetWidth = targetHeight * aspectRatio;
      } else {
          targetHeight = targetWidth / aspectRatio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      this.textures.addImage(textureKey, canvas);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

}

export default QuestionScene;