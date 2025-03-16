import BaseScene from './BaseScene';

import { getRandomWholeNumber } from './Common.js';

class PlayScene extends BaseScene{

  constructor(){

    super('PlayScene');

    this.keypadCount = 9;

    this.currentScene = null;

    this.questionScene = null;

    this.accessControlPanel = null;

    this.questionSceneLoaded = false;

    this.accessControlSceneLoaded = false;

  }
  
  create() {

    super.create();

    this.setPlaySceneReference(this);

    this.launchImportantAssets();

  }

  launchImportantAssets(){

    this.scene.launch('HintScene');

    this.scene.launch('AccessControlPanel');

    this.scene.launch('QuestionScene');
    
  }

  async launchScene(isBackToDefaultLevel = false){

    if (BaseScene.currentRoomIndex === 0){ 

      if(this.getScoreValue() > 0){

        this.updateBackgroundImage('room1bg'); 

      }
      else{

        console.log("await this.startingSceneLoad(isBackToDefaultLevel)");

        await this.startingSceneLoad(isBackToDefaultLevel);

      }

    } else if(BaseScene.currentRoomIndex === 1){

        this.updateBackgroundImage('room2bg'); 

    } else if(BaseScene.currentRoomIndex === 2){

        this.updateBackgroundImage('room3bg'); 

    } else if(BaseScene.currentRoomIndex === 3){

        this.updateBackgroundImage('room4bg'); 

    } else if(BaseScene.currentRoomIndex === 4){

        this.updateBackgroundImage('room5bg');

    }

    this.resetRoomDetails();

    if(this.getScoreValue() > 0){

      this.resetRoomInteractiveSpriteAlpha(0);

      this.sceneFadeIn();

    }

  }

  async startingSceneLoad(isResetRoomIndex) {

    if(!isResetRoomIndex){

      const initialSpritesFadeIn = [
        BaseScene.background,
        BaseScene.questionSceneRef.questionHolder
      ];
  
      const lastSpritesFadeIn = [
        BaseScene.accessControlSceneRef.doorAccess,
        BaseScene.hintSceneRef.hintIcon
      ];
  
      this.sceneFadeIn(initialSpritesFadeIn);
  
      await BaseScene.questionSceneRef.divideQandAArrayImageAndLoad();  
  
      this.sceneFadeIn(lastSpritesFadeIn);
  
      BaseScene.questionSceneRef.questionHolder.setInteractive();

    }

  };

  launchNextScene(isResetRoomIndex = false){

    const setRoomIndex = () => {

      if (BaseScene.currentRoomIndex < 4 
        && !isResetRoomIndex){

        this.incrementRoomIndex(1);
  
      } else {
  
        this.resetRoomIndex();
  
      }

    }

    setRoomIndex();

    this.launchScene(true);

  }

  getUniqueRandomNumber(count, min, max) {

    const uniqueNumbers = [];

    while (uniqueNumbers.length < count) {

      const randomNum = getRandomWholeNumber(min, max);

      if (!uniqueNumbers.includes(randomNum)) {
        uniqueNumbers.push(randomNum);
      }

    }

    return uniqueNumbers;

  }

  convertNumberArrToLetter(numberArr, letterArr){

    let numberToLetters = [];

    numberArr.forEach(number => {
      numberToLetters.push(letterArr[number]);
    });

    return numberToLetters.join(' ').replace(/,/ , ' ');

  }

  resetRoomDetails(){

    const {keypadLetters, numberArr} = BaseScene.accessControlSceneRef.resetAccessControlPanel();

    BaseScene.questionSceneRef.resetQuestionDetails();

    this.updateRoomCode(this.convertNumberArrToLetter(numberArr, keypadLetters));

    this.setCodeTextVisibility(false);

    BaseScene.questionSceneRef.setCanAnswerQuestion(true);

  }

  handleSceneCreate = (sceneKey, flagToUpdate, callback) => {

    this.scene.get(sceneKey).events.on('create', () => {

      this[flagToUpdate] = true;

      callback();

    });

  };

  sceneFadeIn(targetSprite = BaseScene.roomInteractiveSprite) {

    this.tweens.add({
      targets: targetSprite,
      alpha: 1,
      duration: 1000,
      ease: 'Linear'
    });

  }

  extractFileName(filePath) {

    return filePath.match(/[^/]+$/)[0];

  }

}
  
export default PlayScene;