import BaseScene from './BaseScene';

import { randomNumsArray } from './GameHelpers.js';

import { getQuestionImageUrl } from './api/instance.api.js';

import { updateActivityCategoryCompletionBySlugAndCurrentStudentUser } from './api/data.api';

class QuestionScene extends BaseScene
{
  constructor() {

    super('QuestionScene');

    this.randomNumArray = [];

    this.answersTextArray = [];

    this.answersImgArray = [];

    this.chosenQandA = {};

    this.answerBg1 = null;

    this.answerBg2 = null;

    this.answerBg3 = null;

    this.answerBg4 = null;

    this.QandAContainer = null;

    this.scaleDownAnimate = null;

    this.scaleUpAnimate = null;

    this.basketballBoardAnimation = null;

    this.questionBgAlpha = null;

    this.answerWidth = 0;

    this.answerHeight = 0;

    this.correctAnswerIndex = 0;

    this.currentQuestionIndex = 0;

    this.questionTextDefaultFontSize = 0;

    this.questionElementWidthLimit = 0;

    this.questionElementHeightLimit = 0;

    this.answerTextDefaultFontSize = 0;

    this.answer1BgBound = {};

    this.answerElementHeightLimit = 0;

    this.answerElementWidthLimit = 0;

    this.basketballBoardPreviousFrame = 0;

    this.QandAContainerPreviousScaleX = 0;

    this.targetScale = 2.5;

    this.answersCount = 4;

    //question text and images
    this.questionText = null;

    this.questionImg = null;

  }

  async create() {

    this.setQuestionSceneRef(this);

    this.setZoomBackgroundAnimation();

    this.createQandABgGraphics();

    this.setObjectProperties();

    this.setDefaultQandAContainerPosition();

    this.createBasketBallBoardAnimation();

    this.setTransparencyQuestionBgAnimation();

    await this.checkInternetConnectionBanner();

    await this.loadInitialQandAImages();

    this.events.emit('questionSceneReady');

  }

  createQandABgGraphics(){

    this.QandAContainer = this.add.container(0, 0);

    //Question

    this.questionBg = this.add
      .sprite(0, 0, 'question_bg')
      .setAlpha(0)
      .setOrigin(.5, 0);

    this.answerBg1 = this.add
      .sprite(0, 0, 'board_6')
      .setOrigin(1, 0)
      .setInteractive();

    this.answerBg2 = this.add
      .sprite(0, 0, 'board_6')
      .setOrigin(0, 0)
      .setInteractive();

    this.answerBg3 = this.add
      .sprite(0, 0, 'board_6')
      .setOrigin(1, 0)
      .setInteractive();

    this.answerBg4 = this.add
      .sprite(0, 0, 'board_6')
      .setOrigin(0, 0)
      .setInteractive();

    this.QandAContainer.add(this.answerBg1);
    this.QandAContainer.add(this.answerBg2);
    this.QandAContainer.add(this.answerBg3);
    this.QandAContainer.add(this.answerBg4);

    this.QandAContainer.add(this.questionBg);

    this.setAnswerIndexAndEvent();

    this.QandAContainer.setVisible(false);

  }

  setObjectProperties() {

    let availableHeight = BaseScene.windowHeight / this.targetScale;
    const availableWidth = BaseScene.windowWidth / this.targetScale;

    const questionBgHeight = availableHeight * 0.35;
    const answerBgHeight = availableHeight * 0.27;

    availableHeight -= questionBgHeight;
    availableHeight -= answerBgHeight * 2;
    
    const inbetweenSpace = availableHeight / 4;

    //width

    const questionBgWidth = availableWidth * .43;
    const answerBgWidth = availableWidth * .25;

    const setQuestionBgScale = () => {

      this.questionBg.displayHeight = questionBgHeight;
      this.questionBg.displayWidth = questionBgWidth;

    };

    const setAnswerProperties = (answerBg, answerWidth, answerHeight, positionX, positionY) => {

      answerBg.displayHeight = answerHeight;
      answerBg.displayWidth = answerWidth;
      
      answerBg.x = positionX;
      answerBg.y = positionY;

    };

    setQuestionBgScale();

    const inBetweenSpacesY = inbetweenSpace;

    const inBetweenSpacesX = inBetweenSpacesY / 2;

    const answerBgPositionX = this.questionBg.getCenter().x;

    const topAnswerPositionY = this.questionBg.getBottomLeft().y + inBetweenSpacesY;
    
    setAnswerProperties(this.answerBg1, answerBgWidth, answerBgHeight, answerBgPositionX - inBetweenSpacesX, topAnswerPositionY);

    setAnswerProperties(this.answerBg2, answerBgWidth, answerBgHeight, answerBgPositionX + inBetweenSpacesX, topAnswerPositionY);

    const botAnswerPositionY = this.answerBg1.getBottomLeft().y + inBetweenSpacesY;

    setAnswerProperties(this.answerBg3, answerBgWidth, answerBgHeight, answerBgPositionX - inBetweenSpacesX, botAnswerPositionY);

    setAnswerProperties(this.answerBg4, answerBgWidth, answerBgHeight, answerBgPositionX + inBetweenSpacesX, botAnswerPositionY);
    
    //Set answer height and width limit
    this.answerTextDefaultFontSize = (this.answerBg1.getBounds().height * this.targetScale) * .18;

    this.answerElementHeightLimit = (this.answerBg1.getBounds().height * this.targetScale) * .85;
    this.answerElementWidthLimit = (this.answerBg1.getBounds().width * this.targetScale) * .85;
    
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

  async setScaleUpAnswers(){

    this.scaleUpAnimate = this.tweens.add({
      targets: this.QandAContainer,
      scaleX: this.targetScale, 
      scaleY: this.targetScale,
      duration: BaseScene.scalingTweenDuration, 
      ease: 'Linear', 
      onUpdate: (tween) => {

        this.setBoardRingProperties();

        this.setDefaultQandAContainerPosition();

      },
      onStart: () => {

        BaseScene.zoomBackground.play();

        this.fadeInBasketBallBoard();

        this.questionBgAlpha.play();

      },
      onComplete: async() => {

        this.updateQandAData();
        
        this.startTimer();

        if (this.answersTextArray.length > 0){

          this.setQATextandImagesVisibility(true);
          
          this.setQandAText();

        } else {
          
          this.createQuestionText();
          
          this.createAnswerText();

        } 

      }
    });

  }

  setScaleDownAnswersBg = (isGameOver, targetObject) => new Promise(resolve => {

    this.scaleDownAnimate = this.tweens.add({
      targets: this.QandAContainer,
      scaleX: 1, 
      scaleY: 1,
      duration: BaseScene.scalingTweenDuration, 
      ease: 'Linear', 
      onUpdate: (tween) => {

        this.setBoardRingProperties();

        this.setDefaultQandAContainerPosition();

      },
      onStart: async() => {

        if(!isGameOver){
  
          this.addSelectedQandA(
            this.chosenQandA.id, 
            this.chosenQandA.choices[targetObject.info.index].id
          );
  
          await this.checkInternetConnectionBanner();
  
          const categoryId = BaseScene.serverData.categories.find(item => item.level === BaseScene.selectedDifficultyIndex);

          // updateActivityCategoryCompletionBySlugAndCurrentStudentUser(
          //   BaseScene.selectedQandA,
          //   categoryId.id
          // );

        }

        BaseScene.zoomBackground.play();

        this.fadeOutBasketBallBoard();

        this.questionBgAlpha.play();

      },
      onComplete: async() => {

        if(!isGameOver){

          BaseScene.playSceneRef.setBallVisibility(true);
  
          setTimeout(() => {
            BaseScene.playSceneRef.shootBallAnimation(targetObject);
          }, 1000);

        } 

        resolve();

      }
    });

  });

  //ring
  setBoardRingProperties(){

    if (this.QandAContainer.scaleX !== this.QandAContainerPreviousScaleX){
         
      this.QandAContainerPreviousScaleX = this.QandAContainer.scaleX;

      if (this.basketballBoardPreviousFrame != this.answerBg1.anims.currentFrame.index){

        this.basketballBoardPreviousFrame = this.answerBg1.anims.currentFrame.index;

        BaseScene.playSceneRef.ringTexture(this.answerBg1.anims.currentFrame.index - 1);

      }

      const answerBounds = [this.answerBg1.getBounds(), this.answerBg2.getBounds(), this.answerBg3.getBounds(), this.answerBg4.getBounds()];

      BaseScene.playSceneRef.adjustRingSizeAndPosition(answerBounds);

    }

  }

  //Q&A
  createAnswerText(){

    //answer 1

    const answer1BgBound = this.answerBg1.getBounds();

    const answer1CenterX = answer1BgBound.x + (answer1BgBound.width / 2);

    const answer1CenterY = answer1BgBound.y + (answer1BgBound.height / 2);

    const answer1Text = this.add.text(answer1CenterX, answer1CenterY, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerElementWidthLimit,
        useAdvancedWrap: true
      }
    });

    answer1Text.setOrigin(.5);

    const answer1Img = this.add
      .image(0, 0, "placeholder")
      .setOrigin(.5);

    answer1Img.x = answer1CenterX;
    answer1Img.y = answer1CenterY;

    this.answersTextArray.push(answer1Text);

    this.answersImgArray.push(answer1Img);

    //answer 2

    const answer2BgBound = this.answerBg2.getBounds();

    const answer2CenterX = answer2BgBound.x + (answer2BgBound.width / 2);

    const answer2CenterY = answer2BgBound.y + (answer2BgBound.height / 2);

    const answer2Text = this.add.text(answer2CenterX, answer2CenterY, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerElementWidthLimit,
        useAdvancedWrap: true
      }
    });

    answer2Text.setOrigin(.5);

    // const answer2FileName = this.chosenQandA.choices[1].textType === "image"
    //   ? this.extractFileName(this.chosenQandA.choices[1].text)
    //   : "";

    const answer2Img = this.add
      .image(0, 0, "placeholder")
      .setOrigin(.5);

    answer2Img.x = answer2CenterX;
    answer2Img.y = answer2CenterY;

    this.answersTextArray.push(answer2Text);

    this.answersImgArray.push(answer2Img);

    //answer 3

    const answer3BgBound = this.answerBg3.getBounds();

    const answer3CenterX = answer3BgBound.x + (answer3BgBound.width / 2);

    const answer3CenterY = answer3BgBound.y + (answer3BgBound.height / 2);

    const answer3Text = this.add.text(answer3CenterX, answer3CenterY, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerElementWidthLimit,
        useAdvancedWrap: true
      }
    });

    answer3Text.setOrigin(.5);

    // const answer3FileName = this.chosenQandA.choices[2].textType === "image"
    //   ? this.extractFileName(this.chosenQandA.choices[2].text)
    //   : "";

    const answer3Img = this.add
      .image(0, 0, "placeholder")
      .setOrigin(.5);

    answer3Img.x = answer3CenterX;
    answer3Img.y = answer3CenterY;

    this.answersTextArray.push(answer3Text);

    this.answersImgArray.push(answer3Img);

    //answer 4

    const answer4BgBound = this.answerBg4.getBounds();

    const answer4CenterX = answer4BgBound.x + (answer4BgBound.width / 2);

    const answer4CenterY = answer4BgBound.y + (answer4BgBound.height / 2);

    const answer4Text = this.add.text(answer4CenterX, answer4CenterY, "", {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.answerTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.answerElementWidthLimit,
        useAdvancedWrap: true
      }
    });

    answer4Text.setOrigin(.5);

    // const answer4FileName = this.chosenQandA.choices[3].textType === "image"
    //   ? this.extractFileName(this.chosenQandA.choices[3].text)
    //   : "";

    const answer4Img = this.add
      .image(0, 0, "placeholder")
      .setOrigin(.5);

    answer4Img.x = answer4CenterX;
    answer4Img.y = answer4CenterY;

    this.answersTextArray.push(answer4Text);

    this.answersImgArray.push(answer4Img);

    this.updateAnswerTextAndImage();

  }

  createQuestionText(){

    const questionBgBound = this.questionBg.getBounds();

    this.questionTextDefaultFontSize = questionBgBound.height * .13;

    this.questionElementWidthLimit = questionBgBound.width * .87;

    this.questionElementHeightLimit = questionBgBound.height * .85;

    const questionBgCenterX = questionBgBound.x + (questionBgBound.width / 2);

    const questionBgCenterY = questionBgBound.y + (questionBgBound.height / 2);

    this.questionText = this.add.text(questionBgCenterX, questionBgCenterY, this.chosenQandA.text, {  
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: this.questionTextDefaultFontSize,
      fill: '#000',
      wordWrap: {
        width: this.questionElementWidthLimit,
        useAdvancedWrap: true
      }
    });

    this.questionText.setOrigin(.5);

    const fileName = this.chosenQandA.textType === "image"
      ? this.extractFileName(this.chosenQandA.text)
      : "placeholder";

    this.questionImg = this.add
      .image(0, 0, fileName)
      .setOrigin(.5);

    if(this.chosenQandA.textType === "text"){

      this.questionImg.setScale(0);

      this.readjustTextBasedOnContainer(
        this.questionText,
        this.questionElementHeightLimit,
        parseFloat(this.questionText.style.fontSize),
        this.questionElementWidthLimit,
        .025
      );

    } else {

      this.questionText.setScale(0);

      this.questionImg.displayHeight = Math.min(this.questionImg.displayHeight, this.questionElementHeightLimit);
      this.questionImg.displayWidth = Math.min(this.questionImg.displayWidth, this.questionElementWidthLimit);

      this.questionImg.x = questionBgCenterX;
      this.questionImg.y = questionBgCenterY;

    }

  }

  setDefaultQandAContainerPosition(){

    const halfContainerWidth = (this.answerBg3.getBounds().left + this.answerBg4.getBounds().right) / 2;

    const halfContainerHeight = (this.questionBg.getBounds().top + this.answerBg4.getBounds().bottom) / 2;

    const xPosition = (BaseScene.windowWidth / 2) - halfContainerWidth;

    const yPosition = (BaseScene.windowHeight / 2) - halfContainerHeight;

    this.QandAContainer.setPosition(xPosition, yPosition);

  }

  setTransparencyQuestionBgAnimation(){

    this.questionBgAlpha = this.tweens.add({
      targets: this.questionBg,
      alpha: 1,
      duration: BaseScene.scalingTweenDuration, 
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      paused: true,
      onYoyo: (tween) => {
        tween.pause();
      },
      onRepeat: (tween) => {
        tween.pause();
      }
    });

  }

  setQandAText(){

    if(this.chosenQandA.textType === "text"){

      if (this.questionText.scale === 0){
        this.questionText.setScale(1);
      }

      if (this.questionImg.scale === 1){
        this.questionImg.setScale(0);
      }
      
      this.questionText.setText(this.chosenQandA.text);

      this.questionText.setFontSize(this.questionTextDefaultFontSize);

      this.readjustTextBasedOnContainer(
        this.questionText,
        this.questionElementHeightLimit,
        parseFloat(this.questionText.style.fontSize),
        this.questionElementWidthLimit,
        .025
      );

    } else {

      if(this.questionImg.scale === 0){
        this.questionImg.setScale(1);
      }

      if(this.questionText.scale === 1){
        this.questionText.setScale(0);
      }

      const fileName = this.extractFileName(this.chosenQandA.text);

      this.questionImg.setTexture(fileName);

      this.questionImg.displayHeight = Math.min(this.questionImg.displayHeight, this.questionElementHeightLimit);
      this.questionImg.displayWidth = Math.min(this.questionImg.displayWidth, this.questionElementWidthLimit);

      //const questionBgCenter = this.questionBg.getCenter();

      const questionBgBound = this.questionBg.getBounds();

      this.questionImg.x = questionBgBound.x + (questionBgBound.width / 2);
      this.questionImg.y = questionBgBound.y + (questionBgBound.height / 2);

    }

    this.updateAnswerTextAndImage();
    
  }

  updateQandAData(){

    const levelData = BaseScene.sortedQandA[BaseScene.selectedDifficultyIndex];

    const randomNumArray = BaseScene.randomArrayPerLevel[BaseScene.selectedDifficultyIndex];

    const targetQuestionIndex = !levelData.randomizeQuestions 
      ? this.currentQuestionIndex 
      : randomNumArray[this.currentQuestionIndex];

    this.chosenQandA = levelData.questions[targetQuestionIndex];

    this.chosenQandA.correctAnswerIndex = this.chosenQandA.choices.findIndex(item => item.isCorrect === true);

    this.updateCurrentQuestionIndex();

  }

  updateAnswerTextAndImage(){

    for (let i = 0; i < this.answersCount; i++) {

      const textElement = this.answersTextArray[i];
      const imgElement = this.answersImgArray[i];
      
      if (this.chosenQandA.choices[i].textType === "text"){

        if(textElement.scale < 1){
          textElement.setScale(1);
        }

        if(imgElement.scale > 0){
          imgElement.setScale(0);
        }

        textElement.setText(this.chosenQandA.choices[i].text);

        textElement.setFontSize(this.answerTextDefaultFontSize);

        this.readjustTextBasedOnContainer(
          textElement,
          this.answerElementHeightLimit,
          parseFloat(textElement.style.fontSize),
          this.answerElementWidthLimit,
          .025
        )

      } else if (this.chosenQandA.choices[i].textType === "image") {

        if(imgElement.scale < 1){
          imgElement.setScale(1);
        }

        if(textElement.scale > 0){
          textElement.setScale(0);
        }

        imgElement.setTexture(this.extractFileName(this.chosenQandA.choices[i].text));

        imgElement.displayHeight = Math.min(imgElement.displayHeight, this.answerElementHeightLimit);
        imgElement.displayWidth = Math.min(imgElement.displayWidth, this.answerElementWidthLimit);

      } else {

        const textureKey = "expression_" + this.chosenQandA.choices[i].id;

        if(textElement.scale > 0){
          textElement.setScale(0);
        }

        const setImageTexture = () => {
          imgElement.setTexture(textureKey);
          imgElement.setScale(1);
        }

        setImageTexture();

      }

    }

  }

  updateCurrentQuestionIndex(){

    const questionsTotalCount = BaseScene.sortedQandA[BaseScene.selectedDifficultyIndex].questions.length;

    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % questionsTotalCount;

  }

  checkSelectedAnswer(selectedAnswerIndex){
    return this.chosenQandA.correctAnswerIndex === selectedAnswerIndex;
  }

  setBoardTextureBasedonAnswer(answerIndex, isCorrect){

    const children = this.QandAContainer.list;

    if (isCorrect){

      BaseScene.correctAnswerAudio.play();

      this.updateScore();

      children[answerIndex].setTexture('correct_board');

    } else {

        BaseScene.wrongAnswerAudio.play();

        children[answerIndex].setTexture('wrong_board');

    }

  }

  startGame(){

    this.QandAContainer.setVisible(true);

    this.setScaleUpAnswers();

  }

  async isGameOver(){

    this.setQATextandImagesVisibility(false);

    await this.setScaleDownAnswersBg(true, null);

    BaseScene.playSceneRef.ringTexture(0);

    this.QandAContainer.setVisible(false)

  }

  //Animation

  createBasketBallBoardAnimation(){

    this.anims.create({
      key: 'basketballBoard',
      frames: [
        { key: 'board_1' },
        { key: 'board_2' },
        { key: 'board_3' },
        { key: 'board_4' },
        { key: 'board_5' },
        { key: 'board_6' }
      ],
      frameRate: 3,
    });

    this.basketballBoardAnimation = 'basketballBoard';

  }

  fadeInBasketBallBoard(){

    this.answerBg1.playReverse(this.basketballBoardAnimation);

    this.answerBg2.playReverse(this.basketballBoardAnimation);

    this.answerBg3.playReverse(this.basketballBoardAnimation);

    this.answerBg4.playReverse(this.basketballBoardAnimation);

  }

  fadeOutBasketBallBoard(){

    this.answerBg1.play(this.basketballBoardAnimation);

    this.answerBg2.play(this.basketballBoardAnimation);

    this.answerBg3.play(this.basketballBoardAnimation);

    this.answerBg4.play(this.basketballBoardAnimation);

  }

  //Event Handler

  answerEventHandler = (answer) => {

    answer.on('pointerdown', () => {

      if (BaseScene.canAnswerQuestion){

        BaseScene.clickAudio.play();

        this.pauseTimer();

        this.setScaleDownAnswersBg(false, answer);

        this.setCanAnswerQuestion(false);

        this.setQATextandImagesVisibility(false);

      }
     
    });

  }

  resetCurrentQuestionIndex(){
    this.currentQuestionIndex = 0;
  }

  setQATextandImagesVisibility(isVisible){

    this.questionText.setVisible(isVisible);

    this.questionImg.setVisible(isVisible);

    for (let i = 0; i < this.answersCount; i++) {

      this.answersTextArray[i].setVisible(isVisible);

      this.answersImgArray[i].setVisible(isVisible);

    }

  }

  readjustTextBasedOnContainer(textReference, maxTextHeight, defaultFontSize, wordWrapWidth, reductionFactor){

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

  }

  async loadInitialQandAImages() {

    const getRandomQuestions = (qAndA, targetQuestionCount, difficultyIndex) => {

      const generatedRandomArray = randomNumsArray(qAndA.length);
    
      BaseScene.randomArrayPerLevel[difficultyIndex] = generatedRandomArray;
    
      return generatedRandomArray
        .slice(0, targetQuestionCount)
        .map(index => qAndA[index]);
      
    };

    for (const [difficultyIndex, { 
      questions: qAndA, 
      randomizeQuestions: isRandomQandA 
    }] of Object.entries(BaseScene.sortedQandA)) {

      const targetQuestionCount = Math.min(qAndA.length, 2);
  
      const targetQuestionArray = isRandomQandA
        ? getRandomQuestions(qAndA, targetQuestionCount, difficultyIndex)
        : qAndA.slice(0, targetQuestionCount);
  
      await this.loadImageArray(targetQuestionArray, { sync: true });
    }
  }

  loadRemainingQandAImages(){

    const difficultyLevel = Object.keys(BaseScene.sortedQandA);

    const randomQandA = (selectedDifficultyLevel, targetQuestionCount, qAndA) => {

      return BaseScene.randomArrayPerLevel[selectedDifficultyLevel]
        .slice(targetQuestionCount)
        .map(index => qAndA[index]);
    }

    const loadNextKey = (keyIndex) => {

      if (keyIndex >= difficultyLevel.length) {
        return;
      }

      const selectedDifficultyLevel = difficultyLevel[keyIndex];

      const { questions: qAndA, randomizeQuestions: isRandomQandA } = BaseScene.sortedQandA[selectedDifficultyLevel];

      const targetQuestionCount = Math.min(qAndA.length, 2);

      const targetQuestionArray = !isRandomQandA
        ? qAndA.slice(targetQuestionCount)
        : randomQandA(selectedDifficultyLevel, targetQuestionCount, qAndA);

      this.loadImageArray(targetQuestionArray, {}, () => {
        loadNextKey(keyIndex + 1);
      });

    };

    loadNextKey(0);

  }

  async loadImageArray(qandAData, options = { sync: false }, callback) {
    this.load.off('filecomplete', loadImage, this);
    this.load.off('loaderror', errorLoadImage, this);

    let imageIndex = 0;
    const imagePathArr = [];

    for (const data of qandAData) {
      if (data.textType === "image") {
        imagePathArr.push(data.text);
      }
      for (const choice of data.choices) {
        if (choice.textType === "image") {
          imagePathArr.push(choice.text);
        } else if (choice.textType === "expression") {
          const svgFile = await this.latexToSvg(choice.text);
  
          if (svgFile) {
            const textureKey = "expression_" + choice.id; // Ensure a unique texture key
            console.log("initial textureKey: ", textureKey);
            this.convertInlineSvgToPhaserTexture(
              svgFile,
              textureKey,
              this.answerElementWidthLimit,
              this.answerElementHeightLimit,
              .75
            );
          }
        }
      }
    }

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