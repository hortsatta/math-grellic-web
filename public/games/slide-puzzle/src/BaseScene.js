import Phaser from 'phaser';

import { checkInternetConnection, waitForInternetConnection } from './Utils.js';

import { shuffleArray } from './GameHelpers.js';

class BaseScene extends Phaser.Scene {

  static questionSceneRef = null;

  static playSceneRef = null;

  static notificationBannerSceneRef = null;

  static levelText = null;

  static notificationText = null;

  static notificationBanner = null;

  static levelQuestions = {};

  static qAndAData = [];

  static selectedQandA = [];

  static currentStageNumber = 1;

  static currentGameLevel = 0;

  static stageNumberCheckPoint = [8, 13];

  static maxGameLevel = 15;

  static fontFamilyStyle = null;

  //Audio

  static blockEndMoveAudio = null;

  static backgroundAudio = null;

  static correctAnswerAudio = null;

  static wrongAnswerAudio = null;

  constructor(key) {

    super(key);

  }

  create() {

    BaseScene.windowWidth = this.scale.width;
    BaseScene.windowHeight = this.scale.height;

    BaseScene.fontFamilyStyle = 'GT Walsheim Pro, Sans-Serif, Times New Roman';

    this.setAudio();

  }

  setAudio(){

    BaseScene.backgroundAudio = this.sound.add('backgroundAudio');

    BaseScene.backgroundAudio.setLoop(true);

    BaseScene.blockEndMoveAudio = this.sound.add('blockEndMoveAudio');

    BaseScene.correctAnswerAudio = this.sound.add('correctAnswerAudio');

    BaseScene.wrongAnswerAudio = this.sound.add('wrongAnswerAudio');

    const playOnce = () => {
      this.playBackgroundAudio('backgroundAudio');
      if (BaseScene.backgroundAudio.isPlaying){
        this.input.off('pointerdown', playOnce); 
      }
      
    };
  
    this.input.on('pointerdown', playOnce);

  }

  displayLevelText(boardBound){

    const fontSize = boardBound.top * .7;

    const positionY = boardBound.top / 2;
    const positionX = boardBound.centerX;

    BaseScene.levelText = this.add.text(positionX, positionY, "Level: "  + BaseScene.currentGameLevel, {
      fontFamily: BaseScene.fontFamilyStyle,
      fontSize: fontSize,
      fill: '#000',
      fontStyle: 'bold'
    });

    BaseScene.levelText.setOrigin(.5);

  }

  checkInternetConnectionBanner = async () => {

    if (!await checkInternetConnection()) {

      BaseScene.notificationBannerSceneRef.displayBanner(true, "Kindly check your internet connection");

      await waitForInternetConnection();

      BaseScene.notificationBannerSceneRef.displayBanner();

    }

  }

  //reference

  setPlaySceneRef(reference){
    BaseScene.playSceneRef = reference;
  }

  setQuestionSceneRef(reference){
    BaseScene.questionSceneRef = reference;
  }

  setNotificationBannerSceneRef(reference){
    BaseScene.notificationBannerSceneRef = reference;
  }

  increaseCurrentStageNumber(){
    BaseScene.currentStageNumber += 1;
  }

  resetCurrentStageNumber(){
    BaseScene.currentStageNumber = 1;
  }

  updateLevelInfoData(isNextStageNumber){

    if (BaseScene.currentGameLevel > 1) {

      BaseScene.questionSceneRef.incrementQAndLevelMultiplier();

      if (isNextStageNumber){

        this.increaseCurrentStageNumber();

        BaseScene.questionSceneRef.resetQAndALevelMultiplier();

      }

    } else if (BaseScene.currentStageNumber > 1){
      this.resetCurrentStageNumber();
    }

  }

  updateGameLevelText(){
    BaseScene.levelText.text = `Level: ${BaseScene.currentGameLevel}`;
  }

  setLevelQuestions(qAndA = this.getLevelQuestions()){
    BaseScene.levelQuestions = qAndA;
  }

  // getLevelQuestions(targetLevel = BaseScene.currentStageNumber){
  //   return BaseScene.qAndAData[targetLevel - 1];
  // }

  totalQuestionsCount(gameLevel = BaseScene.currentGameLevel){

    let maxQuestions = 4

    if (gameLevel >= 8 && gameLevel <= 12) {
      maxQuestions = 5;
    } else if (gameLevel >= 13 && gameLevel <= 15) {
      maxQuestions = 7;
    }

    return maxQuestions;

  }

  isNextStageNumber(gameLevel = BaseScene.currentGameLevel){
    return BaseScene.stageNumberCheckPoint.includes(gameLevel);
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
  addSelectedQandA(questionId, selectedQuestionChoiceId){

    BaseScene.selectedQandA.push({
      questionId,
      selectedQuestionChoiceId,
    });

  }

  setServerData(data){
    BaseScene.serverData = data;
  }

  setLevelData(){
    BaseScene.levelData = BaseScene.serverData.categories[0];
  }

  setQandAData = async() => {

    const { qAndAData, levelData, currentStageNumber } = BaseScene;

    //separate by stage number
    levelData.questions.forEach(item => {
      const stageIndex = item.stageNumber - 1;
      qAndAData[stageIndex] ??= [];
      qAndAData[stageIndex].push(item);
    });
    
    //sort or random question
    if (!levelData.randomizeQuestions) {
      qAndAData.forEach(stage => stage.sort((a, b) => a.orderNumber - b.orderNumber));
    } else {
      qAndAData.forEach(shuffleArray);
    }
    
    const currentStageIndex = currentStageNumber - 1;
    const currentQandAData = qAndAData[currentStageIndex] || [];
    const remainingStageLevelData = qAndAData.slice(currentStageIndex + 1).flat();
    
    //check if initial question is greater than 1
    if (currentQandAData.length > this.totalQuestionsCount(1)) {
      const targetArrayPercentage = 0.2;
      const targetFirstArrayIndex = Math.ceil(currentQandAData.length * targetArrayPercentage);
      
      const [targetFirstArray, targetSecondArray] = [
        currentQandAData.slice(0, targetFirstArrayIndex),
        currentQandAData.slice(targetFirstArrayIndex)
      ];
    
      await this.loadImageArray(targetFirstArray, { sync: true });
      this.loadImageArray([...targetSecondArray, ...remainingStageLevelData]);
    } else {
      await this.loadImageArray(currentQandAData, { sync: true });
      this.loadImageArray(remainingStageLevelData);
    } 

  }

}

export default BaseScene;