import { getActivityBySlugAndCurrentStudentUser } from './api/data.api';

import notificationBanner from './assets/notificationbanner.svg';

import up_arrow from './assets/mobile_control/up_arrow.png';
import left_arrow from './assets/mobile_control/left_arrow.png';
import right_arrow from './assets/mobile_control/right_arrow.png';

import bg from './assets/background.png';

import car from './assets/car.png';

import answer_bg from './assets/Question/answer_bg.png';

import question_bg from './assets/Question/question_bg.png';

import difficulty_menu from './assets/menu/difficulty_menu.png';

import easy_btn from './assets/menu/easy_btn.png';

import average_btn from './assets/menu/average_btn.png';

import hard_btn from './assets/menu/hard_btn.png';

import customFont from './assets/font/body-400.woff2';

import BaseScene from './BaseScene';

//Audio

import backgroundAudioMP3 from './assets/audio/backgroundAudio.mp3';
import backgroundAudioOGG from './assets/audio/backgroundAudio.ogg';
import backgroundAudioM4A from './assets/audio/backgroundAudio.m4a';

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

    //audio
    this.load.audio('backgroundAudio', [
      backgroundAudioMP3,
      backgroundAudioOGG,
      backgroundAudioM4A
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

    //images

    this.load.image('up_arrow', up_arrow);
    this.load.image('left_arrow', left_arrow);
    this.load.image('right_arrow', right_arrow);

    this.load.svg('notificationBanner', notificationBanner);

    this.load.image('background', bg);

    this.load.image('car', car);

    this.load.image('answer_bg', answer_bg);

    this.load.image('question_bg', question_bg);

    this.load.image('difficulty_menu', difficulty_menu);

    this.load.image('easy_btn', easy_btn);

    this.load.image('average_btn', average_btn);

    this.load.image('hard_btn', hard_btn);

    (async () => {
      await this.loadFont('GT Walsheim Pro', customFont);
    })();

  }

  async create() {

    this.scene.start('NotificationBannerScene');

    await this.waitForBannerSceneReady();

    await this.checkInternetConnectionBanner(); //check and wait for internet connection

    const data = await getActivityBySlugAndCurrentStudentUser();

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