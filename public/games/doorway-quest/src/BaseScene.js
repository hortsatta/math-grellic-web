import Phaser from 'phaser';

import { scaleBasedOnResolution, 
  positionBasedOnResolution, 
  checkInternetConnection, 
  waitForInternetConnection
} from './Utils.js';


class BaseScene extends Phaser.Scene {
  
  static windowWidth = 0;

  static windowHeight = 0;

  static questionSceneRef = null;

  static accessControlSceneRef = null;

  static hintSceneRef = null;

  static playSceneRef = null;

  static currentRoomIndex = 0;

  static points = 0;

  static roomInteractiveSprite = [];

  static scoreText = null;

  static background = null;

  static currentRoomCode = null;

  static codeText = null;

  static levelData = null;

  static sortedQuestionList = null;

  //Audio

  static backgroundAudio = null;

  static keyAudio = null;

  static correctCodeAudio = null;

  static incorrectCodeAudio = null;

  static correctAnswerAudio = null;

  static wrongAnswerAudio = null;

  static holderAudio = null;

  constructor(key) {

    super(key);

    this.targetScore = 15;

  }
  
  create(){

    BaseScene.windowWidth = this.scale.width;
    BaseScene.windowHeight = this.scale.height;

    BaseScene.fontFamilyStyle = 'GT Walsheim Pro, Sans-Serif, Times New Roman';

    this.setAudio();

    this.createGraphics();

    this.displayScoreText();

    this.displayRoomCode();
    
  }

  setAudio(){

    BaseScene.backgroundAudio = this.sound.add('backgroundAudio');

    BaseScene.correctCodeAudio = this.sound.add('correctCodeAudio');

    BaseScene.incorrectCodeAudio = this.sound.add('incorrectCodeAudio');

    BaseScene.correctAnswerAudio = this.sound.add('correctAnswerAudio');

    BaseScene.wrongAnswerAudio = this.sound.add('wrongAnswerAudio');

    BaseScene.keyAudio = this.sound.add('keyAudio');

    BaseScene.holderAudio = this.sound.add('holderAudio');

    //isloop

    BaseScene.backgroundAudio.setLoop(true);

    //volume

    BaseScene.holderAudio.setVolume(.3);

    BaseScene.keyAudio.setVolume(.5);

    BaseScene.backgroundAudio.setVolume(.1);

    BaseScene.wrongAnswerAudio.setVolume(.3);

    BaseScene.correctAnswerAudio.setVolume(.25);

    BaseScene.incorrectCodeAudio.setVolume(.25);

    BaseScene.correctCodeAudio.setVolume(.25);

    const playBgAudioEventHandler = () => {

      this.playBackgroundAudio('backgroundAudio');
      if (BaseScene.backgroundAudio.isPlaying){
        this.input.off('pointerdown', playBgAudioEventHandler); 
      }
      
    };
  
    this.input.on('pointerdown', playBgAudioEventHandler);

  }

  createGraphics (){

    if (BaseScene.background === null) {

      BaseScene.background = this.add
        .image(BaseScene.windowWidth / 2, BaseScene.windowHeight / 2, 'room1bg')
        .setOrigin(.5)
        .setAlpha(0)
        .setDepth(0);

      this.addRoomInteractiveSprite(BaseScene.background);

    } 

    scaleBasedOnResolution(BaseScene.background, 1, 1);

  }

  updateBackgroundImage(sprite){

    BaseScene.background.setTexture(sprite);

    scaleBasedOnResolution(BaseScene.background, 1, 1);

  }

  displayScoreText() {

    const baseFontSize = 2;
    const widthFactor = 0.04;
    const heightFactor = 0.04;

    const targetFontSize = Math.min(
      baseFontSize + BaseScene.windowWidth * widthFactor,
      baseFontSize + BaseScene.windowHeight * heightFactor
    );

    const scorePosition = positionBasedOnResolution(0.01, 0.04);

    // Check if scoreText already exists
    if (!BaseScene.scoreText) {

      BaseScene.scoreText = this.add.text(scorePosition.xPosition, scorePosition.yPosition, "Points: " + BaseScene.points, {
        fontFamily: BaseScene.fontFamilyStyle,
        fontSize: targetFontSize,
        fill: '#000',
      });

      BaseScene.scoreText.setOrigin(0);

    } else {

      BaseScene.scoreText.setText("Points: " + BaseScene.points);

    }

  }

  displayRoomCode(){

    if (!BaseScene.codeText) {

      const baseFontSize = 2;
      const widthFactor = 0.04;
      const heightFactor = 0.04;
  
      const targetFontSize = Math.min(
        baseFontSize + window.innerWidth * widthFactor,
        baseFontSize + window.innerHeight * heightFactor
      );
  
      const roomCodeMainPosition = BaseScene.scoreText.getBottomLeft();
  
      const roomCodePositionX = roomCodeMainPosition.x;
  
      const roomCodePositionY = roomCodeMainPosition.y;

      BaseScene.codeText = this.add.text(roomCodePositionX, roomCodePositionY, "", {
        fontFamily: BaseScene.fontFamilyStyle,
        fontSize: targetFontSize,
        fill: '#000',
      });

      BaseScene.codeText.setOrigin(0);
      
      this.setCodeTextVisibility(false);

    } else {

      BaseScene.codeText.setText("Room Code: " + BaseScene.currentRoomCode);

      this.setCodeTextVisibility(true);

    }

  }

  getScoreValue(){
    return BaseScene.points;
  }

  resetPoints(){

    BaseScene.points = 0;

    this.displayScoreText();

  }

  incrementScoreValue() {

    BaseScene.points += 1;

    this.displayScoreText();

  }

  checkIfCodeMatch(value){

    const rawRoomCode = BaseScene.currentRoomCode.replace(/\s/g, '');

    return rawRoomCode === value;

  }

  goToNextScene(value){

    const nextOrDefaultScene = () => {

      this.incrementScoreValue();

      if(BaseScene.points < this.targetScore){
        BaseScene.playSceneRef.launchNextScene();
      } else {
        this.backToDefaultLevel();
      }

    }

    if (value){
      setTimeout(nextOrDefaultScene, 500);
    } else {
      setTimeout(this.backToDefaultLevel(), 500);
    }

  }

  backToDefaultLevel(){

    BaseScene.questionSceneRef.resetCurrentQuestionIndex();

    BaseScene.playSceneRef.launchNextScene(true);

    this.resetPoints();

  }

  setCodeTextVisibility(isVisible){
    BaseScene.codeText.setVisible(isVisible);
  }

  updateRoomCode(value) {
    BaseScene.currentRoomCode = value;
  }

  incrementRoomIndex(value){
    BaseScene.currentRoomIndex += value;
  }

  resetRoomIndex(){
    BaseScene.currentRoomIndex = 0;
  }

  setPlaySceneReference(reference) {
    BaseScene.playSceneRef = reference;
  }

  setAccessControlSceneReference(reference) {
    BaseScene.accessControlSceneRef = reference;
  }

  setHintSceneReference(reference) {
    BaseScene.hintSceneRef = reference;
  }

  setQuestionSceneReference(reference) {
    BaseScene.questionSceneRef = reference;
  }

  setNotificationBannerSceneRef(reference){
    BaseScene.notificationBannerSceneRef = reference;
  }

  setCanAnswerQuestion(value) {
    BaseScene.questionSceneRef.setCanAnswerQuestion = value;
  }

  addRoomInteractiveSprite(sprite){
    BaseScene.roomInteractiveSprite.push(sprite);
  }

  resetRoomInteractiveSpriteAlpha(value){

    BaseScene.roomInteractiveSprite.forEach(element => {
      element.setAlpha(value)
    });

  }

  checkInternetConnectionBanner = async () => {

    if (!await checkInternetConnection()) {

      BaseScene.notificationBannerSceneRef.displayBanner(true, "Kindly check your internet connection");

      await waitForInternetConnection();

      BaseScene.notificationBannerSceneRef.displayBanner();

    }

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

  setLevelData(){

    BaseScene.levelData = BaseScene.serverData.categories[0];

    BaseScene.sortedQuestionArray = BaseScene.levelData.questions.slice().sort((a, b) => a.id - b.id);

  }

}

export default BaseScene;