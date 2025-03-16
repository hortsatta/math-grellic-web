import { getActivityBySlugAndCurrentStudentUser } from './api/data.api';

import BaseScene from './BaseScene';

import background from './assets/background.jpg';

import notificationBanner from './assets/notificationbanner.svg'

//ball
import ball1 from './assets/Ball/ball_1.svg';

import ball2 from './assets/Ball/ball_2.svg';

import ball3 from './assets/Ball/ball_3.svg';

import ball4 from './assets/Ball/ball_4.svg';

import ball5 from './assets/Ball/ball_5.svg';

//ring
import ring_2 from './assets/ring/ring_2.svg';

import ring_3 from './assets/ring/ring_3.svg';

import ring_4 from './assets/ring/ring_4.svg';

import ring_5 from './assets/ring/ring_5.svg';

import ring_6 from './assets/ring/ring_6.svg';

import correct_ring from './assets/ring/correct_ring.svg';

import wrong_ring from './assets/ring/wrong_ring.svg';

//basketball board
import board_1 from './assets/basketball_board/board_1.svg';

import board_2 from './assets/basketball_board/board_2.svg';

import board_3 from './assets/basketball_board/board_3.svg';

import board_4 from './assets/basketball_board/board_4.svg';

import board_5 from './assets/basketball_board/board_5.svg';

import board_6 from './assets/basketball_board/board_6.svg';

import correct_board from './assets/basketball_board/correct_board.svg';

import wrong_board from './assets/basketball_board/wrong_board.svg';

//question bg
import question_bg from './assets/question/question_bg.png';

//Menu
import difficulty_menu from './assets/menu/difficulty_menu.png';

import easy_btn from './assets/menu/easy_btn.png';

import average_btn from './assets/menu/average_btn.png';

import hard_btn from './assets/menu/hard_btn.png';

//font
import customFont from './assets/font/body-400.woff2';

//Audio

import backgroundAudioMP3 from './assets/audio/backgroundAudio.mp3';
import backgroundAudioOGG from './assets/audio/backgroundAudio.ogg';
import backgroundAudioM4A from './assets/audio/backgroundAudio.m4a';

import ballShotAudioMP3 from './assets/audio/ballShotAudio.mp3';
import ballShotAudioOGG from './assets/audio/ballShotAudio.ogg';
import ballShotAudioM4A from './assets/audio/ballShotAudio.m4a';

import clickAudioMP3 from './assets/audio/clickAudio.mp3';
import clickAudioOGG from './assets/audio/clickAudio.ogg';
import clickAudioM4A from './assets/audio/clickAudio.m4a';

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

    this.load.audio('ballShotAudio', [
      ballShotAudioMP3,
      ballShotAudioOGG,
      ballShotAudioM4A
    ]);

    this.load.audio('clickAudio', [
      clickAudioMP3,
      clickAudioOGG,
      clickAudioM4A
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

    //background
    this.load.image('background', background);

    //ball
    this.load.svg('ball1', ball1);

    this.load.svg('ball2', ball2);

    this.load.svg('ball3', ball3);

    this.load.svg('ball4', ball4);

    this.load.svg('ball5', ball5);

    //board
    this.load.svg('board_1', board_1);

    this.load.svg('board_2', board_2);

    this.load.svg('board_3', board_3);

    this.load.svg('board_4', board_4);

    this.load.svg('board_5', board_5);

    this.load.svg('board_6', board_6);

    this.load.svg('correct_board', correct_board);

    this.load.svg('wrong_board', wrong_board);

    //ring
    this.load.svg('ring_2', ring_2);

    this.load.svg('ring_3', ring_3);

    this.load.svg('ring_4', ring_4);

    this.load.svg('ring_5', ring_5);

    this.load.svg('ring_6', ring_6);

    this.load.svg('correct_ring', correct_ring);

    this.load.svg('wrong_ring', wrong_ring);

    //question
    this.load.image('question_bg', question_bg);

    //menu
    this.load.image('difficulty_menu', difficulty_menu);

    this.load.image('easy_btn', easy_btn);

    this.load.image('average_btn', average_btn);

    this.load.image('hard_btn', hard_btn);

    //notificationBanner
    this.load.svg('notificationBanner', notificationBanner);

    //font
    (async () => {
      await this.loadFont('GT Walsheim Pro', customFont);
    })();

  }
  
  create = async () => {

    this.scene.start('NotificationBannerScene');

    await this.waitForBannerSceneReady();

    await this.checkInternetConnectionBanner();

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