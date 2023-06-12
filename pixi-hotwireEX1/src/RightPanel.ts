import { Container, Graphics, FederatedPointerEvent, Point } from 'pixi.js';
import { AddRocketBox } from './AddRocketBox';
import { RocketBox } from './RocketBox';
import { LeftPanel } from './LeftPanel'
import { Rocket } from './Rocket'
import { GlobalProps } from './Interfaces'

export class RightPanel extends Container {
  private globalProps: GlobalProps;

  constructor(globalProps: GlobalProps){
    super();
    this.globalProps = globalProps;

    const background: Graphics = new Graphics();
    background.beginFill(0xffffff, 1);
    background.drawRect(0,0, 440, 360);
    background.endFill();
    background.lineStyle({
      width: 1,
      color: 0xb4b4b4,
      alignment: 1
    });
    let curr = 440/2;
    while(curr < 440){
      background.moveTo(curr, 0);
      background.lineTo(curr, 360);
      curr += 60;
    }
    curr = 440/2;
    while(curr > 0){
      background.moveTo(curr, 0);
      background.lineTo(curr, 360);
      curr -= 60;
    }
    curr = 360/2;
    while(curr < 360){
      background.moveTo(0, curr);
      background.lineTo(440, curr);
      curr += 60;
    }
    curr = 360/2;
    while(curr > 0){
      background.moveTo(0, curr);
      background.lineTo(440, curr);
      curr -= 60;
    }
    this.addChild(background);

    this.x = 200;
  }

}
