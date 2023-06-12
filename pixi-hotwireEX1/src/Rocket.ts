import { Sprite, Texture, Graphics } from 'pixi.js';
import { ColorReplaceFilter } from '@pixi/filter-color-replace';

export class Rocket extends Graphics {
  private sprite: Sprite;

  constructor(source: string, colorId: number){
    super();
    this.sprite = Sprite.from(source);
    // this.filters = [new ColorReplaceFilter(0xffffff , colorId, 0.25)]
    this.sprite.tint = colorId;
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.addChild(this.sprite);

    const w: number = this.sprite.width;
    const h: number = this.sprite.height;
    this.pivot.x = w/2;
    this.pivot.y = h/2;
    this
    .lineStyle({
      width: 3,
      color: 0x000000,
      alignment: 1
    })
    .moveTo(w/2, h)
    .lineTo(w/2, h+30);
  }
}
