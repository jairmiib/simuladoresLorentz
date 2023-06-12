import { Container, Graphics, FederatedPointerEvent } from 'pixi.js';
import { RocketBox } from './RocketBox'
import { GlobalProps } from './Interfaces'

export class AddRocketBox extends Container{
  private background: Graphics;

  // Desde leftPanel
  private globalProps: GlobalProps;

  constructor(globalProps: GlobalProps){
    super();
    this.globalProps = globalProps;
    this.background = new Graphics();
    this.background.beginFill(0xefefef, 1);
    this.background.drawRect(0,0, 200, 50);
    this.background.endFill();
    this.addChild(this.background);
    this.on("pointertap", this.onClickAddRocketBox, this)
    this.interactive = true;
  }

  private onClickAddRocketBox(e: FederatedPointerEvent): void {
    e.stopPropagation();
    this.globalProps.addRocket("./rocket.png",0, 0, 0, 0);
  }

}
