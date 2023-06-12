import { Application } from 'pixi.js';
import { App } from './App'

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x484848,
  width: 640,
  height: 360
});

const app_ = new App(app);
app.stage.addChild(app_);
