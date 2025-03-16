import Phaser from 'phaser';
import PlayScene from './PlayScene';
import AccessControlPanel from './AccessControlPanel';
import PreloadScene from './PreloadScene';
import QuestionScene from './QuestionScene';
import NotificationBannerScene from './NotificationBannerScene';
import HintScene from './HintScene';

const Scenes = [
  PreloadScene,
  PlayScene,
  HintScene,
  AccessControlPanel,
  QuestionScene,
  NotificationBannerScene
];

const createScene = Scene => new Scene();

const initScenes = () => Scenes.map(createScene);

const width = window.devicePixelRatio > 1 ? window.innerWidth * window.devicePixelRatio : window.screen.width;
const height = window.devicePixelRatio > 1 ? window.innerHeight * window.devicePixelRatio : window.screen.height;

const config = {
  type: Phaser.CANVAS,
  width: width,
  height: height,
  scale: {
    mode: Phaser.Scale.EXACT_FIT,
    parent: 'game-container', 
    width: width,
    height: height
  },
  physics: {
    default: 'arcade',
  },
  scene: initScenes() 
};

new Phaser.Game(config);