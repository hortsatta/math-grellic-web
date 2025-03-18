import BaseScene from './BaseScene';

import { 
  scaleBasedOnResolution, 
  getTopCoordinate, 
  getHeightCoordinate, 
  getWidthCoordinate, 
  positionBasedOnResolution, 
  topLeftPercentage 
} from './Utils.js';

class PlayScene extends BaseScene{

  constructor(){

    super('PlayScene');

    this.birdImg;

    this.answer1Img;

    this.answer2Img;

    this.answer3Img;

    this.answer4Img;

    this.answersArray;

    this.slingShot;

    this.slingRubber1;

    this.slingRubber2;

    this.slingRubber1OrigScale = {};

    this.slingRubber2OrigScale = {};

    this.slingRubber1Scale = null;

    this.slingRubber2Scale = null;

    this.isRubber1StretchDone = false;

    this.isRubber2StretchDone = false;

    this.hasSelectedAnswer = false;

    this.animation = null;

    this.canSelectAnswer = false;

    this.cameraScrollX = 0;

  }
  
  create() {

    super.create();

    this.setPlaySceneRef(this);

    this.createPlaySceneGraphics();

    this.setBirdPositionBehindBush();

    this.answerEventHandler();

    this.answerCollision();

    this.cameras.main.setBounds(0, 0, BaseScene.windowWidth * BaseScene.backgroundWidthPercentage, BaseScene.windowHeight);

    this.scene.launch('QuestionScene');       

  }

  createPlaySceneGraphics(){

    const setSlingShotAndRubberGfx = () => {

      this.slingShot = this.add
      .image(0, 0, 'slingShot')
      .setOrigin(.5, 1);

      scaleBasedOnResolution(this.slingShot, 0.05, 0.1, this); 

      const slingShotPosition = positionBasedOnResolution(.1, 1, this);
      const groundTopCoordinate = getTopCoordinate(BaseScene.ground);
      const groundAdjustment = groundTopCoordinate * .01;
      this.slingShot.setPosition(slingShotPosition.xPosition, groundTopCoordinate + groundAdjustment); 

      this.slingRubber1 = this.add
        .sprite(0, 0, 'slingRubber')
        .setOrigin(1, .5);

      scaleBasedOnResolution(this.slingRubber1, 0.01, 0.01, this);

      this.slingRubber1.setPosition(
        getWidthCoordinate(this.slingShot, 0.3), 
        getHeightCoordinate(this.slingShot, 0.1)
      );

      this.slingRubber2 = this.add
        .sprite(0, 0, 'slingRubber')
        .setOrigin(1, .5);

      scaleBasedOnResolution(this.slingRubber2, 0.016, 0.01, this);

      this.slingRubber2.setPosition(
        getWidthCoordinate(this.slingShot, 0.76), 
        getHeightCoordinate(this.slingShot, 0.15)
      );

      this.slingRubber1Scale = {
        x: this.slingRubber1.scaleX,
        y: this.slingRubber1.scaleY
      }
  
      this.slingRubber2Scale = {
        x: this.slingRubber2.scaleX,
        y: this.slingRubber2.scaleY
      }

    };

    const setBushGfx = () => {

      this.bush = this.physics.add
      .image(0, 0, 'bush')
      .setOrigin(0, 1)
      .setImmovable(true);

      scaleBasedOnResolution(this.bush, .11, .11, this);

      const bushPosition = positionBasedOnResolution(.2, 1, this);
      this.bush.setPosition(bushPosition.xPosition, getHeightCoordinate(BaseScene.ground, .20));

    }

    const setBirdGfx = () => {

      this.birdImg = this.physics.add
      .sprite(0, 0, 'bird', 0)
      .setOrigin(.25, .94);

      const birdTargetWidth = BaseScene.windowWidth * 0.04;
      
      const birdScaleX = birdTargetWidth / this.birdImg.width;
      const birdScaleY = birdTargetWidth / this.birdImg.height;

      this.birdImg.setScale(birdScaleX, birdScaleY);

      this.birdImg.body.setSize(
        this.birdImg.width / 2,
        this.birdImg.height / 2
      );

    }

    const setAnswersGfx = () => {

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('kingcat', { start: 0, end: 10 }),
        frameRate: 10,
        repeat: -1 
      });
  
      this.answersArray = [
  
        this.answer1Img = this.physics.add
        .sprite(0, 0, 'kingcat')
        .setImmovable()
        .setInteractive(),
  
        this.answer2Img = this.physics.add
        .sprite(0, 0, 'kingcat')
        .setImmovable()
        .setInteractive(),
  
        this.answer3Img = this.physics.add
        .sprite(0, 0, 'kingcat')
        .setImmovable()
        .setInteractive(),
  
        this.answer4Img = this.physics.add
        .sprite(0, 0, 'kingcat')
        .setImmovable()
        .setInteractive(),
    
      ];
  
      const targetWidth = BaseScene.windowWidth * 0.05;
      
      const scaleX = targetWidth / this.answer1Img.width;
      const scaleY = targetWidth / this.answer1Img.height;
  
      this.answersArray.forEach((sprite) => {
        sprite.setScale(scaleX, scaleY);
        sprite.play("idle");
      });

      const answer1ImgPosition = positionBasedOnResolution(1.1, .19, this);
      this.answer1Img.setPosition(answer1ImgPosition.xPosition, answer1ImgPosition.yPosition);

      const answer2ImgPosition = positionBasedOnResolution(1.1, .40, this);
      this.answer2Img.setPosition(answer2ImgPosition.xPosition, answer2ImgPosition.yPosition);

      const answer3ImgPosition = positionBasedOnResolution(1.1, .61, this);
      this.answer3Img.setPosition(answer3ImgPosition.xPosition, answer3ImgPosition.yPosition); 

      const answer4ImgPosition = positionBasedOnResolution(1.1, .82, this);
      this.answer4Img.setPosition(answer4ImgPosition.xPosition, answer4ImgPosition.yPosition);

    }

    const setImgDepth = () => {

      this.birdImg.setDepth(1);

      this.slingRubber1.setDepth(2);
  
      this.slingShot.setDepth(3);
  
      this.bush.setDepth(2);

    }

    setSlingShotAndRubberGfx();
    setBushGfx();
    setBirdGfx();
    this.setBirdPositionBehindBush();
    setAnswersGfx();
    setImgDepth();

  }

  setBirdPositionBehindBush(){
    const bushCenterPosition = this.bush.getCenter();
    this.birdImg.setPosition(bushCenterPosition.x, bushCenterPosition.y);
  }

  returnSpriteToOriginalPosition(){

    this.slingRubber1.visible = false;

    this.slingRubber2.rotation = this.slingRubber2OrigRotation;

    this.slingRubber1.setScale(this.slingRubber1Scale.x, this.slingRubber1Scale.y);
    this.slingRubber2.setScale(this.slingRubber2Scale.x, this.slingRubber2Scale.y);

  }

  answerCollision(){
    const answerGroups = this.physics.add.group(this.answersArray);
    this.physics.add.collider(this.birdImg, answerGroups, this.resetSpritesPosition, null, this);
  }

  async resetSpritesPosition(bird, answer){

    const bushCenterPosition = this.bush.getCenter();

    if ( this.birdImg.x !== bushCenterPosition.x
      && this.birdImg.y !== bushCenterPosition.y){

        this.birdImg.setPosition(bushCenterPosition.x, bushCenterPosition.y);

        this.birdImg.setFrame(0);

    }

    if (this.animation !== null){
      
      this.animation.remove();

      this.cameras.main.stopFollow();

      const selectedAnswerIndex = this.answersArray.indexOf(answer);

      if (selectedAnswerIndex >= 0){

        await BaseScene.questionSceneRef.checkSelectedAnswer(selectedAnswerIndex);

      }

      await this.moveAnswerImg(); 

    }

    this.birdImg.setFlipX(true);

    this.birdImg.setVelocity(0, 0);

    this.isRubber1StretchDone = false;
    this.isRubber2StretchDone = false;

    this.slingRubber1.visible = true;

    await this.moveTargetObject(this.birdImg, this.slingRubber1, 2); 

    //change bird texture to closing eyes
    this.birdImg.setFrame(5);

    this.birdImg.setFlipX(false);
      
    this.animateStretching();

    this.hasSelectedAnswer = false;
    this.canSelectAnswer = false;

  }

  isResetScene = async() => {

    this.setBirdPositionBehindBush(); 

    this.returnSpriteToOriginalPosition(); 

    await this.moveAnswerImg();

  }

  //Events
  answerEventHandler(){

    this.answersArray.forEach(
      (answerImg, index) => {
        answerImg.on("pointerdown", () => this.handleAnswerSelection(index, answerImg));
      }
    );

  }

  handleAnswerSelection = async (index, answerImg) => {
    if (
      this.isRubber1StretchDone &&
      this.isRubber2StretchDone &&
      !this.hasSelectedAnswer &&
      this.canSelectAnswer
    ) {

      this.hasSelectedAnswer = true;

      this.setSelectedAnswerIndex(index);

      BaseScene.questionSceneRef.callAddSelectedQandA(this.selectedAnswerIndex);

      this.pauseTimer();
  
      await this.moveAnswerImg();
  
      this.cameras.main.startFollow(this.birdImg);
      this.animateSlingShotRelease();
  
      await this.moveTargetObject(this.birdImg, answerImg);

    }
  };

  moveTargetObject = async (hitterObj, targetObj, desiredAngle = 4) => {

    return new Promise(resolve => {

      const launchAngle = Math.PI / desiredAngle;
      const distance = Math.abs(targetObj.x - hitterObj.x);
      const startX = hitterObj.x;
      const startY = hitterObj.y;
      const endX = targetObj.x;
      const endY = targetObj.y;
      const controlPoint1X = startX + Math.cos(launchAngle) * distance / 3;
      const controlPoint1Y = startY - Math.sin(launchAngle) * distance / 3;
      const controlPoint2X = endX - Math.cos(launchAngle) * distance / 3;
      const controlPoint2Y = endY - Math.sin(launchAngle) * distance / 3;

      const curve = new Phaser.Curves.CubicBezier(
          new Phaser.Math.Vector2(startX, startY),
          new Phaser.Math.Vector2(controlPoint1X, controlPoint1Y),
          new Phaser.Math.Vector2(controlPoint2X, controlPoint2Y),
          new Phaser.Math.Vector2(endX, endY)
      );

      const duration = 2500;
      const steps = 100;
      let t = 0;

      this.animation = this.time.addEvent({
        delay: duration / steps,
        repeat: steps - 1,
        callback: () => {

            const distanceToTarget = Phaser.Math.Distance.Between(hitterObj.x, hitterObj.y, endX, endY);

            if (distanceToTarget < 15) {

                this.animation.remove();

                resolve(true);
            }

            t += 1 / steps;
            const position = curve.getPoint(t);
            hitterObj.x = position.x;
            hitterObj.y = position.y + 0.5 * 5 * Math.pow(t * duration / 1000, 2); // Apply gravity
        },
      });
    });

  }

  animateStretching(){

    var rotationRadians = Phaser.Math.DegToRad(-5);
    this.slingRubber2.rotation += rotationRadians;
    this.slingRubber2OrigRotation = rotationRadians;

    this.slingRubber1.rotation = 0;

    const slingRubber1Degrees = -50;
    const slingRubber2Degrees = -29;
    
    const slingRubber1Radian = Phaser.Math.DegToRad(slingRubber1Degrees);
    const slingRubber2Radian = Phaser.Math.DegToRad(slingRubber2Degrees);

    this.slingRubber1.rotation += slingRubber1Radian;

    this.tweens.add({

      targets: this.slingRubber1,
      scaleX: this.slingRubber1.scaleX * 2.8, 
      scaleY: this.slingRubber1.scaleY * .75, 
      duration: 2000,
      ease: Phaser.Math.Easing.Linear,
      onUpdate: () => {

        this.cameras.main.stopFollow();

        const rubberPos = topLeftPercentage(this.slingRubber1);

        this.birdImg.x = rubberPos.x;
        this.birdImg.y = rubberPos.y;

      },
      onComplete: async () => {

        this.isRubber1StretchDone = true;

        await this.moveAnswerImg(true);

        this.canSelectAnswer = true;

        BaseScene.questionSceneRef.displayQandA(true);
        
      },
      
    });

    this.tweens.add({

      targets: this.slingRubber2,
      scaleX: this.slingRubber2.scaleX * 2.3, 
      scaleY: this.slingRubber2.scaleY * .75, 
      rotation: slingRubber2Radian,
      duration: 2000,
      ease: Phaser.Math.Easing.Linear,
      onStart: () => {
        BaseScene.slingShotStretchAudio.play();
      },
      onComplete: () => {
        this.isRubber2StretchDone = true;
      },

    });

  }

  animateSlingShotRelease(){

    this.tweens.add({
      targets: this.slingRubber1,
      scaleX: this.slingRubber1Scale.x,
      scaleY: this.slingRubber1Scale.y,
      duration: 100,
      ease: Phaser.Math.Easing.Linear,
      onStart: () => {
        BaseScene.slingShotReleaseAudio.play();
      },
      onComplete: () => {
        this.slingRubber1.visible = false;
      }
    });

    this.tweens.add({
      targets: this.slingRubber2,
      scaleX: this.slingRubber2Scale.x,
      scaleY: this.slingRubber2Scale.y,
      duration: 100,
      ease: Phaser.Math.Easing.Linear,
      onComplete: () => {
        this.slingRubber2.rotation = this.slingRubber2OrigRotation;
      }
    });  

  }

  moveAnswerImg = async(isMoveRight) => {

    return new Promise(resolve => {

      const targetScrollX = isMoveRight
        ? BaseScene.backGround.getBounds().right - this.cameras.main.width
        : BaseScene.backGround.getBounds().left;
  
      const tweenConfig = {
        targets: this.cameras.main,
        props: {
          scrollX: { value: targetScrollX, duration: 3500, ease: 'Linear' }
        },
        onComplete: () => {

          this.cameraScrollX = this.cameras.main.scrollX;

          resolve(true)

        }
      };
    
      this.tweens.add(tweenConfig);

    });

  }

  setSelectedAnswerIndex(index){
    this.selectedAnswerIndex = index;
  }
  
}
  
  export default PlayScene;