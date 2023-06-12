import { Container, Graphics, FederatedPointerEvent, BitmapFont, BitmapText, Application } from 'pixi.js';
import { GlobalProps } from './Interfaces';
import { Rocket } from './Rocket';
import { Label } from './Label';
import { PropsModal } from './PropsModal';
import { InputBox } from './InputBox';

function getRandomHexColor(): number {
  // Generate three random values for RGB
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  // Combine the RGB values into a single number
  const color = (red << 16) | (green << 8) | blue;

  // Return the color as a 0xnnnnnn number
  return color;
}

export class RocketBox extends Container {
  private globalProps: GlobalProps;
  public colorId: number;
  public id: string | undefined;
  public rocket: Rocket;
  public originalLx: number;
  public originalLy: number;
  public vx: number = 0.5;
  public lx: number = 1;
  public vy: number = 0.0;
  public ly: number = 1;
  public t: number = 0;
  public xLabel = new Label("x=", "0", 26, 7);
  public yLabel = new Label("y=", "0", 26, 25);
  public vxLabel = new Label("Vx=", this.vx.toString(), 102, 7);
  public vyLabel = new Label("Vy=", this.vy.toString(), 72, 25);
  public lxLabel = new Label("Lx=", this.lx.toString(), 127, 7);
  public lyLabel = new Label("Ly=", this.ly.toString(), 127, 25);
  public tLabel = new Label("t=", this.t.toString(), 127, 7);
  private propsModal: PropsModal;
  private xInput: InputBox;
  private vxInput: InputBox;
  private lxInput: InputBox;
  private yInput: InputBox;
  private vyInput: InputBox;
  private lyInput: InputBox;
  private modalBackground: Graphics;
  private app: Application;

  constructor(globalProps: GlobalProps, app: Application, source:string, id?: string | undefined){
    super();
    if(id) this.id = id;
    this.globalProps = globalProps;
    this.colorId = getRandomHexColor();
    this.app = app;
    this.modalBackground = new Graphics();

    this.rocket = new Rocket(source, this.colorId);
    this.originalLx = this.rocket.width;
    this.originalLy = this.rocket.height;

    // Sólo fondo
    const background = new Graphics()
    .beginFill(0xffffff, 1)
    .drawRect(0, 0, 200, 50)
    .endFill()
    .lineStyle({
      width: 1,
      color: 0x9f9f9f,
      alignment: 1
    })
    .moveTo(0,50)
    .lineTo(200,50)
    .moveTo(180,50)
    .lineTo(180,0)
    .moveTo(100,40)
    .lineTo(100,10)

    this.addChild(background);

    // Area principal
    const mainArea = new Container();
    mainArea.width = 180;
    mainArea.height = 50;

    const colorIdBox = new Graphics()
    .beginFill(this.colorId, 1)
    .drawCircle(14,25, 7)
    .endFill();
    mainArea.addChild(colorIdBox);
    mainArea.addChild(this.xLabel);
    // mainArea.addChild(this.yLabel);
    mainArea.addChild(this.vxLabel);
    // mainArea.addChild(this.vyLabel);
    // mainArea.addChild(this.lxLabel);
    // mainArea.addChild(this.lyLabel);
    // mainArea.addChild(this.tLabel);
    background.on("pointertap", this.onClickDataArea, this);
    background.interactive = true;

    this.addChild(mainArea);

    this.propsModal = new PropsModal();
    this.propsModal.pivot.x = this.propsModal.width/2;
    this.propsModal.pivot.y = this.propsModal.height/2;
    this.propsModal.x = 640/2;
    this.propsModal.y = 360/2;
    this.propsModal.on("pointertap", this.onClickModal, this)
    this.propsModal.interactive = true;
    this.xInput = new InputBox("x:", Math.round(this.rocket.x).toString(), 10, 10)
    this.vxInput = new InputBox("Vx:", Math.round(this.vx).toString(), 70, 10)
    this.lxInput = new InputBox("Lx:", Math.round(this.lx).toString(), 130, 10)
    this.yInput = new InputBox("y:", Math.round(this.rocket.y).toString(), 10, 40)
    this.vyInput = new InputBox("Vy:", Math.round(this.vy).toString(), 70, 40)
    this.lyInput = new InputBox("Ly:", Math.round(this.ly).toString(), 130, 40)
    this.propsModal.addChild(this.xInput, this.vxInput, 
                             // this.lxInput,
                             // this.yInput, this.vyInput, this.lyInput
                            );

    // Area de eliminado
    const removeArea = new Container();
    removeArea.width = 20;
    removeArea.height = 50;
    removeArea.x = 180;

    const removeHitBox = new Graphics()
    .beginFill(0xffffff, 1)
    .drawRect(0, 0, 20, 50)
    .endFill()
    .lineStyle({
      width: 1,
      color: 0x9f9f9f,
      alignment: 1
    })
    .moveTo(0,50)
    .lineTo(20,50)
    .lineTo(20,0);
    removeArea.addChild(removeHitBox);

    removeHitBox.on("pointertap", this.onClickRocketBox, this);
    removeHitBox.interactive = true;
    this.addChild(removeArea);

  }

  private onClickDataArea(e: FederatedPointerEvent): void {
    e.stopPropagation();
    const started = this.globalProps.ticker.started;
    this.globalProps.ticker.stop();

    this.modalBackground
    .beginFill(0x0f0f0f,0.2)
    .drawRect(0, 0, this.app.stage.width, this.app.stage.height)
    .endFill();
    this.modalBackground.on("pointertap", e => this.onClickModalBackground(e, started), this);
    this.modalBackground.interactive = true;
    this.xInput.value.text = this.xLabel.value.text;
    this.vxInput.value.text = this.vxLabel.value.text;
    this.lxInput.value.text = (this.originalLx*Math.sqrt(1-this.vx**2)).toFixed(1);
    this.yInput.value.text = this.yLabel.value.text;
    this.vyInput.value.text = this.vyLabel.value.text;
    this.lyInput.value.text = this.lyLabel.value.text;
    this.app.stage.addChild(this.modalBackground, this.propsModal);
  }

  private onClickModal(e: FederatedPointerEvent){
    e.stopPropagation();
  }

  private onClickModalBackground(e: FederatedPointerEvent, started: boolean){
    e.stopPropagation();
    this.app.stage.removeChild(this.propsModal);
    this.app.stage.removeChild(this.modalBackground);

    // Ajustar x
    this.rocket.x = parseInt(this.xInput.value.text);
    this.xLabel.value.text = this.xInput.value.text;
    this.vx = parseFloat(this.vxInput.value.text);
    this.vxLabel.value.text = this.vxInput.value.text;
    this.lx = parseFloat(parseFloat(this.lxInput.value.text).toFixed(1));
    // this.rocket.width = parseFloat((this.originalLx*Math.sqrt(1-this.vx**2)).toFixed(1));
    this.lxLabel.value.text = this.rocket.width.toFixed(1);

    // Ajustar y
    this.rocket.y = parseInt(this.yInput.value.text);
    this.yLabel.value.text = this.yInput.value.text;
    this.vy = parseFloat(this.vyInput.value.text);
    this.vyLabel.value.text = this.vyInput.value.text;
    this.ly = parseFloat(this.lyInput.value.text);
    this.lyLabel.value.text = this.lyInput.value.text;
    this.rocket.height = this.originalLy*this.ly;

    if(started) this.globalProps.ticker.start();
  }

  private onClickRocketBox(e: FederatedPointerEvent): void {
    e.stopPropagation();
    let index = this.globalProps.rockets.indexOf(this);
    this.globalProps.removeRocket(index);
  }
}
