import { getActivityBySlugAndCurrentStudentUser, retrieveImage } from './api/data.api';

import BaseScene from './BaseScene';

import textbg from './assets/text_bg.png';

//Room1

import room1bg from './assets/room_1/room1_bg.jpg';

import doorAccess from './assets/door_access.png';

import pencilcase from './assets/room_1/pencil_case.png';

import closebutton from './assets/close_button.png';

//Room2

import room2bg from './assets/room_2/room2_bg.jpg';

import penholder from './assets/room_2/pen_holder.png';

//Room3

import room3bg from './assets/room_3/room3_bg.jpg';

//Room4

import room4bg from './assets/room_4/room4_bg.png';

//Room5

import room5bg from './assets/room_5/room5_bg.png';

//Keypad

import codepanel from './assets/keypad/code_panel.png';

import wordbg from './assets/keypad/word_bg.png';

import letterbg from './assets/keypad/letter_bg.png';

import keypad from './assets/keypad/keypad.png';

import minimizeicon from './assets/keypad/minimize_icon.png';

import backspaceicon from './assets/keypad/backspace.png';

// Question Scene

import answerbg from './assets/QuestionScene/answer_bg.png';

//Hint

import hintIcon from './assets/hint.png';

//font

import customFont from './assets/font/body-400.woff2';

//Audio

import backgroundAudioMP3 from './assets/audio/backgroundAudio.mp3';
import backgroundAudioOGG from './assets/audio/backgroundAudio.ogg';
import backgroundAudioM4A from './assets/audio/backgroundAudio.m4a';

import keyAudioMP3 from './assets/audio/keyAudio.mp3';
import keyAudioOGG from './assets/audio/keyAudio.ogg';
import keyAudioM4A from './assets/audio/keyAudio.m4a';

import correctCodeAudioMP3 from './assets/audio/correctCodeAudio.mp3';
import correctCodeAudioOGG from './assets/audio/correctCodeAudio.ogg';
import correctCodeAudioM4A from './assets/audio/correctCodeAudio.m4a';

import incorrectCodeAudioMP3 from './assets/audio/incorrectCodeAudio.mp3';
import incorrectCodeAudioOGG from './assets/audio/incorrectCodeAudio.ogg';
import incorrectCodeAudioM4A from './assets/audio/incorrectCodeAudio.m4a';

import correctAnswerAudioMP3 from './assets/audio/correctAnswerAudio.mp3';
import correctAnswerAudioOGG from './assets/audio/correctAnswerAudio.ogg';
import correctAnswerAudioM4A from './assets/audio/correctAnswerAudio.m4a';

import wrongAnswerAudioMP3 from './assets/audio/incorrectAnswerAudio.mp3';
import wrongAnswerAudioOGG from './assets/audio/incorrectAnswerAudio.ogg';
import wrongAnswerAudioM4A from './assets/audio/incorrectAnswerAudio.m4a';

import holderAudioMP3 from './assets/audio/holderClickAudio.mp3';
import holderAudioOGG from './assets/audio/holderClickAudio.ogg';
import holderAudioM4A from './assets/audio/holderClickAudio.m4a';

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
 
    this.load.audio('keyAudio', [
      keyAudioMP3,
      keyAudioOGG,
      keyAudioM4A
    ]); 

    this.load.audio('correctCodeAudio', [
      correctCodeAudioMP3,
      correctCodeAudioOGG,
      correctCodeAudioM4A
    ]); 

    this.load.audio('incorrectCodeAudio', [
      incorrectCodeAudioMP3,
      incorrectCodeAudioOGG,
      incorrectCodeAudioM4A
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

    this.load.audio('holderAudio', [
      holderAudioMP3,
      holderAudioOGG,
      holderAudioM4A
    ]);

    //room 1

    this.load.image('room1bg', room1bg);

    this.load.image('pencilcase', pencilcase);

    this.load.image('doorAccess', doorAccess);

    //room 2

    this.load.image('room2bg', room2bg);

    this.load.image('penholder', penholder);

    //room 3

    this.load.image('room3bg', room3bg);

    //room 4

    this.load.image('room4bg', room4bg);

    //room 5

    this.load.image('room5bg', room5bg);

    //keypad access panel

    this.load.image('codepanel', codepanel);

    this.load.image('wordbg', wordbg);

    this.load.image('letterbg', letterbg);

    this.load.image('keypad', keypad);

    this.load.image('minimizeIcon', minimizeicon);

    this.load.image('backspaceicon', backspaceicon);

    //question scene

    this.load.image('textbg', textbg);
    
    this.load.image('answerbg', answerbg);

    this.load.image('closebutton', closebutton);

    //hint

    this.load.image('hintIcon', hintIcon);

    (async () => {
      await this.loadFont('GT Walsheim Pro', customFont);
    })();

  }

  async create() {

    this.scene.start('NotificationBannerScene');

    await this.waitForBannerSceneReady();

    await this.checkInternetConnectionBanner();

    const data = await getActivityBySlugAndCurrentStudentUser();

    this.setServerData(data);

    this.setLevelData();

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