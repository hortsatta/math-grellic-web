import Phaser from 'phaser';

import { scaleBasedOnResolution, positionBasedOnResolution, scaleBasedOnImage } from './Utils.js';

import { checkInternetConnection, waitForInternetConnection } from './Utils.js';

class BaseScene extends Phaser.Scene {

  static background = null;

  static ball = null;

  static backgroundScene = null;

  static playSceneRef = null;

  static questionSceneRef = null;

  static scalingTweenDuration = 2000;

  static targetBackgroundScaleX = 2.5;

  static targetBackgroundScaleY = 2.5;

  static backgroundInitialScaleX = 0;

  static backgroundInitialScaleY = 0;

  static initialAnswerContainerScale = {};

  static windowWidth = 0;

  static windowHeight = 0;

  static canAnswerQuestion = false;

  static currentScore = 0;

  static seconds = 0;

  static milliseconds = 0;

  static pointFactor = 0;

  static zoomBackground = null;

  static timerInterval = null;

  static timerText = null;

  static scoreText = null;

  static difficultyMenuContainer = null;

  static serverData = {};

  static sortedQandA = {};

  static randomArrayPerLevel = {};

  static selectedDifficultyIndex = 0;

  static selectedQandA = [];

  static fontFamilyStyle = null;

  //audio

  static backgroundAudio = null;

  static ballShotAudio = null;

  static wrongAnswerAudio = null;

  static correctAnswerAudio = null;

  static clickAudio = null;

  //server

  constructor(key) {
    super(key);
  }

  create(){

    BaseScene.windowWidth = this.scale.width;
    BaseScene.windowHeight = this.scale.height;

    BaseScene.fontFamilyStyle = 'GT Walsheim Pro, Sans-Serif, Times New Roman';

    this.setAudio();

    this.scene.launch('BackgroundScene');

    this.displayScoreText();

    this.displayTimerText();

  }

  setAudio(){

    BaseScene.backgroundAudio = this.sound.add('backgroundAudio');

    BaseScene.clickAudio = this.sound.add('clickAudio');

    BaseScene.wrongAnswerAudio = this.sound.add('wrongAnswerAudio');

    BaseScene.correctAnswerAudio = this.sound.add('correctAnswerAudio');

    BaseScene.ballShotAudio = this.sound.add('ballShotAudio');

    BaseScene.backgroundAudio.setLoop(true);

    BaseScene.backgroundAudio.setVolume(.065);

    BaseScene.wrongAnswerAudio.setVolume(.35);

    BaseScene.correctAnswerAudio.setVolume(.3);

    const playBgAudioEventHandler = () => {

      this.playBackgroundAudio('backgroundAudio');
      if (BaseScene.backgroundAudio.isPlaying){
        this.input.off('pointerdown', playBgAudioEventHandler); 
      }
      
    };
  
    this.input.on('pointerdown', playBgAudioEventHandler);

  }

  checkInternetConnectionBanner = async () => {

    if (!await checkInternetConnection()) {

      BaseScene.notificationBannerSceneRef.displayBanner(true, "Kindly check your internet connection");

      await waitForInternetConnection();

      BaseScene.notificationBannerSceneRef.displayBanner();

    }

  }

  //reference
  setBackgroundSceneRef(reference){
    BaseScene.backgroundScene = reference;
  }

  setPlaySceneRef(reference){
    BaseScene.playSceneRef = reference;
  }

  setQuestionSceneRef(reference){
    BaseScene.questionSceneRef = reference;
  }

  setNotificationBannerSceneRef(reference){
    BaseScene.notificationBannerSceneRef = reference;
  }

  setInitialAnswerContainerScale(scale){

    BaseScene.initialAnswerContainerScale.x = scale.x;
    BaseScene.initialAnswerContainerScale.y = scale.y;
    
  }

  setCanAnswerQuestion(value){
    BaseScene.canAnswerQuestion = value;
  }

  setZoomBackgroundInitialScale(){
    
    BaseScene.backgroundInitialScaleX = BaseScene.backgroundScene.background.scaleX;
    BaseScene.backgroundInitialScaleY = BaseScene.backgroundScene.background.scaleY;

  }

  setZoomBackgroundAnimation(){
    BaseScene.zoomBackground = this.tweens.add({
      targets: BaseScene.backgroundScene.background,
      scaleX: BaseScene.backgroundInitialScaleX * BaseScene.targetBackgroundScaleX,
      scaleY: BaseScene.backgroundInitialScaleY * BaseScene.targetBackgroundScaleY,
      duration: BaseScene.scalingTweenDuration,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      paused: true,
      onYoyo: () =>{
        BaseScene.zoomBackground.pause();
        BaseScene.questionSceneRef.setCanAnswerQuestion(true);
      },
      onRepeat: () => {
        BaseScene.zoomBackground.pause();
      }
    });
  }

  resetBackgroundScale(){
    BaseScene.backgroundScene.background.setScale(BaseScene.backgroundInitialScaleX, BaseScene.backgroundInitialScaleY);
  }

  pauseZoomOutBackground(){
    BaseScene.zoomOutBackground.pause();
  }

  playZoomOutBackground(){
    BaseScene.zoomOutBackground.play();
  }

  pauseZoomInBackground(){
    BaseScene.zoomInBackground.pause();
  }

  playZoomInBackground(){
    BaseScene.zoomInBackground.play();
  }

  //Menu
  displayDifficultyMenu(){

    //Difficulty menu

    BaseScene.difficultyMenuContainer = this.add.container(BaseScene.windowWidth / 2, BaseScene.windowHeight / 2);

    const difficultyMenu = this.add
      .image(0, 0, 'difficulty_menu')
      .setOrigin(.5);

    scaleBasedOnResolution(difficultyMenu, .3, .6, this);  

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

    this.difficultyMenuButtonEventHandler(easyButton);

    scaleBasedOnImage(difficultyMenuBounds, easyButton, .45, .127);

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

    this.difficultyMenuButtonEventHandler(averageButton);

    scaleBasedOnImage(difficultyMenuBounds, averageButton, .45, .127);

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

    this.difficultyMenuButtonEventHandler(hardButton);

    scaleBasedOnImage(difficultyMenuBounds, hardButton, .45, .127);

    hardButton.setPosition(hardButtonPositionX, hardButtonPositionY);

    BaseScene.difficultyMenuContainer.add(hardButton);

  }

  difficultyMenuButtonEventHandler(button){

    button.on('pointerdown', () => {

      this.setLevelData(button.difficultyIndex);

      this.setDifficultyMenuContainerVisibility(false);

      if (BaseScene.currentScore > 0){
        this.resetScoreInfo();
      }

      BaseScene.scoreText.text = `Points: ${BaseScene.currentScore}`;

      BaseScene.questionSceneRef.startGame();

    });

  }

  setPointFactor(value){
    BaseScene.pointFactor = value;
  }

  setDifficultyMenuContainerVisibility(isVisible){
    BaseScene.difficultyMenuContainer.setVisible(isVisible);
  }

  //Timer

  displayTimerText(){

    const baseFontSize = 2; 

    const widthFactor = 0.04; 

    const heightFactor = 0.04; 

    const targetFontSize = Math.min(
      baseFontSize + window.innerWidth * widthFactor,
      baseFontSize + window.innerHeight * heightFactor
    );

    const scoreTextMainPosition = BaseScene.scoreText.getBottomLeft();

    const scoreTextPositionY = scoreTextMainPosition.y;

    const scoreTextPositionX = scoreTextMainPosition.x;

    const timer = "Time: 00:00:00";

    BaseScene.timerText = this.add.text(scoreTextPositionX, scoreTextPositionY, timer, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: targetFontSize,
      fill: '#000',
    });

    BaseScene.timerText.setOrigin(0);

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

  updateTimer = () => {
   
    if (BaseScene.seconds > 0 || BaseScene.milliseconds > 0) {

      BaseScene.milliseconds -= 10;
  
      if (BaseScene.milliseconds < 0) {

        BaseScene.milliseconds = 990;

        BaseScene.seconds--;

      }

      this.setTimeFormat();

    } else {

        BaseScene.timerText.text = "Time's up!";

        this.resetTimerInfo();

        this.pauseTimer();

        this.callQuestionSceneGameOver();

        this.setCanAnswerQuestion(false);

    }
  }

  async callQuestionSceneGameOver(){

    await BaseScene.questionSceneRef.isGameOver();

    this.setDifficultyMenuContainerVisibility(true);

  }

  setSeconds(value){

    BaseScene.seconds = value;

    this.setTimeFormat();

  }

  resetTimerInfo() {

    BaseScene.seconds = 0;

    BaseScene.milliseconds = 0;

  }

  setTimeFormat(){

    const minutes = Math.floor(BaseScene.seconds / 60);

    const remainingSeconds = BaseScene.seconds % 60;
  
    BaseScene.timerText.text = `Time: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}:${(BaseScene.milliseconds / 10).toFixed(0)}`;
  
  }

  //Score

  displayScoreText(){

    const baseFontSize = 2; 

    const widthFactor = 0.04; 

    const heightFactor = 0.04; 

    const targetFontSize = Math.min(
      baseFontSize + window.innerWidth * widthFactor,
      baseFontSize + window.innerHeight * heightFactor
    );

    const scorePosition = positionBasedOnResolution(.01, .04, this);

    BaseScene.scoreText = this.add.text(scorePosition.xPosition, scorePosition.yPosition, "Points: "  + BaseScene.currentScore, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: targetFontSize,
      fill: '#000',
      fontStyle: "bold"
    });

    BaseScene.scoreText.setOrigin(0);

  }

  updateScore(){

    BaseScene.currentScore += BaseScene.pointFactor;

    BaseScene.scoreText.text = `Points: ${BaseScene.currentScore}`;

  }

  resetScoreInfo(){

    BaseScene.currentScore = 0;

    BaseScene.scoreText.text = "Points: 0";

  }

  addSelectedQandA(questionId, selectedQuestionChoiceId){

    BaseScene.selectedQandA.push({
      questionId,
      selectedQuestionChoiceId
    });

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

  //Server

  setServerData(data){
    BaseScene.serverData = data;
  }

  setSortedQandA(){

    const gameDifficultyLevel = BaseScene.serverData.categories
      .filter(item => item.hasOwnProperty('level'));

    gameDifficultyLevel.forEach(item => {
      const levelKey = item.level;
      BaseScene.sortedQandA[levelKey] = {
        questions: item.questions.sort((a, b) => a.id - b.id),
        randomizeQuestions: item.randomizeQuestions,
        typePoint: item.typePoint
      };
    });

  }

  setLevelData(difficultyIndex){

    BaseScene.selectedDifficultyIndex = difficultyIndex;

    BaseScene.questionSceneRef.resetCurrentQuestionIndex();

    const typePoint = BaseScene.sortedQandA[difficultyIndex].typePoint;

    this.setSeconds(typePoint.durationSeconds);

    this.setPointFactor(typePoint.pointsPerQuestion);

  }

}

export default BaseScene;