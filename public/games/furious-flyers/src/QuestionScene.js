import BaseScene from './BaseScene';

import { scaleBasedOnResolution, positionBasedOnResolution } from './Utils.js';

import { getQuestionImageUrl } from './api/instance.api.js';

import { randomNumsArray } from './GameHelpers.js';

class QuestionScene extends BaseScene 
{

  constructor() {

    super('QuestionScene');

    this.questionText = null;
    this.questionImg = null;

    this.answersTextArr = [];
    this.answersImgArr = [];

    this.randomNumArray = [];

    this.currentQuestionIndex = 0;

    this.questionDefaultFontSize = 0;
    this.answerDefaultFontSize = 0;

    this.questionTextMaxHeightPercent = .8;

    this.answerTextMaxHeightPercent = .75;

    this.questionTextWordWrap = 0;

    this.answerTextWordWrap = 0;

    this.questionBgHeight = 0;

    this.answerBgHeight = 0;

    this.answer1bg = null;
    this.answer2bg = null;
    this.answer3bg = null;
    this.answer4bg = null;
    this.answersBgArr = [];

  }

  async create() {

    this.setQuestionSceneRef(this);

    this.createQandABgGfx();

    this.setQandAGfxProperties();

    this.createQuestionTextAndImage();

    this.createAnswerTextAndImage();

    await this.loadInitialQandAImages();

    this.displayQandA();
    
    BaseScene.playSceneRef.displayDifficultyMenu();

  }

  createQandABgGfx(){

    this.questionBg = BaseScene.playSceneRef.add
      .image(0, 0, 'question_bg')
      .setOrigin(.5);

    this.answer1bg = BaseScene.playSceneRef.add
      .image(0, 0, 'answer_bg')
      .setOrigin(.5);

    this.answer2bg = BaseScene.playSceneRef.add
      .image(0, 0, 'answer_bg')
      .setOrigin(.5);

    this.answer3bg = BaseScene.playSceneRef.add
      .image(0, 0, 'answer_bg')
      .setOrigin(.5);

    this.answer4bg = BaseScene.playSceneRef.add
      .image(0, 0, 'answer_bg')
      .setOrigin(.5);

    this.questionBg.setDepth(0);

    this.questionBg.visible = false;

    this.answersBgArr.push(this.answer1bg);
    this.answersBgArr.push(this.answer2bg);
    this.answersBgArr.push(this.answer3bg);
    this.answersBgArr.push(this.answer4bg);

  }

  setQandAGfxProperties(){

    //get dimensions
    const backGroundRightBound = BaseScene.backGround.x + BaseScene.backGround.displayWidth;
    const answer4ImgRightBound =  BaseScene.playSceneRef.answer4Img.getTopRight().x;
    const availableWidth = backGroundRightBound - answer4ImgRightBound;

    const setScale = () => {

      //answer bg height
      const topPoint = (BaseScene.playSceneRef.answersArray[1].y - BaseScene.playSceneRef.answersArray[0].y) / 2;
      const bottomPoint =  (BaseScene.playSceneRef.answersArray[2].y - BaseScene.playSceneRef.answersArray[1].y) / 2;
      const answerBgTargetHeight = bottomPoint + topPoint;

      const scaleX = availableWidth / this.answer4bg.width;
      const scaleY =  (answerBgTargetHeight * .93) / this.answer4bg.height;

      //scale
      const widthPercentFactor = .75;

      scaleBasedOnResolution(this.questionBg, 0.45, 0.5, this);

      this.answersBgArr.forEach(element => {
        element.setScale(scaleX * widthPercentFactor, scaleY);
      });

    }

    const setPosition = () => {

      const getCenterPosition  = (answer4ImgRightBound + backGroundRightBound) / 2;

      const questionBGPosition = positionBasedOnResolution(.8, .5, this);
      this.questionBg.setPosition(questionBGPosition.xPosition, questionBGPosition.yPosition);
  
      this.answer1bg.setPosition(getCenterPosition , BaseScene.playSceneRef.answer1Img.getCenter().y);
      this.answer2bg.setPosition(getCenterPosition , BaseScene.playSceneRef.answer2Img.getCenter().y);
      this.answer3bg.setPosition(getCenterPosition , BaseScene.playSceneRef.answer3Img.getCenter().y);
      this.answer4bg.setPosition(getCenterPosition , BaseScene.playSceneRef.answer4Img.getCenter().y);
  
    }

    setScale();
    setPosition();
   
  }

  createQuestionTextAndImage(){

    const questionBGCenterPosition = this.questionBg.getCenter();

    const setInitialQuestionText = () => {
      this.questionText = BaseScene.playSceneRef.add.text(questionBGCenterPosition.x, questionBGCenterPosition.y, "", {
        fontFamily: BaseScene.fontFamilyStyle,
        fontSize: this.questionDefaultFontSize,
        fill: '#000',
        wordWrap: {
          width: this.questionTextWordWrap,
          useAdvancedWrap: true
        }
      });
  
      this.questionText.setOrigin(.5);
    }

    const setQuestionImg = () => {
      this.questionImg = BaseScene.playSceneRef.add
        .image(questionBGCenterPosition.x, questionBGCenterPosition.y, "answer_bg")
        .setOrigin(.5)
        .setScale(0);
    }

    const setProperties = () => {

      const questionBgBounds = this.questionBg.getBounds();

      this.questionBgHeight = questionBgBounds.height;
      
      this.questionDefaultFontSize = questionBgBounds.height * .14;

      this.questionTextWordWrap = questionBgBounds.width * .9;

    }

    setProperties();
    setInitialQuestionText();
    setQuestionImg();

  }

  createAnswerTextAndImage(){

    const setAnswerTextAndImage = () => {

      this.answersBgArr.forEach(element => {

        const answerBgCenterPosition = element.getCenter();
  
        const answerText = BaseScene.playSceneRef.add.text(answerBgCenterPosition.x, answerBgCenterPosition.y, "", {
          fontFamily: BaseScene.fontFamilyStyle,
          fontSize: this.answerDefaultFontSize,
          fill: '#000',
          wordWrap: {
            width: this.answerTextWordWrap,
            useAdvancedWrap: true
          }
        });
  
        answerText.setOrigin(.5);
  
        this.answersTextArr.push(answerText);
  
        const answerImg = BaseScene.playSceneRef.add
          .image(answerBgCenterPosition.x, answerBgCenterPosition.y, "placeholder")
          .setOrigin(.5);
  
        answerImg.setScale(0);

        this.answersImgArr.push(answerImg);
  
      });

    }

    const setProperties = () => {

      const answerBgBounds = this.answer1bg.getBounds();

      this.answerBgHeight = answerBgBounds.height;

      this.answerDefaultFontSize = answerBgBounds.height * .24;

      this.answerTextWordWrap = answerBgBounds.width * .9;

    }

    setProperties();
    setAnswerTextAndImage();
    
  }

  displayQandA(isVisible){

    this.questionBg.visible = isVisible;

    this.questionText.setScale(isVisible ? 1 : 0);

    this.questionImg.setScale(isVisible ? 1 : 0);

    for (let i = 0; i < this.answersBgArr.length; i++) {

      this.answersBgArr[i].visible = isVisible;

      this.answersImgArr[i].setScale(isVisible ? 1 : 0);

      this.answersTextArr[i].setScale(isVisible ? 1 : 0);

    }

    if (isVisible){

      this.setQandAText();

      this.startTimer();

    }

  }

  setQandAText(){

    this.updateQandAData();

    const setQuestionTextAndImage = () => {

      if(this.chosenQandA.textType === "text"){

        if (this.questionText.scale === 0){
          this.questionText.setScale(1);
        }
  
        if (this.questionImg.scale === 1){
          this.questionImg.setScale(0);
        }
  
        this.questionText.text = this.chosenQandA.text
  
        this.questionText.setFontSize(this.questionDefaultFontSize);
  
        this.readjustTextBasedOnContainer(
          this.questionText,
          this.questionBgHeight * this.questionTextMaxHeightPercent,
          this.questionDefaultFontSize,
          this.questionTextWordWrap,
          .05
        )
      //"image"
      } else {
  
        if(this.questionImg.scale === 0){
          this.questionImg.setScale(1);
        }
  
        if(this.questionText.scale === 1){
          this.questionText.setScale(0);
        }
  
        const fileName = this.extractFileName(this.chosenQandA.text);
  
        this.questionImg.setTexture(fileName);
  
        this.questionImg.displayHeight = Math.min(this.questionImg.displayHeight, this.questionBgHeight * this.questionTextMaxHeightPercent);
        this.questionImg.displayWidth = Math.min(this.questionImg.displayWidth, this.questionTextWordWrap);
  
      } 
      
    }

    const setAnswerTextAndImage = async() => {

      for (let i = 0; i < this.answersTextArr.length; i++) {

        const imgElement = this.answersImgArr[i];
        const textElement = this.answersTextArr[i];
  
        if (this.chosenQandA.choices[i].textType === "text"){
  
          if(imgElement.scale > 0){
            imgElement.setScale(0);
          }

          if(textElement.scale === 0){
            textElement.setScale(1);
          }
  
          textElement.setText(this.chosenQandA.choices[i].text);
    
          textElement.setFontSize(this.answerDefaultFontSize);
  
          this.readjustTextBasedOnContainer(
            textElement,
            this.answerBgHeight * this.answerTextMaxHeightPercent,
            this.answerDefaultFontSize,
            this.answerTextWordWrap,
            .05
          )
  
        } else if (this.chosenQandA.choices[i].textType === "image"){
  
          if(textElement.scale > 0){
            textElement.setScale(0);
          }
  
          if(imgElement.scale === 0){
            imgElement.setScale(1);
          }
  
          const fileName = this.extractFileName(this.chosenQandA.choices[i].text);
  
          imgElement.setTexture(fileName);
  
          imgElement.displayHeight = Math.min(imgElement.displayHeight, this.answerBgHeight * this.answerTextMaxHeightPercent);
          imgElement.displayWidth = Math.min(imgElement.displayWidth, this.answerTextWordWrap);
  
        } else if (this.chosenQandA.choices[i].textType === "expression"){

          const textureKey = "expression_" + this.chosenQandA.choices[i].id;

          if(textElement.scale > 0){
            textElement.setScale(0);
          }

          const setImageTexture = () => {
            imgElement.setTexture(textureKey);
            imgElement.setScale(1);
          }

          if(this.textures.exists(textureKey)){
            setImageTexture();
          } else {

            //needed for there is a small delay on latex expression conversion
            if(imgElement.scale > 0){
              imgElement.setScale(0);
            }

            const svgFile = await this.latexToSvg(this.chosenQandA.choices[i].text);

            if (svgFile){
  
              this.convertInlineSvgToPhaserTexture(
                svgFile, 
                textureKey, 
                this.answersBgArr[i].displayWidth, 
                this.answersBgArr[i].displayHeight
              );
    
              // this.textures.on("addtexture", () => {
              //   setImageTexture();
              // });

              const textureCallback = (key) => {
                //console.log("key 1: ", key);
                if (key === textureKey) {
                  //console.log("key 2: ", key);
                  setImageTexture();
                  // ✅ Remove the listener after it's triggered to avoid memory leaks
                  this.textures.off("addtexture", textureCallback);
                }
              };
          
              this.textures.on("addtexture", textureCallback);
  
            }
          }
        }
      }
    }

    setQuestionTextAndImage();
    setAnswerTextAndImage();

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

  checkSelectedAnswer(index) {

    return new Promise((resolve, reject) => {

      if (index === this.chosenQandA.correctAnswerIndex) {

        BaseScene.correctAnswerAudio.play();

        this.updateScore();

        this.answersTextArr[index].setFill('#008000');

      } else {

        BaseScene.wrongAnswerAudio.play();

        this.answersTextArr[index].setFill('#FF0000');

      }

      setTimeout(() => {

        resolve(); 

        this.displayQandA();

        this.resetAnswerProperties();
        
      }, 3000); 

    });

  }

  resetAnswerProperties (){
    this.answersTextArr.forEach(element => {
      element.setFill('#000');
    });
  }

  resetCurrentQuestionIndex(){
    this.currentQuestionIndex = 0;
  }

  readjustTextBasedOnContainer(textReference, maxTextHeight, defaultFontSize, wordWrapWidth, reductionFactor){

    let textHeight = textReference.getBounds().height;

    const fontResizeCount = .95 / reductionFactor; //.95 for 5% minimum font size

    if (textHeight > maxTextHeight){

      for (let i = 1; i < fontResizeCount; i++) {

        const fontSizeReduction = defaultFontSize * (i * reductionFactor);

        const textFontSize = defaultFontSize - fontSizeReduction;

        textReference.setFontSize(textFontSize);

        textHeight = textReference.getBounds().height;

        if (textHeight < maxTextHeight){

          textReference.setWordWrapWidth(wordWrapWidth, true);

          break;

        }

      }

    }

  }

  async callAddSelectedQandA(selectedAnswerIndex){
    this.addSelectedQandA(
      this.chosenQandA.id, 
      this.chosenQandA.choices[selectedAnswerIndex].id
    );
  }

  //load images
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

  loadImageArray(qandAData, options = { sync: false }, callback) {
    this.load.off('filecomplete', loadImage, this);
    this.load.off('loaderror', errorLoadImage, this);

    let imageIndex = 0;
    const imagePathArr = [];

    qandAData.forEach((data) => {
      if (data.textType === "image") {
        imagePathArr.push(data.text);
      }
      imagePathArr.push(...data.choices
        .filter(choice => choice.textType === "image")
        .map(choice => choice.text));
    });

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