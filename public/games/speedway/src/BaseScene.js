import Phaser from 'phaser';

import { scaleBasedOnResolution, 
  scaleBasedOnImageByPercent, 
  positionBasedOnResolution, 
  checkInternetConnection, 
  waitForInternetConnection
} from './Utils.js';

class BaseScene extends Phaser.Scene {

  static windowWidth = 0;

  static windowHeight = 0;

  static currentScore = 0;

  static seconds = 0;

  static milliseconds = 0;

  static totalMilliseconds = 0;

  static minutes = 0;

  static hours = 0;

  static targetScore = 0

  static selectedDifficultyIndex = 0;

  static isOnMenu = false;

  static timerInterval = null;

  static background = null;

  static playSceneRef = null;

  static questionSceneRef = null;

  static difficultyMenuContainer = null;

  static timerText = null;

  static scoreText = null;

  static serverData = {};

  static sortedQandA = {};

  static selectedQandA = [];

  static deviceHasInputTouch = false;

  static randomArrayPerLevel = [];

  static notificationBannerSceneRef = null;

  static fontFamilyStyle = null;

  static scoreFontSize = 0;

  //Audio

  static blockEndMoveAudio = null;

  static backgroundAudio = null;

  static correctAnswerAudio = null;

  static wrongAnswerAudio = null;

  static roadStripeAnimDuration = 0;

  constructor(key) {

    super(key);

  }

  create (){

    BaseScene.deviceHasInputTouch = this.sys.game.device.input.touch;

    BaseScene.windowWidth = this.scale.width;

    BaseScene.windowHeight = this.scale.height;

    BaseScene.fontFamilyStyle = 'GT Walsheim Pro, Sans-Serif, Times New Roman';

    BaseScene.roadStripeAnimDuration = 500;

    this.setAudio();

    //BaseScene.backgroundAudio.play();

    this.createGraphics();

    this.displayScoreText();

    this.displayTimer();

  }

  setAudio(){

    BaseScene.backgroundAudio = this.sound.add('backgroundAudio');

    BaseScene.backgroundAudio.setLoop(true);

    BaseScene.backgroundAudio.setVolume(.25);

    BaseScene.correctAnswerAudio = this.sound.add('correctAnswerAudio');

    BaseScene.wrongAnswerAudio = this.sound.add('wrongAnswerAudio');

    const playBgAudioEventHandler = () => {
      this.playBackgroundAudio('backgroundAudio');
      if (BaseScene.backgroundAudio.isPlaying){
        this.input.off('pointerdown', playBgAudioEventHandler); 
      }
      
    };
  
    this.input.on('pointerdown', playBgAudioEventHandler);

  }

  createGraphics() {

    if (BaseScene.background === null) {

      BaseScene.backGround = this.add
        .image(BaseScene.windowWidth / 2, BaseScene.windowHeight / 2, 'background')
        .setOrigin(.5);

      scaleBasedOnResolution(BaseScene.backGround, 1, 1);  

    }

  }

  setPlaySceneRef(reference){
    BaseScene.playSceneRef = reference;
  }

  setQuestionSceneRef(reference){
    BaseScene.questionSceneRef = reference;
  }

  //Menu

  displayDifficultyLevelMenu(){

    //Difficulty menu background

    BaseScene.difficultyMenuContainer = this.add.container(BaseScene.windowWidth / 2, BaseScene.windowHeight / 2);

    const difficultyMenu = this.add
      .image(0, 0, 'difficulty_menu')
      .setOrigin(.5);

    scaleBasedOnResolution(difficultyMenu, .3, .6);  

    BaseScene.difficultyMenuContainer.add(difficultyMenu);

    const difficultyMenuBounds = difficultyMenu.getBounds();

    const difficultyMenuTopCenter = difficultyMenu.getTopCenter();

    const difficultyMenuHeight = difficultyMenu.displayHeight;

    const buttonVerticalSpaceBetweenButton = difficultyMenuHeight * .16;

    //Easy Button

    const easyButtonPositionX = difficultyMenuTopCenter.x;

    const easyButtonPositionY = difficultyMenuTopCenter.y + (difficultyMenuHeight * .33);

    const easyButton = this.add
      .image(0, 0, 'easy_btn')
      .setOrigin(.5);

    easyButton.difficultyLevel = "Easy";

    easyButton.difficultyIndex = 1;

    easyButton.setInteractive();

    this.difficultyLevelMenuButtonEventHandler(easyButton);

    scaleBasedOnImageByPercent(difficultyMenuBounds, easyButton, .45, .127);

    easyButton.setPosition(easyButtonPositionX, easyButtonPositionY);

    BaseScene.difficultyMenuContainer.add(easyButton);

    //Average Button

    const avgButtonPositionX = difficultyMenuTopCenter.x;

    const avgButtonPositionY = easyButton.getBottomCenter().y + buttonVerticalSpaceBetweenButton;

    const averageButton = this.add
      .image(0, 0, 'average_btn')
      .setOrigin(.5);

    averageButton.difficultyLevel = "Average";

    averageButton.difficultyIndex = 2;

    averageButton.setInteractive();

    this.difficultyLevelMenuButtonEventHandler(averageButton);

    scaleBasedOnImageByPercent(difficultyMenuBounds, averageButton, .45, .127);

    averageButton.setPosition(avgButtonPositionX, avgButtonPositionY);

    BaseScene.difficultyMenuContainer.add(averageButton);

    //Hard Button
      
    const hardButtonPositionX = difficultyMenuTopCenter.x;

    const hardButtonPositionY = averageButton.getBottomCenter().y + buttonVerticalSpaceBetweenButton;

    const hardButton = this.add
      .image(0, 0, 'hard_btn')
      .setOrigin(.5);

    hardButton.difficultyLevel = "Hard";

    hardButton.difficultyIndex = 3;

    hardButton.setInteractive();

    this.difficultyLevelMenuButtonEventHandler(hardButton);

    scaleBasedOnImageByPercent(difficultyMenuBounds, hardButton, .45, .127);

    hardButton.setPosition(hardButtonPositionX, hardButtonPositionY);

    BaseScene.difficultyMenuContainer.add(hardButton);

  }

  difficultyLevelMenuButtonEventHandler(button){

    button.on('pointerdown', () => {   

      //this.setLevelData(button.difficultyIndex);

      BaseScene.questionSceneRef.loadRemainingQandAImages(button.difficultyIndex);

      this.setDifficultyMenuVisibility(false);

      const isTargetScoreReach = this.isTargetScoreReach();

      setTimeout(() => {

        this.setLevelData(button.difficultyIndex); //update target score and difficulty index

        if (isTargetScoreReach){

          this.resetSelectedQandA();

          this.updateScoreText(true);

          this.resetTimer();

          BaseScene.questionSceneRef.resetHolderPosition();

          BaseScene.questionSceneRef.setQandAElementsVisibility(true);

        } else {

          //initial question
          BaseScene.questionSceneRef.displayInitialQuestion();

          this.startTimer();

        }
       
      }, 500);

    });

  }

  isTargetScoreReach(){
    return BaseScene.currentScore === BaseScene.targetScore;
  }

  setDifficultyMenuVisibility(isVisible){

    BaseScene.isOnMenu = isVisible;

    BaseScene.difficultyMenuContainer.setVisible(isVisible);

  }

  //Score

  displayScoreText(){

    BaseScene.scoreFontSize = BaseScene.windowHeight * .05;

    const scorePosition = positionBasedOnResolution(.01, .04);

    BaseScene.scoreText = this.add.text(scorePosition.xPosition, scorePosition.yPosition, "Points: "  + BaseScene.currentScore, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: BaseScene.scoreFontSize,
      fill: '#000',
      fontStyle: "bold"
    });

    BaseScene.scoreText.setOrigin(0);

  }
  
  updateScoreText(isReset){

    BaseScene.currentScore = !isReset ? BaseScene.currentScore + 1 : 0;

    BaseScene.scoreText.text = "Points: "  + BaseScene.currentScore;

  }

  updateTargetScore(value){
    BaseScene.targetScore = value;
  }

  //Timer
  displayTimer(){

    const scoreTextMainPosition = BaseScene.scoreText.getBottomLeft();

    const scoreTextPositionY = scoreTextMainPosition.y;

    const scoreTextPositionX = scoreTextMainPosition.x;

    const timer = "Time: 00:00:00";

    BaseScene.timerText = this.add.text(scoreTextPositionX, scoreTextPositionY, timer, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: BaseScene.scoreFontSize * .85,
      fill: '#000',
    });

    BaseScene.timerText.setOrigin(0);

  }

  updateTimer(){

    // Update the timer
    BaseScene.milliseconds += 10;
    BaseScene.totalMilliseconds += 10;

    if (BaseScene.milliseconds === 1000) {
      BaseScene.milliseconds = 0;
      BaseScene.seconds++;
    }

    if (BaseScene.seconds === 60) {
      BaseScene.seconds = 0;
      BaseScene.minutes++;
    }

    if (BaseScene.minutes === 60) {
      BaseScene.minutes = 0;
      BaseScene.hours++;
    }

    // Format the timer values
    const hoursString = BaseScene.hours.toString().padStart(2, '0');
    const minutesString = BaseScene.minutes.toString().padStart(2, '0');
    const secondsString = BaseScene.seconds.toString().padStart(2, '0');
    const milliSecondsString = Math.floor(BaseScene.milliseconds / 10)
      .toString()
      .padStart(2, '0');

    // Update the timer text
    BaseScene.timerText.text = `Time: ${hoursString}:${minutesString}:${secondsString}:${milliSecondsString}`;

  }

  startTimer() {

    if (BaseScene.timerInterval === null) {
      BaseScene.timerInterval = setInterval(() => this.updateTimer(), 10);
    }
    
  }

  pauseTimer() {

    if (BaseScene.timerInterval !== null) {

      clearInterval(BaseScene.timerInterval);

      BaseScene.timerInterval = null;

    }
  }

  resetTimer() {

    BaseScene.seconds = 0;

    BaseScene.milliseconds = 0;

    BaseScene.timerText.innerText = "Time: 00:00:00"; 

  }

  checkInternetConnectionBanner = async () => {

    if (!await checkInternetConnection()) {

      BaseScene.notificationBannerSceneRef.displayBanner(true, "Kindly check your internet connection");

      await waitForInternetConnection();

      BaseScene.notificationBannerSceneRef.displayBanner();

    }

  }

  addSelectedQandA(questionId, selectedQuestionChoiceId){

    BaseScene.selectedQandA.push({
      questionId,
      selectedQuestionChoiceId
    });

  }

  resetSelectedQandA(){
    BaseScene.selectedQandA = [];
  }

  playBackgroundAudio(key) {

    if (
      this.cache.audio.has(key) &&
      BaseScene.backgroundAudio &&
      !BaseScene.backgroundAudio.isPlaying
    ) {
      BaseScene.backgroundAudio.play();
    }
  
  }

  //Data
  setServerData(data){
    BaseScene.serverData = data;
  }

  setSortedQandA(){

    const gameDifficultyLevel = BaseScene.serverData.categories
      .filter(item => item.hasOwnProperty('level'));

    gameDifficultyLevel.forEach(item => {
      const levelKey = item.level;
      BaseScene.sortedQandA[levelKey] = {
        questions: item.questions.sort((a, b) => a.orderNumber - b.orderNumber),
        randomizeQuestions: item.randomizeQuestions,
        typePoint: item.typePoint
      };
    });
    
  }

  //reference
  setNotificationBannerSceneRef(reference){
    BaseScene.notificationBannerSceneRef = reference;
  }

  setLevelData(difficultyIndex){

    BaseScene.selectedDifficultyIndex = difficultyIndex;

    BaseScene.questionSceneRef.resetCurrentQuestionIndex();

    const correctAnswerCount = BaseScene.serverData.categories
      .filter(item => item.level === difficultyIndex)[0]
      .typeTime
      .correctAnswerCount;

    this.updateTargetScore(correctAnswerCount);

  }
  
}

export default BaseScene;