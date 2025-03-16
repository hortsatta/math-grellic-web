import BaseScene from './BaseScene';

import { scaleBasedOnResolution } from './Utils.js';

class BackgroundScene extends BaseScene
{

  constructor() {

    super('BackgroundScene');

    this.setBackgroundSceneRef(this);

    this.background = null;

  }

  create(){

    this.background = this.add
      .image( BaseScene.windowWidth / 2, BaseScene.windowHeight / 2, 'background')
      .setOrigin(0.5)
      .setAlpha(1);

    scaleBasedOnResolution(this.background, 1, 1, this);

    this.setZoomBackgroundInitialScale();

  }

}

export default BackgroundScene;