import { Container, Graphics, FederatedPointerEvent } from 'pixi.js';
import { AddRocketBox } from './AddRocketBox';
import { RocketBox } from './RocketBox';
import { Props, GlobalProps } from './Interfaces'
import { RightPanel } from './RightPanel'

export class LeftPanel extends Container {
  private background: Graphics;

  // Para addRocketBox
  private globalProps: GlobalProps;

  constructor(globalProps: GlobalProps){
    super();
    this.globalProps = globalProps;
    this.background = new Graphics();
    this.background.beginFill(0xb5b5b5, 1);
    this.background.drawRect(0,0, 200, 360);
    this.background.endFill();
    this.addChild(this.background);
  }
}
