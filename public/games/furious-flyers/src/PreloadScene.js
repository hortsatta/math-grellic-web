import { getActivityBySlugAndCurrentStudentUser } from './api/data.api';

import bg from './assets/angrybirdbg.png';

import ground from './assets/angrybirdground.png';

import floorbg from './assets/floorbg.svg';

import question_bg from './assets/QuestionScene/question_bg.svg';

import answer_bg from './assets/QuestionScene/answer_bg.svg';

import kingcat from './assets/king_cat.png';

import bird from './assets/bird.png';

import slingShot from './assets/sling.png';

import slingRubber from './assets/slingRubber.png';

import bush from './assets/bush.png';

import BaseScene from './BaseScene';

import difficulty_menu from './assets/menu/difficulty_menu.png';

import easy_btn from './assets/menu/easy_btn.png';

import average_btn from './assets/menu/average_btn.png';

import hard_btn from './assets/menu/hard_btn.png';

import notificationBanner from './assets/notificationbanner.svg';

import customFont from './assets/font/body-400.woff2';

//Audio
import backgroundAudioMP3 from './assets/audio/backgroundAudio.mp3';
import backgroundAudioOGG from './assets/audio/backgroundAudio.ogg';
import backgroundAudioM4A from './assets/audio/backgroundAudio.m4a';

import slingShotStretchAudioMP3 from './assets/audio/slingShotStretchAudio.mp3';
import slingShotStretchAudioOGG from './assets/audio/slingShotStretchAudio.ogg';
import slingShotStretchAudioM4A from './assets/audio/slingShotStretchAudio.m4a';

import slingShotReleaseAudioMP3 from './assets/audio/slingShotReleaseAudio.mp3';
import slingShotReleaseAudioOGG from './assets/audio/slingShotReleaseAudio.ogg';
import slingShotReleaseAudioM4A from './assets/audio/slingShotReleaseAudio.m4a';

import correctAnswerAudioMP3 from './assets/audio/correctAnswerAudio.mp3';
import correctAnswerAudioOGG from './assets/audio/correctAnswerAudio.ogg';
import correctAnswerAudioM4A from './assets/audio/correctAnswerAudio.m4a';

import wrongAnswerAudioMP3 from './assets/audio/wrongAnswerAudio.mp3';
import wrongAnswerAudioOGG from './assets/audio/wrongAnswerAudio.ogg';
import wrongAnswerAudioM4A from './assets/audio/wrongAnswerAudio.m4a';

class PreloadScene extends BaseScene{

  constructor(){
    super('PreloadScene');
  }

  preload () {

    //Audio
    this.load.audio('backgroundAudio', [
      backgroundAudioMP3,
      backgroundAudioOGG,
      backgroundAudioM4A
    ]);

    this.load.audio('slingShotStretchAudio', [
      slingShotStretchAudioMP3,
      slingShotStretchAudioOGG,
      slingShotStretchAudioM4A
    ]);

    this.load.audio('slingShotReleaseAudio', [
      slingShotReleaseAudioMP3,
      slingShotReleaseAudioOGG,
      slingShotReleaseAudioM4A
    ]);

    this.load.audio('correctAnswerAudio', [
      correctAnswerAudioMP3,
      correctAnswerAudioOGG,
      correctAnswerAudioM4A
    ]);

    this.load.audio('wrongAnswerAudio', [
      wrongAnswerAudioMP3,
      wrongAnswerAudioOGG,
      wrongAnswerAudioM4A
    ]);
    
    //PlayScene
    this.load.image('background', bg);

    this.load.svg('floorbg', floorbg);

    this.load.image('ground', ground);

    this.load.image('bush', bush);

    this.load.spritesheet("kingcat", kingcat, {
      frameWidth: 286,
      frameHeight: 252
    });

    this.load.spritesheet('bird', bird, {
      frameWidth: 220, 
      frameHeight: 222
    });

    this.load.image('slingRubber', slingRubber);

    this.load.image('slingShot', slingShot);

    this.load.image('difficulty_menu', difficulty_menu);

    this.load.image('easy_btn', easy_btn);

    this.load.image('average_btn', average_btn);

    this.load.image('hard_btn', hard_btn);

    //QuestionScene

    this.load.svg('question_bg', question_bg);

    this.load.svg('answer_bg', answer_bg);

    this.load.svg('notificationBanner', notificationBanner);

    (async () => {
      await this.loadFont('GT Walsheim Pro', customFont);
    })();

  }

  create = async () => {

    this.scene.start('NotificationBannerScene');

    await this.waitForBannerSceneReady();

    await this.checkInternetConnectionBanner(); //check and wait for internet connection

    const data = await getActivityBySlugAndCurrentStudentUser();

    console.log("data: ", data);

    this.setServerData(data);

    this.setSortedQandA();

    this.scene.start('PlayScene')

  }

  waitForBannerSceneReady = async () => {

    return new Promise((resolve) => {

      const notificationBannerScene = this.scene.get('NotificationBannerScene');

      notificationBannerScene.events.once('bannerSceneReady', () => {
        resolve(); 
      });

    });

  }

  loadFont = async (name, url) => {
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
  };
  
}

export default PreloadScene;