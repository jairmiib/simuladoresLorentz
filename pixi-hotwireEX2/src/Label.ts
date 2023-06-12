import { Container, Text, BitmapText, TextStyle, BitmapFont } from 'pixi.js';

export class Label extends Container {
  public attribute: Text;
  public value: BitmapText;
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
    this.addChild(this.attribute, this.value);
    this.value.x = 10;
    this.value.y = 17;
    this.attribute.x = 12;
    this.attribute.y = 1;
    this.x = x;
    this.y = y;
  }
}
