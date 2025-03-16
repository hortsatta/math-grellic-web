import BaseScene from './BaseScene';

import { positionBasedOnResolution, sizeBasedOnResolutionProportion } from './Utils.js';

class PlayScene extends BaseScene{

  constructor(){

    super('PlayScene');

    this.finalScaleX = 0;

    this.finalScaleY = 0;

    this.boardRingTextureArr = ["ring_1", "ring_2", "ring_3", "ring_4", "ring_5", "ring_6"];

    this.boardRingObjArr = [];

    this.scaleDownBall = null;

    this.ballRotationAnimation = null;

    this.ball = null;

  }
  
  create() {

    super.create();

    this.setPlaySceneRef(this);

    this.createBallRotationAnimation();

    this.scene.launch('QuestionScene');

    this.scene.get('QuestionScene').events.once('questionSceneReady', () => {

      BaseScene.questionSceneRef.loadRemainingQandAImages();

      this.displayDifficultyMenu();

      this.createDummyRingTexture1();

      this.createRing();

      this.createBall();

    });
    
  }

  createRing(){

    this.boardRingObjArr = [
      this.add.sprite(0, 0, 'ring_1').setOrigin(.5, 0).setDepth(2),
      this.add.sprite(0, 0, 'ring_1').setOrigin(.5, 0).setDepth(2),
      this.add.sprite(0, 0, 'ring_1').setOrigin(.5, 0).setDepth(2),
      this.add.sprite(0, 0, 'ring_1').setOrigin(.5, 0).setDepth(2)
    ];

  }

  createBall(){

    this.ball = this.add
      .sprite(0, 0, 'ball1')
      .setOrigin(0.5)
      .setDepth(3);

    this.updateBallProperties();

    this.setBallVisibility(false);

  }

  createDummyRingTexture1(){
    this.textures.createCanvas('ring_1', 1, 1).context.clearRect(0, 0, 1, 1);
  }

  //ring properties

  setRingTexture(ringIndex, isCorrect){

    const ringTexture = isCorrect ? "correct_ring" : "wrong_ring";

    this.boardRingObjArr[ringIndex].setTexture(ringTexture)
    
  }

  adjustRingSizeAndPosition(answerBoundsArr){

    answerBoundsArr.forEach((element, index) => {

      this.adjustRingSize(index, element);

      this.adjustRingPosition(index, element);
      
    });

  }

  adjustRingSize(index, answerBounds){

    this.boardRingObjArr[index].displayHeight = answerBounds.height * .4;
    this.boardRingObjArr[index].displayWidth = answerBounds.height * .4;

  }

  adjustRingPosition(index, answerBounds){

    const positionX = answerBounds.x + answerBounds.width / 2; 
    const positionY = answerBounds.y + answerBounds.height * .8;

    this.boardRingObjArr[index].setX(positionX);
    this.boardRingObjArr[index].setY(positionY);

  }

  //ball properties

  setBallVisibility(isVisible){
    this.ball.visible = isVisible;
  }

  updateBallProperties(){

    const ballPosition = positionBasedOnResolution(.5, .9, this);

    this.ball.setPosition(ballPosition.xPosition, ballPosition.yPosition);

    sizeBasedOnResolutionProportion(this.ball, .15, this);

  }

  ringTexture(textureIndex){

    const currentRingTexture = this.boardRingTextureArr[textureIndex];

    this.boardRingObjArr.forEach((board_ring) => {
      board_ring.setTexture(currentRingTexture);
    });

  }

  //animation

  createBallRotationAnimation(){

    this.anims.create({
      key: 'ball',
      frames: [
        { key: 'ball1' },
        { key: 'ball2' },
        { key: 'ball3' },
        { key: 'ball4' },
        { key: 'ball5' },
        { key: 'ball6' }
      ],
      frameRate: 10, 
      repeat: -1 
    });

    this.ballRotationAnimation = 'ball';

  }

  shootBallAnimation(targetObject){

    const halfScreenCoordinateX = BaseScene.windowWidth / 2;

    const targetScale_1 =  this.ball.scaleX * .14;

    const targetScale_2 =  this.ball.scaleX * .09;

    const answerBounds = targetObject.getBounds();

    const targetPositionX = answerBounds.x + answerBounds.width / 2;

    const targetPositionY_1 = answerBounds.y + answerBounds.height * .2;

    const ringHalfHeight = this.boardRingObjArr[targetObject.info.index].getBounds().height * .5;

    const targetPositionY_2 = answerBounds.y + answerBounds.height + ringHalfHeight;

    //additional Values

    const finalPosYDifference = this.ball.y * .11;

    const initialPosXDifference = this.ball.x * 0.035;

    const xdirectionMultiplier = answerBounds.x < halfScreenCoordinateX ? -1 : 1;

    const finalPosXDifference = initialPosXDifference * xdirectionMultiplier;

    this.tweens.chain({
      targets: this.ball,
      tweens: [
        {
          x: this.ball.x + finalPosXDifference,
          y: this.ball.y - finalPosYDifference,
          ease: 'easeIn',
          duration: 100,
          onStart: (tween) => {

            this.ball.flipX = targetObject.info.index % 2 === 0;

            this.ball.play(this.ballRotationAnimation);

          }
        },    
        {
          x: targetPositionX,
          y: targetPositionY_1,
          scaleX: targetScale_1,
          scaleY: targetScale_1,
          ease: 'easeIn',
          duration: 1500,
          onComplete: () => {
            this.ball.setDepth(1);
          }
        },    
        {
          x: targetPositionX,
          y: targetPositionY_2,
          scaleX: targetScale_2,
          scaleY: targetScale_2,
          ease: 'easeIn',
          duration: 1000,
          onComplete: () => {

            this.ball.setDepth(3);

            this.ball.stop();

            this.ball.anims.setCurrentFrame(this.ball.anims.currentAnim.frames[0]);

            this.updateBallProperties();
  
            this.setBallVisibility(false);
   
            BaseScene.ballShotAudio.once('complete', () => {

              const isCorrectAnswer = BaseScene.questionSceneRef.checkSelectedAnswer(targetObject.info.index);

              BaseScene.questionSceneRef.setBoardTextureBasedonAnswer(targetObject.info.index, isCorrectAnswer);

              this.setRingTexture(targetObject.info.index, isCorrectAnswer);
  
              setTimeout(() => {
                BaseScene.questionSceneRef.setScaleUpAnswers();
              }, 1000);
              
            });

            BaseScene.ballShotAudio.play();

          }    
        }
      ]
    });
  }
}

export default PlayScene;