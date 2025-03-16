import BaseScene from './BaseScene';

import { scaleBasedOnResolution, scaleBasedOnImageByPercent, positionBasedOnResolution, toPercent, calculateDifference, calculateProduct, calculateSum } from './Utils.js';

import { holderInitialPosInfo, holder2ndPosInfo } from './PositionsInfo';

import { 
  road1CoordinatesPct,
  road2CoordinatesPct,
  road3CoordinatesPct,
  road4CoordinatesPct,
  r4RightStripeContainerCoordsPct,
  r3RightStripeContainerCoordsPct,
  r2RightStripeContainerCoordsPct,
  r1RightStripeContainerCoordsPct,
  r1LeftStripeContainerCoordsPct,
  r2LeftStripeContainerCoordsPct, 
  r3LeftStripeContainerCoordsPct,
  r4LeftStripeContainerCoordsPct,
  road1RightBlackStripesInfoPct,
  road2RightBlackStripesInfoPct,
  road3RightBlackStripesInfoPct,
  road4RightBlackStripesInfoPct,
  road1LeftBlackStripesInfoPct, 
  road2LeftBlackStripesInfoPct,
  road3LeftBlackStripesInfoPct,
  road4LeftBlackStripesInfoPct,
  road1RightWhiteStripesInfoPct,
  road2RightWhiteStripesInfoPct,
  road3RightWhiteStripesInfoPct,
  road4RightWhiteStripesInfoPct,
  road1LeftWhiteStripesInfoPct, 
  road2LeftWhiteStripesInfoPct,
  road3LeftWhiteStripesInfoPct,
  road4LeftWhiteStripesInfoPct,
  road1RightOffsetInfoPct,
  road2RightOffsetInfoPct,
  road3RightOffsetInfoPct,
  road4RightOffsetInfoPct,
  road1LeftOffsetInfoPct,
  road2LeftOffsetInfoPct,
  road3LeftOffsetInfoPct, 
  road4LeftOffsetInfoPct,
  r1RightStripeContainerWidthPct,
  r2RightStripeContainerWidthPct,
  r3RightStripeContainerWidthPct,
  r4RightStripeContainerWidthPct,
  r1LeftStripeContainerWidthPct,
  r2LeftStripeContainerWidthPct,
  r3LeftStripeContainerWidthPct,
  r4LeftStripeContainerWidthPct
} from './PositionsInfo';

class PlayScene extends BaseScene{

  constructor(){

    super('PlayScene');

    this.roadAnimations = [];

    this.initialCarPosition = 0;

    this.roadIndex = 0;

    this.roadCount = 0;

    this.roadAnim = null;

    this.backGround = null;

    this.upArrow = null;

    this.rightArrow = null;
    
    this.leftArrow = null;

    this.car = null;

    this.blackStripeIndex = 0;

    this.stripeAnimation = null;

    this.roadCoordsArr = [];

    this.leftStartContainerCoordinatesArr = [];
    this.rightStartContainerCoordinatesArr = [];

    this.roadLeftStripeContainerWidthInfoArr = [];
    this.roadRightStripeContainerWidthInfoArr = [];

    this.leftBlackStripesInfoArr = [];
    this.rightBlackStripesInfoArr = [];

    this.leftWhiteStripesInfoArr = [];
    this.rightWhiteStripesInfoArr = [];

    this.leftOffsetStripesInfoArr = [];
    this.rightOffsetStripesInfoArr = [];

    this.leftCurrentContainerCoord = {};
    this.rightCurrentContainerCoord = {};

    this.roadGfx = null;

    this.roadTransitionTween = null;

  }
  
  create() {

    super.create();

    this.setPlaySceneRef(this);

    this.convertPercentToAbsValue();

    this.setInitialRoadAndProperties();

    this.setCarGraphics();

    this.scene.launch('QuestionScene');

  }

  setCarGraphics(){

    this.car = this.physics.add
      .image(this.initialCarPosition, BaseScene.windowHeight * .97, 'car')
      .setOrigin(.5, 1);

    this.car.setDepth(1);

    const scaleX = BaseScene.windowWidth * .12 / this.car.width;
    const scaleY = BaseScene.windowHeight * .12 / this.car.height;
  
    this.car.setScale(scaleX, scaleY);

  }

  setInitialCarPosition(){

    const roadLaneIndexPercent = 0.125;

    this.initialCarPosition = BaseScene.questionSceneRef.answerContainerStartingCoordinate
      + BaseScene.questionSceneRef.answerContainerTargetWidth 
      * roadLaneIndexPercent;

    this.car.x = this.initialCarPosition;
    this.car.y = BaseScene.windowHeight * .97;

  }

  convertPercentToAbsValue(){

    BaseScene.roadStripeAnimDuration = 500;

    this.roadCoordsArr.push(
      this.convertObjectPercentCoordinatesToPixels(road1CoordinatesPct)
    );
    this.roadCoordsArr.push(
      this.convertObjectPercentCoordinatesToPixels(road2CoordinatesPct)
    );
    this.roadCoordsArr.push(
      this.convertObjectPercentCoordinatesToPixels(road3CoordinatesPct)
    );
    this.roadCoordsArr.push(
      this.convertObjectPercentCoordinatesToPixels(road4CoordinatesPct)
    );

    //Left container width info
    this.roadLeftStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r1LeftStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadLeftStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r2LeftStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadLeftStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r3LeftStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadLeftStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r4LeftStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    //Right container width info
    this.roadRightStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r1RightStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadRightStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r2RightStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadRightStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r3RightStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    this.roadRightStripeContainerWidthInfoArr.push(
      this.convertPercentageToValue(
        r4RightStripeContainerWidthPct,
        BaseScene.windowWidth
      )
    );

    //left start container coordinates
    this.leftStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r1LeftStripeContainerCoordsPct)
    );
    this.leftStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r2LeftStripeContainerCoordsPct)
    );
    this.leftStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r3LeftStripeContainerCoordsPct)
    );
    this.leftStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r4LeftStripeContainerCoordsPct)
    );

    //right start container coordinates
    this.rightStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r1RightStripeContainerCoordsPct)
    );
    this.rightStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r2RightStripeContainerCoordsPct)
    );
    this.rightStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r3RightStripeContainerCoordsPct)
    );
    this.rightStartContainerCoordinatesArr.push(
      this.convertObjectPercentCoordinatesToPixels(r4RightStripeContainerCoordsPct)
    );

  }

  setInitialRoadAndProperties(){

    this.roadGfx = this.add.graphics();
    this.leftStripesContainerGfx = this.add.graphics();
    this.rightStripesContainerGfx = this.add.graphics();
    this.leftBlackStripeGfx = this.add.graphics();
    this.rightBlackStripeGfx = this.add.graphics();

    this.drawRoadGfx(this.roadCoordsArr[this.roadIndex]);

    //start coordinates
    const {
      currentRightStartContainerCoordinate: r1RightStartContainerCoordinate,
      currentLeftStartContainerCoordinate: r1LeftStartContainerCoordinate
    } = this.getStartStripeContainerCoord(this.roadIndex);

    const {
      currentRightStartContainerCoordinate: r2RightStartContainerCoordinate,
      currentLeftStartContainerCoordinate: r2LeftStartContainerCoordinate
    } = this.getStartStripeContainerCoord(1);

    const {
      currentRightStartContainerCoordinate: r3RightStartContainerCoordinate,
      currentLeftStartContainerCoordinate: r3LeftStartContainerCoordinate
    } = this.getStartStripeContainerCoord(2);

    const {
      currentRightStartContainerCoordinate: r4RightStartContainerCoordinate,
      currentLeftStartContainerCoordinate: r4LeftStartContainerCoordinate
    } = this.getStartStripeContainerCoord(3);

    //container width
    const {
      currentRightContainerWidth: r1RightContainerWidth,
      currentLeftContainerWidth: r1LeftContainerWidth
    } = this.getStripeContainerWidthInfo(this.roadIndex);

    const {
      currentRightContainerWidth: r2RightContainerWidth,
      currentLeftContainerWidth: r2LeftContainerWidth
    } = this.getStripeContainerWidthInfo(1);

    const {
      currentRightContainerWidth: r3RightContainerWidth,
      currentLeftContainerWidth: r3LeftContainerWidth
    } = this.getStripeContainerWidthInfo(2);

    const {
      currentRightContainerWidth: r4RightContainerWidth,
      currentLeftContainerWidth: r4LeftContainerWidth
    } = this.getStripeContainerWidthInfo(3);

    //container coord
    const r1LeftContainerCoord = this.createLeftStripeContainerCoords(
      r1LeftContainerWidth.bottomWidth,
      r1LeftContainerWidth.topWidth,
      r1LeftStartContainerCoordinate
    );

    const r2LeftContainerCoord = this.createLeftStripeContainerCoords(
      r2LeftContainerWidth.bottomWidth,
      r2LeftContainerWidth.topWidth,
      r2LeftStartContainerCoordinate
    );

    const r3LeftContainerCoord = this.createLeftStripeContainerCoords(
      r3LeftContainerWidth.bottomWidth,
      r3LeftContainerWidth.topWidth,
      r3LeftStartContainerCoordinate
    );

    const r4LeftContainerCoord = this.createLeftStripeContainerCoords(
      r4LeftContainerWidth.bottomWidth,
      r4LeftContainerWidth.topWidth,
      r4LeftStartContainerCoordinate
    );

    const r1RightContainerCoord = this.createRightStripeContainerCoords(
      r1RightContainerWidth.bottomWidth,
      r1RightContainerWidth.topWidth,
      r1RightStartContainerCoordinate
    );

    const r2RightContainerCoord = this.createRightStripeContainerCoords(
      r2RightContainerWidth.bottomWidth,
      r2RightContainerWidth.topWidth,
      r2RightStartContainerCoordinate
    );

    const r3RightContainerCoord = this.createRightStripeContainerCoords(
      r3RightContainerWidth.bottomWidth,
      r3RightContainerWidth.topWidth,
      r3RightStartContainerCoordinate
    );

    const r4RightContainerCoord = this.createRightStripeContainerCoords(
      r4RightContainerWidth.bottomWidth,
      r4RightContainerWidth.topWidth,
      r4RightStartContainerCoordinate
    );

    const r1LeftDiagonalHeight = this.getTotalDiagonalHeight(r1LeftContainerCoord);
    const r2LeftDiagonalHeight = this.getTotalDiagonalHeight(r2LeftContainerCoord);
    const r3LeftDiagonalHeight = this.getTotalDiagonalHeight(r3LeftContainerCoord);
    const r4LeftDiagonalHeight = this.getTotalDiagonalHeight(r4LeftContainerCoord);

    const r1RightDiagonalHeight = this.getTotalDiagonalHeight(r1RightContainerCoord);
    const r2RightDiagonalHeight = this.getTotalDiagonalHeight(r2RightContainerCoord);
    const r3RightDiagonalHeight = this.getTotalDiagonalHeight(r3RightContainerCoord);
    const r4RightDiagonalHeight = this.getTotalDiagonalHeight(r4RightContainerCoord);

    //right black stripes
    this.rightBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1RightBlackStripesInfoPct, 
        r1RightDiagonalHeight
      )
    );

    this.rightBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2RightBlackStripesInfoPct, 
        r2RightDiagonalHeight
      )
    );

    this.rightBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3RightBlackStripesInfoPct, 
        r3RightDiagonalHeight
      )
    );

    this.rightBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4RightBlackStripesInfoPct, 
        r4RightDiagonalHeight
      )
    );

    //left black stripes
    this.leftBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1LeftBlackStripesInfoPct, 
        r1LeftDiagonalHeight
      )
    );

    this.leftBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2LeftBlackStripesInfoPct, 
        r2LeftDiagonalHeight
      )
    );

    this.leftBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3LeftBlackStripesInfoPct, 
        r3LeftDiagonalHeight
      )
    );

    this.leftBlackStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4LeftBlackStripesInfoPct, 
        r4LeftDiagonalHeight
      )
    );

    //right white stripe
    this.rightWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1RightWhiteStripesInfoPct, 
        r1RightDiagonalHeight
      )
    );
    this.rightWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2RightWhiteStripesInfoPct, 
        r2RightDiagonalHeight
      )
    );
    this.rightWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3RightWhiteStripesInfoPct, 
        r3RightDiagonalHeight
      )
    );
    this.rightWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4RightWhiteStripesInfoPct, 
        r4RightDiagonalHeight
      )
    );

    //left white stripe
    this.leftWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1LeftWhiteStripesInfoPct, 
        r1LeftDiagonalHeight
      )
    );

    this.leftWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2LeftWhiteStripesInfoPct, 
        r2LeftDiagonalHeight
      )
    );

    this.leftWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3LeftWhiteStripesInfoPct, 
        r3LeftDiagonalHeight
      )
    );

    this.leftWhiteStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4LeftWhiteStripesInfoPct, 
        r4LeftDiagonalHeight
      )
    );

    //right offset
    this.rightOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1RightOffsetInfoPct, 
        r1RightDiagonalHeight
      )
    );

    this.rightOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2RightOffsetInfoPct, 
        r2RightDiagonalHeight
      )
    );

    this.rightOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3RightOffsetInfoPct, 
        r3RightDiagonalHeight
      )
    );

    this.rightOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4RightOffsetInfoPct, 
        r4RightDiagonalHeight
      )
    );

    //left offset
    this.leftOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road1LeftOffsetInfoPct, 
        r1LeftDiagonalHeight
      )
    );

    this.leftOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road2LeftOffsetInfoPct, 
        r2LeftDiagonalHeight
      )
    );

    this.leftOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road3LeftOffsetInfoPct, 
        r3LeftDiagonalHeight
      )
    );

    this.leftOffsetStripesInfoArr.push(
      this.convert2DArrayPercentToPixels(
        road4LeftOffsetInfoPct, 
        r4LeftDiagonalHeight
      )
    );

    this.leftCurrentContainerCoord = r1LeftContainerCoord;

    this.rightCurrentContainerCoord = r1RightContainerCoord;

    this.createLeftStripesContainerGfx(this.leftCurrentContainerCoord, 0xffffff, 1);

    this.createRightStripesContainerGfx(this.rightCurrentContainerCoord, 0xffffff, 1);

    this.startRoadStripeAnimation();

  }

  drawRoadGfx(roadCoordinate){

    this.roadGfx.clear();
    this.roadGfx.fillStyle(0xD3D3D3, 1);
    this.roadGfx.beginPath();
    this.roadGfx.moveTo(roadCoordinate.x1, roadCoordinate.y1);
    this.roadGfx.lineTo(roadCoordinate.x2, roadCoordinate.y2);
    this.roadGfx.lineTo(roadCoordinate.x3, roadCoordinate.y3);
    this.roadGfx.lineTo(roadCoordinate.x4, roadCoordinate.y4);
    this.roadGfx.closePath();
    this.roadGfx.fillPath();

  }

  createLeftStripeContainerCoords(endDistance, startDistance, targetCoordinate){
    return {
      x1: targetCoordinate.x2 - endDistance, //bottom left
      y1: targetCoordinate.y2,
      x2: targetCoordinate.x2, //bottom right
      y2: targetCoordinate.y2,
      x3: targetCoordinate.x3, //top right
      y3: targetCoordinate.y3,
      x4: targetCoordinate.x3 - startDistance, //top left
      y4: targetCoordinate.y3
    }
  }

  createRightStripeContainerCoords(endDistance, startDistance, targetCoordinate){
    return {
      x1: targetCoordinate.x1, //bottom left
      y1: targetCoordinate.y1,
      x2: targetCoordinate.x1 + endDistance, //bottom right
      y2: targetCoordinate.y1,
      x3: targetCoordinate.x4 + startDistance, //top right
      y3: targetCoordinate.y4,
      x4: targetCoordinate.x4, //top left
      y4: targetCoordinate.y4
    }
  }

  createLeftStripesContainerGfx(targetCoordinates, color, alpha){
    
    this.leftStripesContainerGfx.clear();
  
    // Draw the white background
    this.leftStripesContainerGfx.fillStyle(color, alpha);
    this.leftStripesContainerGfx.beginPath();
    this.leftStripesContainerGfx.moveTo(targetCoordinates.x1, targetCoordinates.y1);
    this.leftStripesContainerGfx.lineTo(targetCoordinates.x2, targetCoordinates.y2);
    this.leftStripesContainerGfx.lineTo(targetCoordinates.x3, targetCoordinates.y3);
    this.leftStripesContainerGfx.lineTo(targetCoordinates.x4, targetCoordinates.y4);
    this.leftStripesContainerGfx.closePath();
    this.leftStripesContainerGfx.fillPath(); 

  }

  createRightStripesContainerGfx(targetCoordinates, color, alpha){
    
    this.rightStripesContainerGfx.clear();
  
    // Draw the white background
    this.rightStripesContainerGfx.fillStyle(color, alpha);
    this.rightStripesContainerGfx.beginPath();
    this.rightStripesContainerGfx.moveTo(targetCoordinates.x1, targetCoordinates.y1);
    this.rightStripesContainerGfx.lineTo(targetCoordinates.x2, targetCoordinates.y2);
    this.rightStripesContainerGfx.lineTo(targetCoordinates.x3, targetCoordinates.y3);
    this.rightStripesContainerGfx.lineTo(targetCoordinates.x4, targetCoordinates.y4);
    this.rightStripesContainerGfx.closePath();
    this.rightStripesContainerGfx.fillPath(); 

  }

  drawBlackStripes(stripeInfo) {

    let {
      containerCoordinates, 
      blackStripeHeightArr, 
      whiteStripeHeightArr, 
      offsetBottom, 
      diagonalHeight,
      isLeftStripe
    } = stripeInfo;

    const graphics = isLeftStripe ? this.leftBlackStripeGfx : this.rightBlackStripeGfx;

    graphics.clear();

    let blackStripeIndex  = 0

    let whiteStripeIndex = 0;

    while (offsetBottom <= diagonalHeight) {
        
      const ratio = offsetBottom / diagonalHeight;

      const blackStripeHeight = blackStripeHeightArr[blackStripeIndex];

      const whiteStripeHeight = whiteStripeHeightArr[whiteStripeIndex];

      // Interpolate coordinates for the bottom edge of the stripe
      const bottomLeftX = Phaser.Math.Linear(containerCoordinates.x1, containerCoordinates.x4, ratio); //ok
      const bottomLeftY = Phaser.Math.Linear(containerCoordinates.y1, containerCoordinates.y4, ratio); //ok
      const bottomRightX = Phaser.Math.Linear(containerCoordinates.x2, containerCoordinates.x3, ratio); //ok
      const bottomRightY = Phaser.Math.Linear(containerCoordinates.y2, containerCoordinates.y3, ratio); //ok
      // Interpolate coordinates for the top edge of the stripe
      const topYOffset = Math.min(offsetBottom + blackStripeHeight, diagonalHeight);
      const topLeftX = Phaser.Math.Linear(containerCoordinates.x1, containerCoordinates.x4, topYOffset / diagonalHeight); //ok
      const topLeftY = Phaser.Math.Linear(containerCoordinates.y1, containerCoordinates.y4, topYOffset / diagonalHeight); //ok
      const topRightX = Phaser.Math.Linear(containerCoordinates.x2, containerCoordinates.x3, topYOffset / diagonalHeight); //ok
      const topRightY = Phaser.Math.Linear(containerCoordinates.y2, containerCoordinates.y3, topYOffset / diagonalHeight); //ok
      // Draw the black stripe with the adjusted height
      
      graphics.fillStyle(0x000000, .8);
      graphics.beginPath();
      graphics.moveTo(bottomLeftX, bottomLeftY); // Bottom left
      graphics.lineTo(bottomRightX, bottomRightY); // Bottom right
      graphics.lineTo(topRightX, topRightY); // Top right
      graphics.lineTo(topLeftX, topLeftY); // Top left
      graphics.closePath();
      graphics.fillPath();

      offsetBottom += blackStripeHeight + whiteStripeHeight;

      blackStripeIndex  += 1;

      if (blackStripeIndex  > blackStripeHeightArr.length - 1) {
        blackStripeIndex  = 0;
      }

      whiteStripeIndex += 1;

      if (whiteStripeIndex > whiteStripeHeightArr.length - 1) {
        whiteStripeIndex = 0;
      }
    }

  }

  startRoadStripeAnimation(){

    let interval = 400;

    this.stripeAnimation = this.time.addEvent({
      delay: interval, 
      loop: true,
      callback: () => {
        this.drawBlackStripes(
          this.convertStripesInfoToObj(
            this.leftCurrentContainerCoord, 
            this.leftBlackStripesInfoArr[this.roadIndex][this.blackStripeIndex], 
            this.leftWhiteStripesInfoArr[this.roadIndex][this.blackStripeIndex], 
            this.leftOffsetStripesInfoArr[this.roadIndex][this.blackStripeIndex],
            this.getTotalDiagonalHeight(this.leftCurrentContainerCoord),
            true
          ) 
        );

        this.drawBlackStripes(
          this.convertStripesInfoToObj(
            this.rightCurrentContainerCoord, 
            this.rightBlackStripesInfoArr[this.roadIndex][this.blackStripeIndex], 
            this.rightWhiteStripesInfoArr[this.roadIndex][this.blackStripeIndex], 
            this.rightOffsetStripesInfoArr[this.roadIndex][this.blackStripeIndex],
            this.getTotalDiagonalHeight(this.rightCurrentContainerCoord)
          )
        );

        this.getNextStripeIndex();
      }
    });

  }

  setKeyboardEvents(){

    this.input.keyboard.on('keydown',  (event) => { 

      const canMoveCar = BaseScene.questionSceneRef.holderPositioned;

      if(
        canMoveCar 
        && (!this.roadTransitionTween 
        || !this.roadTransitionTween.isPlaying())
      ){
        if (event.key === "ArrowLeft") {
          this.moveCarToLeft();
        } else if (event.key === "ArrowRight") {
          this.moveCarToRight();
        } else if (event.key === "ArrowUp") {
          this.accelerateCar();
        }
      }
  
    });

  }

  moveCarToRight(){

    if (this.roadIndex < this.roadCoordsArr.length - 1){

      this.pauseTimer();

      const targetRoadIndex = this.roadIndex + 1;

      const currentRoadCoordinate = { ...this.roadCoordsArr[this.roadIndex] };
      const targetRoadCoordinate = this.roadCoordsArr[targetRoadIndex];

      this.transitionRoad(currentRoadCoordinate, targetRoadCoordinate, +1);
 
      this.transitionStripeCoordinates(this.getTransitionStripeContainerInfo(1), +1);

      BaseScene.questionSceneRef.moveContainerSideways(targetRoadIndex);

      this.moveCar(targetRoadIndex);

    }
    
  }

  moveCarToLeft(){

    if (this.roadIndex > 0){

      this.pauseTimer();

      const targetRoadIndex = this.roadIndex - 1;

      const currentRoadCoordinate = { ...this.roadCoordsArr[this.roadIndex]};
      const targetRoadCoordinate = this.roadCoordsArr[targetRoadIndex];

      this.transitionRoad(currentRoadCoordinate, targetRoadCoordinate, -1);

      this.transitionStripeCoordinates(this.getTransitionStripeContainerInfo(-1), -1);

      BaseScene.questionSceneRef.moveContainerSideways(targetRoadIndex);

      this.moveCar(targetRoadIndex);

    }

  }

  moveCar(index){

    const targetCoordinate = BaseScene.windowWidth * holder2ndPosInfo[index].startPoint;

    const targetLane = index * 25;

    const targetLaneMidPoint = targetLane + 12.5;

    const intermediatePoint = BaseScene.questionSceneRef.answerContainerTargetWidth * toPercent(targetLaneMidPoint);

    const targetCarPosition = targetCoordinate + intermediatePoint;

    this.tweens.add({
      targets: this.car,
      x: targetCarPosition,
      duration: BaseScene.roadStripeAnimDuration,
      ease: 'Linear',
      onComplete: () => {
        this.startTimer();
      }
    });

  }

  accelerateCar(){

    BaseScene.questionSceneRef.checkifAnswerIsCorrect(this.roadIndex);

    BaseScene.questionSceneRef.isGamePlayable(this.roadIndex);

  }

  getTransitionStripeContainerInfo(indexTransition){

    const targetRightStartContainerCoordinate = this.rightStartContainerCoordinatesArr[this.roadIndex + indexTransition];
    const targetLeftStartContainerCoordinate = this.leftStartContainerCoordinatesArr[this.roadIndex + indexTransition];

    const targetRightContainerWidth = this.roadRightStripeContainerWidthInfoArr[this.roadIndex + indexTransition];
    const targetLeftContainerWidth = this.roadLeftStripeContainerWidthInfoArr[this.roadIndex + indexTransition];

    const {
      currentRightStartContainerCoordinate : currentRightStartContainerCoordinate,
      currentLeftStartContainerCoordinate : currentLeftStartContainerCoordinate
    } = this.getStartStripeContainerCoord(this.roadIndex);

    const {
      currentRightContainerWidth : currentRightContainerWidth,
      currentLeftContainerWidth : currentLeftContainerWidth
    } = this.getStripeContainerWidthInfo(this.roadIndex)
    
    return {
      currentRightStartContainerCoordinate,
      currentLeftStartContainerCoordinate,
      currentRightContainerWidth,
      currentLeftContainerWidth,
      targetRightStartContainerCoordinate,
      targetLeftStartContainerCoordinate,
      targetRightContainerWidth,
      targetLeftContainerWidth
    };

  }

  getStartStripeContainerCoord(roadIndex){

    const currentRightStartContainerCoordinate = { ...this.rightStartContainerCoordinatesArr[roadIndex] };
    const currentLeftStartContainerCoordinate = { ...this.leftStartContainerCoordinatesArr[roadIndex] };

    return {
      currentRightStartContainerCoordinate,
      currentLeftStartContainerCoordinate
    }

  }

  getStripeContainerWidthInfo(roadIndex){

    const currentRightContainerWidth = { ...this.roadRightStripeContainerWidthInfoArr[roadIndex] };
    const currentLeftContainerWidth = { ...this.roadLeftStripeContainerWidthInfoArr[roadIndex] };

    return {
      currentRightContainerWidth,
      currentLeftContainerWidth
    }

  }

  inBetweenPercentage(valuesArr){

    const percentArr = [];

    for (let i = 0; i < valuesArr.length - 1; i++) {
      
      const firstValue = valuesArr[i];
      const secondValue = valuesArr[i + 1];

      const percentage = (firstValue - secondValue) / firstValue;

      percentArr.push(percentage.toFixed(2));

    }

    return percentArr;
    
  }

  transitionRoad(currentRoadCoordinate, targetRoadCoordinate){

    let roadProgress = -1;

    this.roadTransitionTween = this.tweens.add({
      targets: currentRoadCoordinate,
      x1: targetRoadCoordinate.x1,
      y1: targetRoadCoordinate.y1,
      x2: targetRoadCoordinate.x2,
      y2: targetRoadCoordinate.y2,
      x3: targetRoadCoordinate.x3,
      y3: targetRoadCoordinate.y3,
      x4: targetRoadCoordinate.x4,
      y4: targetRoadCoordinate.y4,
      duration: BaseScene.roadStripeAnimDuration,
      ease: 'Linear',
      onUpdate: (tween) => {

        const currentProgress = parseFloat(tween.progress.toFixed(2));

        if (currentProgress !== roadProgress) {

          this.drawRoadGfx(currentRoadCoordinate);

          roadProgress = currentProgress;
        }
      }
    });

  }

  transitionStripeCoordinates(stripeContainerInfo, roadIndexTransition){

    const {
      currentRightStartContainerCoordinate,
      currentLeftStartContainerCoordinate,
      currentRightContainerWidth,
      currentLeftContainerWidth,
      targetRightStartContainerCoordinate,
      targetLeftStartContainerCoordinate,
      targetRightContainerWidth,
      targetLeftContainerWidth
    } = stripeContainerInfo;

    this.stripeAnimation.paused = true;

    //container width
    const { topWidth: leftCurrentTopWidth, bottomWidth: leftCurrentBottomWidth } = currentLeftContainerWidth;
    const { topWidth: leftTargetTopWidth, bottomWidth: leftTargetBottomWidth } = targetLeftContainerWidth;
    const { topWidth: rightCurrentTopWidth, bottomWidth: rightCurrentBottomWidth } = currentRightContainerWidth;
    const { topWidth: rightTargetTopWidth, bottomWidth: rightTargetBottomWidth } = targetRightContainerWidth;

    //container difference
    const leftTopContainerDifference = Math.abs(leftCurrentTopWidth - leftTargetTopWidth);
    const leftBottomContainerDifference = Math.abs(leftCurrentBottomWidth - leftTargetBottomWidth);
    const rightTopContainerDifference = Math.abs(rightCurrentTopWidth - rightTargetTopWidth);
    const rightBottomContainerDifference = Math.abs(rightCurrentBottomWidth - rightTargetBottomWidth);
    
    //width operation type
    const leftBotWidthOperationType = leftTargetBottomWidth > leftCurrentBottomWidth ? 1 : -1;
    const leftTopWidthOperationType = leftTargetTopWidth > leftCurrentTopWidth ? 1 : -1;
    const rightBotWidthOperationType = rightTargetBottomWidth > rightCurrentBottomWidth ? 1 : -1;
    const rightTopWidthOperationType = rightTargetTopWidth > rightCurrentTopWidth ? 1 : -1;

    let currentBlackStripeIndex = this.blackStripeIndex;

    let elapsedTime = 0;
    const startTime = this.time.now;
    
    const leftStartContainerCoordinates = { ...currentLeftStartContainerCoordinate };
    const rightStartContainerCoordinates = { ...currentRightStartContainerCoordinate };

    const progressThresholds = [.5];

    let nextThresholdIndex = 0; 

    const transitionLeftStripeCoords = {};
    const transitionRightStripeCoords = {};

    const stripeTransitionEvent = this.time.addEvent({
      delay: 16, 
      loop: true,
      callback: () => {
        elapsedTime = this.time.now - startTime;
        const progress = Math.min(elapsedTime / BaseScene.roadStripeAnimDuration, 1);

        transitionLeftStripeCoords.x1 = Phaser.Math.Linear(leftStartContainerCoordinates.x1, targetLeftStartContainerCoordinate.x1, progress);
        transitionLeftStripeCoords.y1 = Phaser.Math.Linear(leftStartContainerCoordinates.y1, targetLeftStartContainerCoordinate.y1, progress);
        transitionLeftStripeCoords.x2 = Phaser.Math.Linear(leftStartContainerCoordinates.x2, targetLeftStartContainerCoordinate.x2, progress);
        transitionLeftStripeCoords.y2 = Phaser.Math.Linear(leftStartContainerCoordinates.y2, targetLeftStartContainerCoordinate.y2, progress);
        transitionLeftStripeCoords.x3 = Phaser.Math.Linear(leftStartContainerCoordinates.x3, targetLeftStartContainerCoordinate.x3, progress);
        transitionLeftStripeCoords.y3 = Phaser.Math.Linear(leftStartContainerCoordinates.y3, targetLeftStartContainerCoordinate.y3, progress);
        transitionLeftStripeCoords.x4 = Phaser.Math.Linear(leftStartContainerCoordinates.x4, targetLeftStartContainerCoordinate.x4, progress);
        transitionLeftStripeCoords.y4 = Phaser.Math.Linear(leftStartContainerCoordinates.y4, targetLeftStartContainerCoordinate.y4, progress);

        transitionRightStripeCoords.x1 = Phaser.Math.Linear(rightStartContainerCoordinates.x1, targetRightStartContainerCoordinate.x1, progress);
        transitionRightStripeCoords.y1 = Phaser.Math.Linear(rightStartContainerCoordinates.y1, targetRightStartContainerCoordinate.y1, progress);
        transitionRightStripeCoords.x2 = Phaser.Math.Linear(rightStartContainerCoordinates.x2, targetRightStartContainerCoordinate.x2, progress);
        transitionRightStripeCoords.y2 = Phaser.Math.Linear(rightStartContainerCoordinates.y2, targetRightStartContainerCoordinate.y2, progress);
        transitionRightStripeCoords.x3 = Phaser.Math.Linear(rightStartContainerCoordinates.x3, targetRightStartContainerCoordinate.x3, progress);
        transitionRightStripeCoords.y3 = Phaser.Math.Linear(rightStartContainerCoordinates.y3, targetRightStartContainerCoordinate.y3, progress);
        transitionRightStripeCoords.x4 = Phaser.Math.Linear(rightStartContainerCoordinates.x4, targetRightStartContainerCoordinate.x4, progress);
        transitionRightStripeCoords.y4 = Phaser.Math.Linear(rightStartContainerCoordinates.y4, targetRightStartContainerCoordinate.y4, progress);

        if (
          nextThresholdIndex < progressThresholds.length &&
          progress >= progressThresholds[nextThresholdIndex] &&
          this.blackStripeIndex === currentBlackStripeIndex
        ) {
          this.getNextStripeIndex();
          currentBlackStripeIndex = this.blackStripeIndex;
          nextThresholdIndex++;
        }

        const leftBotWidthAdditive = parseFloat(progress * leftBottomContainerDifference) * leftBotWidthOperationType;
        const leftTopWidthAdditive = parseFloat(progress * leftTopContainerDifference) * leftTopWidthOperationType;
        const rightBotWidthAdditive = parseFloat(progress * rightBottomContainerDifference) * rightBotWidthOperationType;
        const rightTopWidthAdditive = parseFloat(progress * rightTopContainerDifference) * rightTopWidthOperationType;

        const transitionRightStripeContainerCoords = this.createRightStripeContainerCoords(
          rightCurrentBottomWidth + rightBotWidthAdditive,
          rightCurrentTopWidth + rightTopWidthAdditive,
          transitionRightStripeCoords
        );

        const transitionLeftStripeContainerCoords = this.createLeftStripeContainerCoords(
          leftCurrentBottomWidth + leftBotWidthAdditive,
          leftCurrentTopWidth + leftTopWidthAdditive,
          transitionLeftStripeCoords
        );

        this.createLeftStripesContainerGfx(transitionLeftStripeContainerCoords, 0xffffff, 1);
        this.createRightStripesContainerGfx(transitionRightStripeContainerCoords, 0xffffff, 1);

        const targetRoadIndex = this.roadIndex % this.roadCoordsArr.length;

        const {stripeArr: rightStripeArr, gapArr: rightGapArr, offsetBottom: rightOffsetBottom} = this.modifyStripeInfoToFitDiagonalHeight(
          this.rightBlackStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.rightWhiteStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.rightOffsetStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.getTotalDiagonalHeight(transitionRightStripeContainerCoords)
        );

        const {stripeArr: leftStripeArr, gapArr: leftGapArr, offsetBottom: leftOffsetBottom} = this.modifyStripeInfoToFitDiagonalHeight(
          this.leftBlackStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.leftWhiteStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.leftOffsetStripesInfoArr[targetRoadIndex][this.blackStripeIndex], 
          this.getTotalDiagonalHeight(transitionLeftStripeContainerCoords)
        );

        this.drawBlackStripes(
          this.convertStripesInfoToObj(
            transitionRightStripeContainerCoords, 
            rightStripeArr, 
            rightGapArr, 
            rightOffsetBottom,
            this.getTotalDiagonalHeight(transitionRightStripeContainerCoords),
          ) 
        );

        this.drawBlackStripes(
          this.convertStripesInfoToObj(
            transitionLeftStripeContainerCoords, 
            leftStripeArr, 
            leftGapArr, 
            leftOffsetBottom,
            this.getTotalDiagonalHeight(transitionLeftStripeContainerCoords),
            true
          ) 
        );

        if (progress >= 1) {

          this.roadIndex += roadIndexTransition;
          
          this.leftCurrentContainerCoord = transitionLeftStripeContainerCoords;

          this.rightCurrentContainerCoord = transitionRightStripeContainerCoords;

          this.stripeAnimation.paused = false;

          stripeTransitionEvent.remove();

        }
      }
    });
    
  }

  getNextStripeIndex(){
    this.blackStripeIndex = (this.blackStripeIndex + 1) % this.leftBlackStripesInfoArr[this.roadIndex].length;
  }

  convertStripesInfoToObj(containerCoordinates, blackStripeHeightArr, whiteStripeHeightArr, offsetBottom, diagonalHeight, isLeftStripe){
    return {
      containerCoordinates, 
      blackStripeHeightArr, 
      whiteStripeHeightArr, 
      offsetBottom, 
      diagonalHeight,
      isLeftStripe
    }
  }

  convertObjectPercentCoordinatesToPixels(coordinates){
    for (const key in coordinates) {
      if (key.startsWith("x")) {
        coordinates[key] *= BaseScene.windowWidth;
      } else if (key.startsWith("y")) {
        coordinates[key] *= BaseScene.windowHeight;
      }
    }

    return coordinates;
  }

  convertPercentageToValue(containerWidthObj, scaleFactor){
    for (const key in containerWidthObj) {
      containerWidthObj[key] *= scaleFactor;
    }

    return containerWidthObj;
  }

  modifyStripeInfoToFitDiagonalHeight(stripeArr, gapArr, offsetBottom, diagonalHeight){

    const totalStripeLength = stripeArr.reduce((sum, value) => sum + value, 0);
    const totalGapLength = gapArr.reduce((sum, value) => sum + value, 0);
  
    const scalingFactor = diagonalHeight / (totalStripeLength + totalGapLength + offsetBottom);
  
    const scaledStripeArr = stripeArr.map(value => Math.round(value * scalingFactor));
    const scaledGapArr = gapArr.map(value => Math.round(value * scalingFactor));
    const scaledOffsetBottom = Math.round(offsetBottom * scalingFactor);
  
    return {
      stripeArr: scaledStripeArr,
      gapArr: scaledGapArr,
      offsetBottom: scaledOffsetBottom
    };

  }

  convert2DArrayPercentToPixels(array2D, scaleDimension){
    return Array.isArray(array2D[0])
      ? array2D.map(row => row.map(element => element * scaleDimension)) // 2D array
      : array2D.map(element => element * scaleDimension);               // 1D array
  }

  getTotalDiagonalHeight(coordinates){
    return Phaser.Math.Distance.Between(
      coordinates.x4, coordinates.y4,
      coordinates.x1, coordinates.y1
    );
  }

  displayMenuandCarProperties(){

    this.displayDifficultyLevelMenu();

    if(!BaseScene.deviceHasInputTouch){
      this.setKeyboardEvents();
    }
    else {
      this.displayMobileControls();
      this.setMobileControlEventHandler();
    }

  }

  displayMobileControls(){

    const carBound = this.car.getBounds();

    const carTopBound = carBound.top;

    const controlPositionY = carTopBound + carBound.height * .3;

    const startArrowPosition = positionBasedOnResolution(.04, .95);

    this.leftArrow = this.add
      .sprite(startArrowPosition.xPosition, controlPositionY, 'left_arrow')
      .setOrigin(0, .5)
      .setInteractive();

    scaleBasedOnResolution(this.leftArrow, .05, .12);

    const rightArrowPositionX = this.leftArrow.getBounds().right + this.leftArrow.displayWidth * 1.7;

    this.rightArrow = this.add
      .sprite(rightArrowPositionX, controlPositionY, 'right_arrow')
      .setOrigin(0, .5)
      .setInteractive();

    scaleBasedOnResolution(this.rightArrow, .05, .12);

    const upArrowPosition = positionBasedOnResolution(.95, .95);

    this.upArrow = this.add
      .sprite(upArrowPosition.xPosition, controlPositionY, 'up_arrow')
      .setOrigin(1, .5)
      .setInteractive();

    scaleBasedOnResolution(this.upArrow, .08, .14);

  }

  setMobileControlEventHandler(){

    this.leftArrow.on('pointerdown', () =>{

      const canMoveCar = BaseScene.questionSceneRef.holderPositioned;

      if (
        !BaseScene.isOnMenu
        && canMoveCar
        && (
          !this.roadTransitionTween 
          || !this.roadTransitionTween.isPlaying()
        )
      ){
        this.moveCarToLeft();
      }

    });

    this.rightArrow.on('pointerdown', () =>{

      const canMoveCar = BaseScene.questionSceneRef.holderPositioned;

      if (
        !BaseScene.isOnMenu
        && canMoveCar
        && (
          !this.roadTransitionTween 
          || !this.roadTransitionTween.isPlaying()
        )
      ){
        this.moveCarToRight();
      }

    });

    this.upArrow.on('pointerdown', () =>{

      const canMoveCar = BaseScene.questionSceneRef.holderPositioned;

      if (
        !BaseScene.isOnMenu
        && canMoveCar
        && (
          !this.roadTransitionTween 
          || !this.roadTransitionTween.isPlaying()
        )
      ){
        this.accelerateCar();
      }

    });

  }

}
  
export default PlayScene;