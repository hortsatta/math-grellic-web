import BaseScene from './BaseScene';

import { 
  scaleBasedOnAbsoluteValue, 
  scaleBasedOnResolution, 
  positionBasedOnResolution,
  checkIfSingleWord
} from './Utils.js';

import { holder2ndPosInfo } from './PositionsInfo';

import { randomNumsArray } from './GameHelpers.js';

import { getQuestionImageUrl } from './api/instance.api.js';

import { updateActivityCategoryCompletionBySlugAndCurrentStudentUser } from './api/data.api';

class QuestionScene extends BaseScene 
{
  constructor() {

    super('QuestionScene');

    this.randomNumArray = [];

    this.currentQandA = {};

    this.xInitialStartPoint = 48.28; 

    this.xInitialEndPoint = 58.8; 

    //road

    this.roadBounds = {};
    
    this.roadAnim = null;

    //Question
    this.questionTextDefaultFontPercentage = .15;

    this.questionElementWidthLimitPercentage = .85;

    this.questionElementHeightLimitPercentage = .85;

    this.questionElementHeightLimit = 0;

    this.questionElementWidthLimit = 0;

    this.questionTextFontSize = 0;

    this.currentQuestionIndex = 0;

    this.questionBG = null;

    this.questionBgBounds = {};

    this.questionText = null;

    this.questionImg = null;

    //Answer

    this.containerInitialHeight = 0;

    this.containerInitialPositionX = 0;

    this.roadTopStartPointY = 0;

    this.totalInBetweenSpace = 0;

    this.holderInitialLength = 0

    this.inBetweenSpace = 0;

    this.answerHolderWidth = 0;

    this.answerElementWidthPercentage = .85;

    this.answerElementHeightPercentage = .85;

    this.answerHeightLimit = 0;

    this.answerWidthLimit = 0;

    this.answerFontSize = 0;

    this.holderPositioned = false;

    this.answerContainer = null;

    this.answersTextArr = [];

    this.answersImgArr = [];

    this.answersElementsArr = [];

    //Answer second holder properties
    this.answerContainerStartingCoordinate = 0;

    this.answerContainerTargetWidth = 0;

    this.answerContainerTargetHeight = 0;

    this.answerContainerTargetScaleX = 0;

    this.answerContainerTargetScaleY = 0;

    this.answerCount = 4;
    
  }

  async create() {

    this.setQuestionSceneRef(this);

    this.setAnswerContainerStartingCoordinate();

    this.setAnswerContainerTargetWidth();
    
    this.createQandABgGraphics();

    this.secondAnswerContainerProperties();

    this.createQandATextAndImage();

    BaseScene.playSceneRef.setInitialCarPosition();

    await this.loadInitialQandAImages();

    BaseScene.playSceneRef.displayMenuandCarProperties();

  }

  displayInitialQuestion(){ 

    this.displayQandABgGraphics();

    this.updateQandAData();

    this.updateQandATextAndImage();

    this.holderSecondPosition();

  }

  createQandABgGraphics(){

    //Question
    const questionBGPosition = positionBasedOnResolution(.5, .03);

    this.questionBG = this.add
      .image(questionBGPosition.xPosition, questionBGPosition.yPosition, 'question_bg')
      .setOrigin(.5, 0)
      .setVisible(false);

    scaleBasedOnResolution(this.questionBG, .5, .4);

    const setAnswerBg = () => {

      const roadTopStartPointX = BaseScene.playSceneRef.roadCoordsArr[BaseScene.playSceneRef.roadIndex].x4;
      const roadTopEndPointX = BaseScene.playSceneRef.roadCoordsArr[BaseScene.playSceneRef.roadIndex].x3;
      this.roadTopStartPointY = BaseScene.playSceneRef.roadCoordsArr[BaseScene.playSceneRef.roadIndex].y4;
      const answerContainerTotalWidth = roadTopEndPointX - roadTopStartPointX;

      const { individualLength, individualSpace } = this.getIndividualProperties(answerContainerTotalWidth, .025);

      const individualHeight = answerContainerTotalWidth * .05;

      this.answerContainer = this.add.container(roadTopStartPointX, this.roadTopStartPointY);

      const answerHolder1 = this.add
        .image(0, 0, 'answer_bg')
        .setOrigin(0, 1);

      scaleBasedOnAbsoluteValue(
        answerHolder1,
        individualLength,
        individualHeight
      );

      const holder2Bounds = answerHolder1.getBounds();
      const holder2Xposition = holder2Bounds.right + individualSpace

      this.answerContainer.addAt(answerHolder1, 0);

      const answerHolder2 = this.add
        .image(holder2Xposition, 0, 'answer_bg')
        .setOrigin(0, 1);

      scaleBasedOnAbsoluteValue(
        answerHolder2,
        individualLength,
        individualHeight
      );

      const holder3Bounds = answerHolder2.getBounds();
      const holder3Xposition = holder3Bounds.right + individualSpace;

      this.answerContainer.addAt(answerHolder2, 1);

      const answerHolder3 = this.add
        .image(holder3Xposition, 0, 'answer_bg')
        .setOrigin(0, 1);

      scaleBasedOnAbsoluteValue(
        answerHolder3,
        individualLength,
        individualHeight
      );

      const holder4Bounds = answerHolder3.getBounds();
      const holder4Xposition = holder4Bounds.right + individualSpace;

      this.answerContainer.addAt(answerHolder3, 2);

      const answerHolder4 = this.add
        .image(holder4Xposition, 0, 'answer_bg')
        .setOrigin(0, 1);

      scaleBasedOnAbsoluteValue(
        answerHolder4,
        individualLength,
        individualHeight
      );

      this.answerContainer.addAt(answerHolder4, 3);

      this.containerInitialHeight = this.answerContainer.getBounds().height;

      this.answerContainer.setVisible(false);

    }

    setAnswerBg();

  }

  createQandATextAndImage(){

    const setQuestionTextAndImage = () => {

      const questionBGCenter = this.questionBG.getCenter();

      this.questionBgBounds = this.questionBG.getBounds();

      this.questionTextFontSize = this.questionBgBounds.height * this.questionTextDefaultFontPercentage;

      this.questionElementHeightLimit = this.questionBgBounds.height * this.questionElementHeightLimitPercentage;
      this.questionElementWidthLimit = this.questionBgBounds.width * this.questionElementWidthLimitPercentage;

      this.questionText = this.add.text(questionBGCenter.x, questionBGCenter.y, "", {
        fontFamily: BaseScene.fontFamilyStyle,
        fontSize: this.questionTextFontSize,
        fill: '#000',
        wordWrap: { useAdvancedWrap: true, width: this.questionElementWidthLimit},
      });

      this.questionText.setOrigin(.5);

      this.questionText.setScale(0);

      this.questionImg = this.add
        .image(0, 0, "placeholder")
        .setOrigin(.5)
        .setScale(0);

    }

    const setAnswerTextAndImage = () => {

      const answerFontSize = (this.answerContainerTargetWidth / 4) * .88;

      const initialAnswerFontSize = this.containerInitialHeight * .3;

      for (let i = 0; i < this.answerCount; i++) {

        const answerHolderBound = this.answerContainer.getAt(i).getBounds();

        const positionX = answerHolderBound.x + answerHolderBound.width / 2;
        const positionY = answerHolderBound.y + answerHolderBound.height / 2;

        const answerText = this.add.text(positionX, positionY, "", {
          fontFamily: BaseScene.fontFamilyStyle,
          fontSize: initialAnswerFontSize,
          fill: '#000',
          wordWrap: { useAdvancedWrap: true, width: answerFontSize }
        });

        answerText.setOrigin(.5);

        answerText.setScale(0);

        answerText.setDepth(this.answerContainer.getAt(i).depth + 1);

        this.answersTextArr.push(answerText);

        //image
        const answerImg = this.add
          .image(positionX, positionY, "placeholder")
          .setOrigin(.5)
          .setScale(0);

        this.answersImgArr.push(answerImg);

      }

    }

    const setAnswerProperties = () => {

      const targetInbetweenSpace = this.answerContainerTargetScaleX * this.inBetweenSpace;
      this.answerHolderWidth = (this.answerContainerTargetWidth - targetInbetweenSpace) / 4;
  
      this.answerFontSize = this.answerContainerTargetHeight * .3;
  
      this.answerHeightLimit = this.answerContainerTargetHeight * this.answerElementHeightPercentage;
      this.answerWidthLimit = this.answerHolderWidth * this.answerElementWidthPercentage;

      console.log("this.answerWidthLimit: ", this.answerWidthLimit);

    }

    setQuestionTextAndImage();
    setAnswerTextAndImage();
    setAnswerProperties();

  }

  updateQandAData(){

    const levelData = BaseScene.sortedQandA[BaseScene.selectedDifficultyIndex];

    const randomNumArray = BaseScene.randomArrayPerLevel[BaseScene.selectedDifficultyIndex];

    const targetQuestionIndex = !levelData.randomizeQuestions 
      ? this.currentQuestionIndex 
      : randomNumArray[this.currentQuestionIndex];

    this.chosenQandA = levelData.questions[targetQuestionIndex];

    this.chosenQandA.correctAnswerIndex = this.chosenQandA.choices.findIndex(item => item.isCorrect === true);

    this.currentQuestionIndex = (this.currentQuestionIndex < levelData.questions.length - 1) 
      ? this.currentQuestionIndex += 1
      : 0;

  }

  updateQandATextAndImage(){

    const setQuestionTextAndImage = () => {

      if(this.chosenQandA.textType === "text"){

        if (this.questionText.scale === 0){
          this.questionText.setScale(1);
        }
  
        if (this.questionImg.scale === 1){
          this.questionImg.setScale(0);
        }

        this.questionText.text = this.chosenQandA.text
  
        this.questionText.setFontSize(this.questionTextFontSize);
  
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
  
        this.questionImg.x = this.questionBgBounds.x + (this.questionBgBounds.width / 2);
        this.questionImg.y = this.questionBgBounds.y + (this.questionBgBounds.height / 2);
      
      }

    }

    const setAnswerTextAndImage = async() => {

      this.answersElementsArr = [];

      for (let i = 0; i < this.answerCount; i++) {

        const textElement = this.answersTextArr[i];
        const imgElement = this.answersImgArr[i];
  
        if (this.chosenQandA.choices[i].textType === "text"){
  
          if(this.answersImgArr[i].scale > 0){
            this.answersImgArr[i].setScale(0);
          }
  
          textElement.setScale(1);
  
          textElement.setText(this.chosenQandA.choices[i].text);
    
          textElement.setFontSize(this.answerFontSize);
    
          this.readjustTextBasedOnContainer(
            textElement,
            this.answerHeightLimit,
            parseFloat(textElement.style.fontSize),
            this.answerWidthLimit,
            .025
          )

          textElement.elementHeightPercentage = textElement.displayHeight / this.answerContainerTargetHeight;
          textElement.elementWidthPercentage = textElement.displayWidth / this.answerHolderWidth;
  
          this.answersElementsArr.push(textElement);
  
        } else if (this.chosenQandA.choices[i].textType === "image"){
  
          if(this.answersTextArr[i].scale > 0){
            this.answersTextArr[i].setScale(0);
          }
  
          if(imgElement.scale === 0){
            imgElement.setScale(1);
          }
  
          const fileName = this.extractFileName(this.chosenQandA.choices[i].text);
  
          imgElement.setTexture(fileName);
  
          imgElement.displayHeight = Math.min(imgElement.displayHeight, this.answerHeightLimit);
          imgElement.displayWidth = Math.min(imgElement.displayWidth, this.answerWidthLimit);

          imgElement.elementHeightPercentage = imgElement.displayHeight / this.answerContainerTargetHeight;
          imgElement.elementWidthPercentage = imgElement.displayWidth / this.answerHolderWidth;
  
          this.answersElementsArr.push(imgElement);
  
        } else {
  
          const textureKey = "expression_" + this.chosenQandA.choices[i].id;

          if(textElement.scale > 0){
            textElement.setScale(0);
          }

          const setImageTexture = () => {
            imgElement.setTexture(textureKey);
            imgElement.setScale(1);
            imgElement.elementHeightPercentage = imgElement.displayHeight / this.answerContainerTargetHeight;
            imgElement.elementWidthPercentage = imgElement.displayWidth / this.answerHolderWidth;
            this.answersElementsArr.push(imgElement);
          }

          setImageTexture();
  
        }
  
      }

    }

    setQuestionTextAndImage();
    setAnswerTextAndImage();

    this.adjustAllTextProperties();

  }
  
  displayQandABgGraphics(){

    this.questionBG.setVisible(true);

    this.answerContainer.setVisible(true);

  }

  updateInitialContainerPositionX(){
    this.containerInitialPositionX = BaseScene.playSceneRef.roadCoordsArr[BaseScene.playSceneRef.roadIndex].x4;
  }

  secondAnswerContainerProperties(){

    this.answerContainerTargetScaleX = this.answerContainerTargetWidth / this.answerContainer.getBounds().width;

    const targetHeightFactor = .63;

    const carTopBound = BaseScene.playSceneRef.car.getBounds().top;
    const questionBgBottomBound = this.questionBG.getBounds().bottom;
    this.answerContainerTargetHeight = (carTopBound - questionBgBottomBound) * targetHeightFactor; 
    this.answerContainerPositionY = ((questionBgBottomBound + carTopBound) / 2) + (this.answerContainerTargetHeight / 2);

    this.answerContainerTargetScaleY = this.answerContainerTargetHeight / this.containerInitialHeight;

  }

  setAnswerContainerStartingCoordinate(){
    this.answerContainerStartingCoordinate = BaseScene.windowWidth * holder2ndPosInfo[BaseScene.playSceneRef.roadIndex].startPoint;
  }

  setAnswerContainerTargetWidth(){
    this.answerContainerTargetWidth = BaseScene.windowWidth - this.answerContainerStartingCoordinate;
  }

  holderSecondPosition(){

    const tweenDuration = 2000;

    this.setAnswerContainerStartingCoordinate();

    let initialAnswerContainerHeight = this.answerContainer.getAt(0).getBounds().height;

    this.tweens.add({
      targets: this.answerContainer,
      x: this.answerContainerStartingCoordinate,
      y: this.answerContainerPositionY,
      scaleX: this.answerContainerTargetScaleX,
      scaleY: this.answerContainerTargetScaleY,
      duration: tweenDuration,
      ease: 'Linear',
      onUpdate: (tween) => {

        if(this.answerContainer.getAt(0).getBounds().height != initialAnswerContainerHeight){

          this.adjustAllTextProperties();

          initialAnswerContainerHeight = this.answerContainer.getAt(2).getBounds().height;

        }      

      },
      onComplete: () => {
        this.setholderSecondPositionDone(true);
      }
    });

  }
  
  holderLastPosition(roadLaneIndex, isGameOver){

    this.pauseTimer();

    this.setholderSecondPositionDone(false);

    //answer container initial scale
    const initialScaleX = this.answerContainer.scaleX;
    const initialScaleY = this.answerContainer.scaleY;

    //target container properties
    const targetContainerHeightFactor = 3.6;

    const targetPositionYFactor = 2;

    const widthToScaleFactor = 7;

    const roadLaneIndexPercent = 0.125 + 0.25 * roadLaneIndex;

    const targetPositionY = BaseScene.windowHeight * targetPositionYFactor;

    const targetContainerHeight = this.answerContainer.getBounds().height * targetContainerHeightFactor;

    const widthToScale = BaseScene.windowWidth * widthToScaleFactor / this.answerContainer.getBounds().width;
    const heightToScale = targetContainerHeight / this.answerContainer.getBounds().height;

    const targetScaleX = initialScaleX * widthToScale;
    const targetScaleY = initialScaleY * heightToScale;

    const tweenDuration = 2000;

    const tween = this.tweens.add({
      targets: this.answerContainer,
      y: targetPositionY,
      scaleX: targetScaleX,
      scaleY: targetScaleY,
      duration: tweenDuration,
      ease: 'Linear',
      onUpdate: () => {

        const containerBounds = this.answerContainer.getBounds();

        if(containerBounds.top > BaseScene.windowHeight){

          if (tween.isPlaying()) {

            tween.stop();

          }else {

            if(!isGameOver){

              setTimeout(() => {
                this.resetHolderPosition();
              }, 1000);

            } else {

              updateActivityCategoryCompletionBySlugAndCurrentStudentUser(
                BaseScene.selectedQandA,
                BaseScene.totalMilliseconds,
                BaseScene.serverData.categories[0].id
              );

              this.setDifficultyMenuVisibility(true);
    
              this.setQandAElementsVisibility(false);

            }

          }    

        } else {
          
          const targetLaneDistance = this.answerContainer.getBounds().width * roadLaneIndexPercent;
          this.answerContainer.x = BaseScene.playSceneRef.car.x - targetLaneDistance;

          this.adjustAllTextProperties();

        }
      }
    });

  }

  getIndividualProperties(answerContainerTotalWidth, totalInbetweenSpacePercentage){

    const spaceDivisor = 3;

    const placeHolderDivisor = 4;

    const totalinbetweenSpace = answerContainerTotalWidth * totalInbetweenSpacePercentage;
    const individualLength = (answerContainerTotalWidth - totalinbetweenSpace) / placeHolderDivisor;
    const individualSpace = totalinbetweenSpace / spaceDivisor;

    return {
      individualLength,
      individualSpace
    }


  }

  deductFontSizeBasedOnLength(maxCharacter, basefont, length){

    let result = 0;

    if (length > maxCharacter){
      const excessCharacter = length - maxCharacter;
      result = excessCharacter / 100;
    }

    return basefont - result;

  }

  resetHolderPosition(){

    this.resetAnswerTextColor();

    this.updateQandAData();

    this.updateQandATextAndImage();

    this.startTimer();

    this.answerContainer.setScale(1, 1);

    this.updateInitialContainerPositionX();

    this.answerContainer.setPosition(this.containerInitialPositionX, this.roadTopStartPointY);

    this.setQandAElementsVisibility(true);

    setTimeout(() => {
      this.holderSecondPosition();
    }, 200);

  }

  checkifAnswerIsCorrect(index){

    this.addSelectedQandA(
      this.chosenQandA.id, 
      this.chosenQandA.choices[index].id
    );

    if (index === this.chosenQandA.correctAnswerIndex){

      BaseScene.correctAnswerAudio.play();

      this.answersTextArr[index].setFill('#008000');

      this.updateScoreText(false);

    } else{

      BaseScene.wrongAnswerAudio.play();

      this.answersTextArr[index].setFill('#FF0000');

      return false;

    } 

  }

  isGamePlayable(index){

    if(!this.isTargetScoreReach()){
      this.holderLastPosition(index);
    } else {
      this.holderLastPosition(index, true);
    }

  }

  setRandomNumArray(length){
    this.randomNumArray = randomNumsArray(length);
  }

  resetAnswerTextColor(){

    this.answersTextArr.forEach(data => 
      data.setFill('#000')
    );

  }

  setQandAElementsVisibility(isVisible){

    this.answerContainer.setVisible(isVisible);

    this.questionBG.setVisible(isVisible);

    this.questionText.setVisible(isVisible);

    this.questionImg.setVisible(isVisible);

  }

  moveContainerSideways(index){

    const targetCoordinate = BaseScene.windowWidth * holder2ndPosInfo[index].startPoint;

    this.tweens.add({
      targets: this.answerContainer,
      x: targetCoordinate,
      duration: BaseScene.roadStripeAnimDuration,
      ease: 'Linear',
      onUpdate: (tween) => {

        for (let i = 0; i < this.answerCount; i++) {
          this.adjustAnswerElementsPosition(i);
        }  
      }
    });

  };

  adjustAllTextProperties(){

    const adjustAnswerElementScale = (index) => {
      
      const containerHeight = this.answerContainer.getAt(index).getBounds().height;
      const containerWidth = this.answerContainer.getAt(index).getBounds().width;

      if (this.answersElementsArr[index]){

        this.answersElementsArr[index].displayHeight = containerHeight * this.answersElementsArr[index].elementHeightPercentage;
        this.answersElementsArr[index].displayWidth = containerWidth * this.answersElementsArr[index].elementWidthPercentage;

      }

    };

    for (let i = 0; i < this.answerCount; i++) {

      //scale
      adjustAnswerElementScale(i);

      //position
      this.adjustAnswerElementsPosition(i);

    }

  }

  adjustAnswerElementsPosition(index){

    const holderBound = this.answerContainer.getAt(index).getBounds();

    const positionX = holderBound.x + holderBound.width / 2; 
    const positionY = holderBound.y + holderBound.height / 2;

    if (this.answersElementsArr[index]){
      this.answersElementsArr[index].setX(positionX);
      this.answersElementsArr[index].setY(positionY);
    }

  }

  setholderSecondPositionDone(bool){
    this.holderPositioned = bool;
  }

  resetCurrentQuestionIndex(){
    this.currentQuestionIndex = 0;
  }

  isHolderContainerNotNull(){
    return this.answerContainer !== null;
  }

  readjustTextBasedOnContainer(textReference, maxTextHeight, defaultFontSize, wordWrapWidth, reductionFactor){

    const fontResizeCount = .95 / reductionFactor; //.95 for 5% minimum font size

    const isSingleWord = checkIfSingleWord(textReference.text.trim());

    if (isSingleWord){
      textReference.setWordWrapWidth(wordWrapWidth, false);
    }

    let textBounds = textReference.getBounds();

    let currentElementDimension = !isSingleWord 
      ? textBounds.height
      : textBounds.width;

    const maxElementDimension = !isSingleWord 
      ? maxTextHeight
      : wordWrapWidth;

    if (currentElementDimension > maxElementDimension){

      for (let i = 1; i < fontResizeCount; i++) {
  
        const fontSizeReduction = defaultFontSize * (i * reductionFactor);
        const textFontSize = defaultFontSize - fontSizeReduction;

        textReference.setFontSize(textFontSize);

        if (!isSingleWord){
          textReference.setWordWrapWidth(wordWrapWidth, true);
        }

        textBounds = textReference.getBounds();

        currentElementDimension = !isSingleWord 
          ? textBounds.height
          : textBounds.width;

        if (currentElementDimension < maxElementDimension){
          break;
        } else if(isSingleWord && textFontSize < maxTextHeight * .20){

          textReference.setWordWrapWidth(wordWrapWidth, true);

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

  loadRemainingQandAImages(selectedDifficultyIndex) {
  
    const difficultyLevels = Object.keys(BaseScene.sortedQandA);
  
    const getRandomQuestions = (level, count, qAndA) => {
      return BaseScene.randomArrayPerLevel[level]
        .slice(count)
        .map(index => qAndA[index]);
    };
  
    const loadNextKey = (currentIndex, processedIndices = new Set()) => {
      if (processedIndices.size >= difficultyLevels.length) return;
  
      const adjustedIndex = currentIndex % difficultyLevels.length;
  
      const selectedDifficultyLevel = difficultyLevels[adjustedIndex];
      const { questions: qAndA, randomizeQuestions: isRandomQandA } = BaseScene.sortedQandA[selectedDifficultyLevel];
  
      const targetQuestionCount = Math.min(qAndA.length, 2);
      const targetQuestionArray = isRandomQandA
        ? getRandomQuestions(selectedDifficultyLevel, targetQuestionCount, qAndA)
        : qAndA.slice(targetQuestionCount);
  
      processedIndices.add(adjustedIndex);
  
      this.loadImageArray(targetQuestionArray, {}, () => {
        loadNextKey(adjustedIndex + 1, processedIndices);
      });
    };
  
    loadNextKey(selectedDifficultyIndex - 1);
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
            const textureKey = "expression_" + choice.id;
            this.convertInlineSvgToPhaserTexture(
              svgFile,
              textureKey,
              this.answerHolderWidth,
              this.answerContainerTargetHeight,
              .8
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
        targetHeight *= 1.2; //increase height a little
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