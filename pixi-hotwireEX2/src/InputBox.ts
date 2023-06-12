import { Container, Text, BitmapText, TextStyle, BitmapFont, Graphics, FederatedPointerEvent } from 'pixi.js';

export class InputBox extends Container {
  public attribute: Text;
  public value: BitmapText;
  public onKeyDownBind = this.onKeyDown.bind(this);
  constructor(attributeStr: string, valueStr: string, x: number, y: number){
    super();
    const textStyle: TextStyle = new TextStyle({
      align: "right",
      fill: "#000000",
      fontSize: 14
    });
    this.attribute = new Text(`${attributeStr}`, textStyle);
    this.value = new BitmapText(`${valueStr}`, {
        fontName: 'rocketBoxLabelFont',
        fontSize: 14,
        align: 'left'
    });
    this.value.x = this.attribute.width;
    this.attribute.y = 1;

    this.value.on("pointerover", this.onOverValue, this);
    this.value.on("pointerout", this.onOutValue, this);
    this.value.interactive = true;


    this.addChild(this.attribute, this.value);
    this.x = x;
    this.y = y;
  }

  private onOverValue(e: FederatedPointerEvent){
    e.stopPropagation();
    document.addEventListener("keydown", this.onKeyDownBind, true);
  }

  private onOutValue(e: FederatedPointerEvent){
    e.stopPropagation();
    document.removeEventListener("keydown", this.onKeyDownBind, true);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if((('0' <= e.key && e.key <= '9') || e.key === '.') && parseFloat(this.value.text+e.key)<=440){
      if(e.key === '.' && this.value.text[this.value.text.length-1] === '.')
        return
      this.value.text += e.key;
    }
    else if(e.key === "Backspace")
      this.value.text = this.value.text.slice(0, -1);
  }
}
