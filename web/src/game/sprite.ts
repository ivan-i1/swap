// FlxSprite stand-in: Flixel object data (position, hull, motion, touching) plus a Phaser view for drawing.
import Phaser from 'phaser';
import { ANY, NONE, createFlxObject, postUpdate, preUpdate, type FlxObject } from '../flixel/core';
import type { Runtime } from './runtime';

type View = Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle | Phaser.GameObjects.Text;

export class GameSprite {
  readonly flx: FlxObject;
  offset = { x: 0, y: 0 };
  angle = 0;
  alpha = 1;
  visible = true;
  exists = true;
  alive = true;
  facing: 'left' | 'right' = 'right';
  scale = { x: 1, y: 1 };
  scrollFactor = { x: 1, y: 1 };
  frameWidth = 0;
  frameHeight = 0;
  view: View | null = null;
  protected reverse = false;
  private flickerTimer = 0;
  private flickerSkip = false;

  constructor(protected rt: Runtime, x = 0, y = 0) {
    this.flx = createFlxObject({ x, y });
  }

  get x() { return this.flx.x; }
  set x(v: number) { this.flx.x = v; }
  get y() { return this.flx.y; }
  set y(v: number) { this.flx.y = v; }
  get width() { return this.flx.width; }
  set width(v: number) { this.flx.width = v; }
  get height() { return this.flx.height; }
  set height(v: number) { this.flx.height = v; }
  get velocity() { return this.flx.velocity; }
  get acceleration() { return this.flx.acceleration; }
  get immovable() { return this.flx.immovable; }
  set immovable(v: boolean) { this.flx.immovable = v; }
  get solid() { return (this.flx.allowCollisions & ANY) > NONE; }
  set solid(v: boolean) { this.flx.allowCollisions = v ? ANY : NONE; }

  loadGraphic(key: string, animated = false, reverse = false, frameWidth = 0, frameHeight = 0): this {
    this.view?.destroy();
    const sprite = this.rt.scene.make.sprite({ key, frame: 0 }, false);
    const tex = sprite.frame;
    this.frameWidth = animated && frameWidth ? frameWidth : tex.width;
    this.frameHeight = animated && frameHeight ? frameHeight : tex.height;
    this.width = this.frameWidth;
    this.height = this.frameHeight;
    this.reverse = reverse;
    this.view = sprite;
    return this;
  }

  makeGraphic(width: number, height: number, argb: number): this {
    this.view?.destroy();
    const alpha = ((argb >>> 24) & 0xff) / 255;
    this.view = new Phaser.GameObjects.Rectangle(this.rt.scene, 0, 0, width, height, argb & 0xffffff, alpha);
    this.frameWidth = width;
    this.frameHeight = height;
    this.width = width;
    this.height = height;
    return this;
  }

  addAnimation(name: string, frames: number[], frameRate = 0, looped = true): void {
    const sprite = this.view as Phaser.GameObjects.Sprite;
    sprite.anims.create({
      key: name,
      frames: sprite.anims.generateFrameNumbers(sprite.texture.key, { frames }),
      frameRate: frameRate || 1,
      repeat: looped ? -1 : 0,
    });
  }

  play(name: string): void {
    (this.view as Phaser.GameObjects.Sprite).anims.play(name, true);
  }

  flicker(duration = 1): void {
    this.flickerTimer = duration;
  }

  preUpdate(elapsed: number): void {
    preUpdate(this.flx);
    if (this.flickerTimer > 0) {
      this.flickerTimer -= elapsed;
      if (this.flickerTimer <= 0) this.flickerTimer = 0;
    }
  }

  update(): void {}

  postUpdate(elapsed: number): void {
    postUpdate(this.flx, elapsed);
  }

  kill(): void {
    this.alive = false;
    this.exists = false;
  }

  /** Copy Flixel state onto the Phaser view. Flixel draws frames at (x - offset) and rotates/scales about the frame centre. */
  render(): void {
    const v = this.view;
    if (!v) return;
    let shown = this.exists && this.visible;
    if (shown && this.flickerTimer > 0) {
      this.flickerSkip = !this.flickerSkip;
      shown = !this.flickerSkip;
    }
    v.setVisible(shown);
    if (!shown) return;
    v.setPosition(this.x - this.offset.x + this.frameWidth / 2, this.y - this.offset.y + this.frameHeight / 2);
    v.setOrigin(0.5, 0.5);
    v.setAngle(this.angle);
    v.setScale(this.scale.x, this.scale.y);
    v.setAlpha(Math.max(0, Math.min(1, this.alpha)));
    v.setScrollFactor(this.scrollFactor.x, this.scrollFactor.y);
    if (v instanceof Phaser.GameObjects.Sprite) v.setFlipX(this.reverse && this.facing === 'left');
  }

  destroy(): void {
    this.view?.destroy();
    this.view = null;
  }
}
