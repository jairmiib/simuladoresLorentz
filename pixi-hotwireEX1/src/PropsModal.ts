import { Container, Graphics, FederatedPointerEvent, Application } from 'pixi.js';

export class PropsModal extends Container {
  constructor(){
    super();
    const mainWindow: Graphics = new Graphics();
    mainWindow
    .beginFill(0xffffff,1)
    .drawRect(0, 0, 200, 200)
    .endFill();
    this.addChild(mainWindow);
  }
}
