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
      chars: [['0', '9'], ".", "e", "+", "-Sqrt/2()"]
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
    this.addRocket('./granero.png',100+190, yPos-290+20, -1, 0, 60, 290,"granero");
    this.addRocket('./granjero.png',94+190, yPos-100+22, -1, 0, 12.5, 100,"granjero");
    this.addRocket('./granjero.png',124+190, yPos-100+22, -1, 0, 12.5, 100,"granjero");
    this.addRocket('./granjero.png',154+190, yPos-100+22, -1, 0, 12.5, 100,"granjero");
    this.addRocket('./viga.png',38, yPos-20, 0, 0, 244, 40, "viga");
    this.t1Label = new Label("tCorredor:","0",170,290);
    this.t2Label = new Label("tViajero:","0",170,60);
    this.rightPanel.addChild(this.t1Label);
  }

  private onClickPlayPause(e: FederatedPointerEvent): void {
    e.stopPropagation();
    if(this.ticker.started || !this.globalProps.rockets.length){
      this.ticker.stop();
      return;
    }
    this.ticker.start();
  }

  private addRocket(source: string, x: number, y: number, vx: number, vy: number, width?: number, height?: number, id?: string): void {
    let idString: string = "none";
    if(id) idString = id;
    const rocketBox: RocketBox = new RocketBox(this.globalProps, this.app, source, width, height, id);

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
    if(id !== "viga")
      rocketBox.vxLabel.value.text = "-Sqrt(3)/2"
    else
      rocketBox.vxLabel.value.text = "0"

    if(id === "granjero")
      rocketBox.xLabel.value.text = ((rocketBox.rocket.x-38)/12 + 0.5).toFixed(2)
    else if(id === "viga")
    rocketBox.xLabel.value.text = ((rocketBox.rocket.x-38)/24).toFixed(2)

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
        this.globalProps.rockets[i].rocket.x = -80;
      }   
      // if(this.globalProps.rockets[i].rocket.x < 0){
        // this.globalProps.rockets[i].rocket.x = 460;
      // }   
      if(this.globalProps.rockets[i].id === "granjero")
      this.globalProps.rockets[i].xLabel.value.text = ((this.globalProps.rockets[i].rocket.x-38)/12 + 0.5).toFixed(2)
      else if(this.globalProps.rockets[i].id === "viga")
      this.globalProps.rockets[i].xLabel.value.text = ((this.globalProps.rockets[i].rocket.x-38)/24).toFixed()
      if(this.globalProps.rockets[i].id !== "viajero"){
        this.globalProps.rockets[i].t++;
        this.t1Label.value.text = (this.globalProps.rockets[i].t*4.27963*10**-10).toExponential(4);
      }

      if(this.globalProps.rockets[i].id === "granero"){
        this.globalProps.rockets[i].t = this.globalProps.rockets[0].t  * 1/Math.sqrt(1-(10**5)**2/(299792458.0)**2);
        this.t2Label.value.text = (this.globalProps.rockets[i].t*100/3).toExponential();
        if(this.globalProps.rockets[i].rocket.x === 282 - 63
        || this.globalProps.rockets[i].rocket.x === 282 - 122 - 31
        || this.globalProps.rockets[i].rocket.x === 282 - 244){
          this.ticker.stop();
        }
      }

      // Actualizar Y
      // this.globalProps.rockets[i].rocket.y =
        // this.globalProps.rockets[i].rocket.y -
        // this.globalProps.rockets[i].vy * deltaTime;
      // if(this.globalProps.rockets[i].rocket.y > 360){
        // this.globalProps.rockets[i].rocket.y = 0;
      // }   
      // if(this.globalProps.rockets[i].rocket.y < 0){
        // this.globalProps.rockets[i].rocket.y = 360;
      // }   
      // this.globalProps.rockets[i].yLabel.value.text = Math.round(this.globalProps.rockets[i].rocket.y).toString();
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
