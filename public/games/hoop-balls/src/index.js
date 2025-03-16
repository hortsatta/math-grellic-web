import Phaser from 'phaser';
import PlayScene from './PlayScene';
import PreloadScene from './PreloadScene';
import QuestionScene from './QuestionScene';
import BackgroundScene from './BackgroundScene';
import NotificationBannerScene from './NotificationBannerScene';

const Scenes = [
  PreloadScene,
  BackgroundScene,
  QuestionScene,
  PlayScene,
  NotificationBannerScene
];

const createScene = Scene => new Scene();

const initScenes = () => Scenes.map(createScene);

const { screen, innerWidth, innerHeight, devicePixelRatio: dpr } = window;

const width = dpr === 1 
  ? screen.width 
  : innerWidth * dpr;

const height = dpr === 1 
  ? screen.height 
  : innerHeight * dpr;

const config = {
  type: Phaser.CANVAS,
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