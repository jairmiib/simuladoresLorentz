import { Container, BitmapFont, TextStyle, Ticker, Graphics, Sprite, FederatedPointerEvent, Application } from 'pixi.js'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { GlobalProps } from './Interfaces'
import { RocketBox } from './RocketBox'
import { AddRocketBox } from './AddRocketBox'
import { Label } from './Label'

export class App extends Container {
  private t1Label: Label;
  private t2Label: Label;
  private leftPanel: LeftPanel;
  private rightPanel: RightPanel;
  private addRocketBox: AddRocketBox;
  private mainRocket: RocketBox | undefined;
  private ticker: Ticker = Ticker.shared.add(this.update, this);
  private app: Application;
  private globalProps: GlobalProps = { 
    rockets: [
    ],
    addRocket: this.addRocket.bind(this),
    removeRocket: this.removeRocket.bind(this),
    ticker: this.ticker
  };

  constructor(app: Application){
    super();
    this.app = app;
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.ticker.add(this.update, this);

    BitmapFont.from("rocketBoxLabelFont", 
    {
      fill: "#000000",
      fontFamily: "Arial",
      fontSize: 12,
    },
    {
      chars: [['0', '9'], ".", "e", "+", "-"]
    })

    this.addRocketBox = new AddRocketBox(this.globalProps)
    this.leftPanel = new LeftPanel(this.globalProps);
    this.leftPanel.addChild(this.addRocketBox);
    this.rightPanel = new RightPanel(this.globalProps);

    const playPause: Sprite = Sprite.from('./playPause.png');
    playPause.x = this.rightPanel.width - 50;
    playPause.y = this.rightPanel.height - 40;
    playPause.scale.set(0.12);
    playPause.on("pointertap", this.onClickPlayPause, this);
    playPause.interactive = true;

    this.rightPanel.addChild(playPause);

    this.addChild(this.leftPanel, this.rightPanel);

    // DEMO DATOS
    const xPos = this.rightPanel.width/2;
    const yPos = this.rightPanel.width/2;
    this.addRocket(39, yPos, 0, 0);
    this.addRocket(339, yPos, 0, 0);
    this.addRocket(39, yPos-100, 1, 0, "viajero");
    this.t1Label = new Label("tPerez:","0",170,20);
    this.t2Label = new Label("tViajero:","0",170,60);
    this.rightPanel.addChild(this.t1Label, this.t2Label);
  }

  private onClickPlayPause(e: FederatedPointerEvent): void {
    e.stopPropagation();
    if(this.ticker.started || !this.globalProps.rockets.length){
      this.ticker.stop();
      return;
    }
    this.ticker.start();
  }

  private addRocket(x: number, y: number, vx: number, vy: number, id?: string): void {
    let idString: string = "none";
    if(id) idString = id;
    const rocketBox: RocketBox = new RocketBox(this.globalProps, this.app, './clock.png', id);

    const mask: Graphics = new Graphics();
    mask.beginFill(0xFF3300);
    mask.drawRect(this.rightPanel.x, this.rightPanel.y, this.rightPanel.width, this.rightPanel.height);
    mask.endFill();
    rocketBox.rocket.mask = mask;

    this.globalProps.rockets.push(rocketBox);
    const rocketCount: number = this.globalProps.rockets.length;
    rocketBox.y = (rocketCount - 1) * 50;
    this.addRocketBox.y = rocketCount * 50;
    this.addChildAt(rocketBox, rocketCount)
    this.globalProps.rockets = this.globalProps.rockets;

    this.mainRocket = rocketBox;
    rocketBox.rocket.x = x;
    rocketBox.rocket.y = y;
    rocketBox.vx = vx;
    rocketBox.vy = vy;
    rocketBox.vxLabel.value.text = (vx*10**5).toExponential(2);

    rocketBox.xLabel.value.text = ((rocketBox.rocket.x-39)/300*10**9).toExponential(2);
    rocketBox.yLabel.value.text = rocketBox.rocket.y.toString();

    this.rightPanel.addChild(rocketBox.rocket);
    // rocketBox.rocket.width = parseFloat((rocketBox.originalLx*Math.sqrt(1-rocketBox.vx**2)).toFixed(1));
    rocketBox.lxLabel.value.text = rocketBox.rocket.width.toFixed(1);
  }

  private update(deltaTime: number): void {
    const rocketCount: number = this.globalProps.rockets.length;
    for(let i = 0; i < rocketCount; i++){
      // Actualizar X
      this.globalProps.rockets[i].rocket.x =
        this.globalProps.rockets[i].rocket.x +
        this.globalProps.rockets[i].vx * 1;
      if(this.globalProps.rockets[i].rocket.x > 460){
        this.globalProps.rockets[i].rocket.x = 0;
      }   
      if(this.globalProps.rockets[i].rocket.x < 0){
        this.globalProps.rockets[i].rocket.x = 460;
      }   
      this.globalProps.rockets[i].xLabel.value.text = Math.round((this.globalProps.rockets[i].rocket.x-39)/300*10**9).toExponential(2);
      if(this.globalProps.rockets[i].id !== "viajero"){
        this.globalProps.rockets[i].t++;
        this.t1Label.value.text = (this.globalProps.rockets[i].t*100/3).toExponential();
      }

      if(this.globalProps.rockets[i].id === "viajero"){
        this.globalProps.rockets[i].t = this.globalProps.rockets[0].t  * 1/Math.sqrt(1-(10**5)**2/(299792458.0)**2);
        this.t2Label.value.text = (this.globalProps.rockets[i].t*100/3).toExponential();
        if(this.globalProps.rockets[i].rocket.x === 339){
          this.ticker.stop();
        }
      }

      // Actualizar Y
      this.globalProps.rockets[i].rocket.y =
        this.globalProps.rockets[i].rocket.y -
        this.globalProps.rockets[i].vy * deltaTime;
      if(this.globalProps.rockets[i].rocket.y > 360){
        this.globalProps.rockets[i].rocket.y = 0;
      }   
      if(this.globalProps.rockets[i].rocket.y < 0){
        this.globalProps.rockets[i].rocket.y = 360;
      }   
      this.globalProps.rockets[i].yLabel.value.text = Math.round(this.globalProps.rockets[i].rocket.y).toString();
    }
  }

  private removeRocket(index: number): void {
    this.globalProps.rockets[index].rocket.destroy();
    this.globalProps.rockets[index].destroy();
    this.globalProps.rockets.splice(index, 1);
    const rocketCount: number = this.globalProps.rockets.length;
    for(let i = 0; i < rocketCount; i++){
      this.globalProps.rockets[i].y = i*50;
    }
    this.addRocketBox.y = rocketCount*50;
    this.globalProps.rockets = this.globalProps.rockets;
    if(!rocketCount) this.ticker.stop();
  }

  private makeMainRocket(index: number): void {
    const rocketCount: number = this.globalProps.rockets.length;
    if(!rocketCount) return;
    const x: number = this.globalProps.rockets[index].rocket.x;
    const y: number = this.globalProps.rockets[index].rocket.y;
    const vx: number = this.globalProps.rockets[index].vx;
    const vy: number = this.globalProps.rockets[index].vy;
    for(let i = 0; i < rocketCount; i++){
      this.globalProps.rockets[i].y = i*50;
    }
  }
}
