import Phaser from 'phaser';

import { 
  scaleBasedOnResolution, 
  scaleBasedOnImage, 
  positionBasedOnResolution, 
  checkInternetConnection,
  waitForInternetConnection 
} from './Utils.js';

class BaseScene extends Phaser.Scene {

  static playSceneRef = null;

  static questionSceneRef = null;

  static background = null;

  static ground = null;

  static bush = null;

  static timerText = null;

  static timerInterval = null;

  static scoreText = null;

  static difficultyMenuContainer = null;

  static scoreBoardContainer = null;

  static currentScore = 0;

  static seconds = 0;

  static milliseconds = 0;

  static pointFactor = 0;

  static scoreFontSize = 0;

  static backgroundWidthPercentage = 0;

  static randomArrayPerLevel = [];

  static sortedQandA = {};

  static selectedQandA = [];

  static fontFamilyStyle = null;

  //Audio

  static correctAnswerAudio = null;

  static wrongAnswerAudio = null;

  static slingShotStretchAudio = null;

  static slingShotReleaseAudio = null;

  static backgroundAudio = null;

  constructor(key) {

    super(key);

  }

  create (){

    BaseScene.windowWidth = this.scale.width;
    BaseScene.windowHeight = this.scale.height;

    BaseScene.fontFamilyStyle = 'GT Walsheim Pro, Sans-Serif, Times New Roman';

    BaseScene.backgroundWidthPercentage = 1.5;

    this.setAudio();

    this.createGraphics();

  }

  setAudio(){

    BaseScene.correctAnswerAudio = this.sound.add('correctAnswerAudio');

    BaseScene.wrongAnswerAudio = this.sound.add('wrongAnswerAudio');

    BaseScene.slingShotStretchAudio = this.sound.add('slingShotStretchAudio');

    BaseScene.slingShotReleaseAudio = this.sound.add('slingShotReleaseAudio');

    BaseScene.backgroundAudio = this.sound.add('backgroundAudio');

    BaseScene.backgroundAudio.setLoop(true);

    BaseScene.backgroundAudio.setVolume(.15);

    const playOnce = () => {
      this.playBackgroundAudio('backgroundAudio');
      if (BaseScene.backgroundAudio.isPlaying){
        this.input.off('pointerdown', playOnce); 
      }
      
    };
  
    this.input.on('pointerdown', playOnce);

  }

  createGraphics(){

    if (BaseScene.background === null) {

      BaseScene.backGround = this.add
        .image(0, 0, 'background')
        .setOrigin(0, 0);

      scaleBasedOnResolution(
        BaseScene.backGround, 
        BaseScene.backgroundWidthPercentage, 
        1, 
        this
      );

      this.setFloorBg();
    
    }

    BaseScene.scoreFontSize = BaseScene.windowHeight * .05;

    this.scoreBoardContainer = this.add.container(0, 0);

    this.displayScoreText();

    this.displayTimerText();

    this.scoreBoardContainer.setScrollFactor(0);

  }

  setFloorBg(){

    const floorBgTexture = this.textures.get('floorbg').getSourceImage();
    const floorBgRawHeight = floorBgTexture.height; 
    const targetHeight = BaseScene.windowHeight * .08; 
    const targetScaleY = targetHeight / floorBgRawHeight;

    BaseScene.ground = this.add.tileSprite(
      0, 
      BaseScene.windowHeight, 
      BaseScene.windowWidth * BaseScene.backgroundWidthPercentage, 
      targetHeight, 
      'floorbg'
    );

    BaseScene.ground.setTileScale(1, targetScaleY);

    BaseScene.ground.setOrigin(0, 1);

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

    easyButton.difficultyIndex = 1; 

    easyButton.setInteractive();

    this.difficultMenuButtonEventHandler(easyButton);

    scaleBasedOnImage(difficultyMenuBounds, easyButton, .45, .127);

    easyButton.setPosition(easyButtonPositionX, easyButtonPositionY);

    BaseScene.difficultyMenuContainer.add(easyButton);

    //Average Button

    const avgButtonPositionX = difficultyMenuTopCenter.x;

    const avgButtonPositionY = easyButton.getBottomCenter().y + buttonVerticalSpaceBetweenButton;

    const averageButton = this.add
      .image(0, 0, 'average_btn')
      .setOrigin(.5);

    averageButton.difficultyIndex = 2; 

    averageButton.setInteractive();

    this.difficultMenuButtonEventHandler(averageButton);

    scaleBasedOnImage(difficultyMenuBounds, averageButton, .45, .127);

    averageButton.setPosition(avgButtonPositionX, avgButtonPositionY);

    BaseScene.difficultyMenuContainer.add(averageButton);

    //Hard Button
     
    const hardButtonPositionX = difficultyMenuTopCenter.x;

    const hardButtonPositionY = averageButton.getBottomCenter().y + buttonVerticalSpaceBetweenButton;

    const hardButton = this.add
      .image(0, 0, 'hard_btn')
      .setOrigin(.5);

    hardButton.difficultyIndex = 3; 

    hardButton.setInteractive();

    this.difficultMenuButtonEventHandler(hardButton);

    scaleBasedOnImage(difficultyMenuBounds, hardButton, .45, .127);

    hardButton.setPosition(hardButtonPositionX, hardButtonPositionY);

    BaseScene.difficultyMenuContainer.add(hardButton);

  }

  setDifficultyMenuVisibility(isVisible){
    BaseScene.difficultyMenuContainer.setVisible(isVisible);
  }

  //Score
  displayScoreText(){

    const scorePosition = positionBasedOnResolution(.035, .035, this);

    BaseScene.scoreText = this.add.text(scorePosition.xPosition, scorePosition.yPosition, "Points: "  + BaseScene.currentScore, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: BaseScene.scoreFontSize,
      fill: '#000',
      fontStyle: "bold"

    });

    BaseScene.scoreText.setOrigin(0);

    this.scoreBoardContainer.add(BaseScene.scoreText);

  }

  resetScoreInfo(){

    BaseScene.currentScore = 0;

    BaseScene.scoreText.text = "Points: 0";

  }

  updateScore(){

    BaseScene.currentScore += BaseScene.pointFactor;

    BaseScene.scoreText.text = `Points: ${BaseScene.currentScore}`;

  }

  setPointFactor(value){

    BaseScene.pointFactor = value;

  }

  //Timer

  displayTimerText(){

    //const fontSize = BaseScene.windowHeight * .05;

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

    this.scoreBoardContainer.add(BaseScene.timerText);

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

      this.saveSelectedQandAToServer();

      this.resetTimerInfo();

      this.resetScoreInfo();

      this.pauseTimer();
   
      this.displayQandA();

      this.isGameOver();

    }

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

  resetTimerInfo() {

    BaseScene.seconds = 0;

    BaseScene.milliseconds = 0;

  }

  setSeconds(value){

    BaseScene.seconds = value;

    this.setTimeFormat();

  }

  setTimeFormat(){

    const minutes = Math.floor(BaseScene.seconds / 60);

    const remainingSeconds = BaseScene.seconds % 60;
  
    BaseScene.timerText.text = `Time: ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}:${(BaseScene.milliseconds / 10).toFixed(0)}`;

  }

  isGameOver = async() => {

    BaseScene.playSceneRef.isResetScene();

    this.setDifficultyMenuVisibility(true);

  }

  //Event

  difficultMenuButtonEventHandler(button){

    button.on('pointerdown', () => {

      this.resetSelectedQandA();

      BaseScene.questionSceneRef.loadRemainingQandAImages(button.difficultyIndex);

      this.setLevelData(button.difficultyIndex);

      this.setDifficultyMenuVisibility(false);

      this.resetSpritesPosition();

    });

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
    console.log("key", key);
    console.log("this.cache.audio.has(key): ", this.cache.audio.has(key));
    console.log("BaseScene.backgroundAudio: ", BaseScene.backgroundAudio);
    console.log("BaseScene.backgroundAudio.isPlaying: ", BaseScene.backgroundAudio.isPlaying);

    if (
      this.cache.audio.has(key) &&
      BaseScene.backgroundAudio &&
      !BaseScene.backgroundAudio.isPlaying
    ) {
      BaseScene.backgroundAudio.play();
    }
  
  }

  //Server
  async saveSelectedQandAToServer(){

    await this.checkInternetConnectionBanner();
  
    const categoryId = BaseScene.serverData.categories.find(item => item.level === BaseScene.selectedDifficultyIndex);

    updateActivityCategoryCompletionBySlugAndCurrentStudentUser(
      BaseScene.selectedQandA,
      categoryId.id
    );

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
        questions: item.questions.sort((a, b) => a.orderNumber - b.orderNumber),
        randomizeQuestions: item.randomizeQuestions,
        typePoint: item.typePoint
      };
    });

  }

  setLevelData(difficultyIndex){

    BaseScene.questionSceneRef.resetCurrentQuestionIndex();

    BaseScene.selectedDifficultyIndex = difficultyIndex;

    this.setSeconds(BaseScene.sortedQandA[difficultyIndex].typePoint.durationSeconds);

    this.setPointFactor(BaseScene.sortedQandA[difficultyIndex].typePoint.pointsPerQuestion);


  }

}

export default BaseScene;