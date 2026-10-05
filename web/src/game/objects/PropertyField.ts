// PropertyField.as: an invisible sensor box from DAME that changes whatever enters it — gravity, buoyancy,
// rotation lock, a blur effect, hint text, or the end of the game.
import Phaser from 'phaser';
import { Box, Vec2, type Body, type Contact, type World } from 'planck';
import type { Prop } from '../../levels/parseLevel';
import { BuoyancyController } from '../../physics/buoyancy';
import type { Runtime } from '../runtime';
import { Settings } from '../settings';
import { GameSprite } from '../sprite';
import { PhysicalBody } from './PhysicalBody';
import { Player } from './Player';
import type { TextObject } from './TextObject';

export class PropertyField extends PhysicalBody {
  private gravityField = Vec2(0, 0);
  private affectedByField = new Map<PhysicalBody, number>();
  private blurs = false;
  private onlyPlayer = false;
  private bc: BuoyancyController | null = null;
  private fixesRotation = false;
  private endsGame = false;
  private blurEffects = new Map<PhysicalBody, BlurTrail>();

  constructor(rt: Runtime, x: number, y: number) {
    super(rt, x, y, 0, 0, 0);
    this.affectsPlayer = true;
    this.bodyDef.type = 'static';
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    this.bodyDef.fixedRotation = true;
    this.fixtureDefs[0] = { shape: new Box(this.width / Settings.ratio / 2, this.height / Settings.ratio / 2), isSensor: true };

    for (const p of properties) {
      switch (p.name) {
        case 'gravityx': this.gravityField.x = Number(p.value); break;
        case 'gravityy': this.gravityField.y = Number(p.value); break;
        case 'blur': this.blurs = Boolean(p.value); break;
        case 'onlyPlayer': this.onlyPlayer = Boolean(p.value); break;
        case 'fixesRotation': this.fixesRotation = Boolean(p.value); break;
        case 'buoyancy': {
          const bc = new BuoyancyController(world);
          bc.offset = this.height / Settings.ratio;
          bc.density = Number(p.value);
          bc.linearDrag = 500;
          bc.angularDrag = 250;
          this.rt.physics.addBuoyancyController(bc);
          this.bc = bc;
          break;
        }
        case 'endgame': this.endsGame = Boolean(p.value); break;
      }
    }
    if (this.bc) {
      const n = this.gravityField.clone();
      n.normalize();
      this.bc.normal.set(n.x, n.y);
    }
    return super.createPhysicsObject(world, properties);
  }

  // Note: affectsPlayer defaults to true, which makes onlyPlayer redundant — kept as in the original.
  private affects(body: PhysicalBody): boolean {
    const isPlayer = body instanceof Player;
    return (this.onlyPlayer && isPlayer) || this.affectsPlayer || (!this.affectsPlayer && !isPlayer);
  }

  override onStartCollision(contact: Contact): void {
    const other = this.identifyCollision(contact)[1].getUserData();
    if (!(other instanceof PhysicalBody)) return;
    const count = (this.affectedByField.get(other) ?? 0) + 1;
    this.affectedByField.set(other, count);
    if (count === 1 && this.affects(other)) this.applyProperties(other);
  }

  override onEndCollision(contact: Contact): void {
    const other = this.identifyCollision(contact)[1].getUserData();
    if (!(other instanceof PhysicalBody)) return;
    const count = (this.affectedByField.get(other) ?? 0) - 1;
    this.affectedByField.set(other, count);
    if (count === 0 && this.affects(other)) this.ripProperties(other);
  }

  applyProperties(body: PhysicalBody): void {
    this.callObjectLinkActions();

    if (this.endsGame) {
      this.rt.endGame();
      return;
    }
    if (this.blurs) {
      this.rt.flash(0x66220044, 0.5);
      const blur = this.rt.add(new BlurTrail(this.rt, this.x, this.y, this.width, this.height, body));
      this.blurEffects.set(body, blur);
    }
    if (this.bc) this.bc.addBody(body.body);
    if (this.fixesRotation) body.fixedRotation = true;
    body.gravityVector = Vec2.add(body.gravityVector, this.gravityField);
  }

  ripProperties(body: PhysicalBody): void {
    if (this.blurs) {
      this.rt.flash(0x66220044, 0.5);
      const blur = this.blurEffects.get(body);
      if (blur) {
        blur.kill();
        this.rt.remove(blur);
        this.blurEffects.delete(body);
      }
    }
    if (this.bc) this.bc.removeBody(body.body);
    if (this.fixesRotation) body.fixedRotation = false;
    body.gravityVector = Vec2.sub(body.gravityVector, this.gravityField);
  }

  private callObjectLinkActions(): void {
    for (const [, , target] of this.findAllObjectLinks('showText')) {
      const text = target as TextObject;
      if (text.alive) this.rt.physics.enqueueText(text);
    }
  }
}

// FlxSpecialFX BlurFxRectangle: every frame the tracked sprite is stamped at half opacity into a canvas the
// size of the field and the canvas is re-blurred, leaving a smeared ghost trail inside the field. Here each
// frame adds a fading copy of the sprite's current frame to a container shown through one blur filter.
class BlurTrail extends GameSprite {
  private container: Phaser.GameObjects.Container;
  private ghosts: Phaser.GameObjects.Image[] = [];

  constructor(rt: Runtime, x: number, y: number, width: number, height: number, private target: GameSprite) {
    super(rt, x, y);
    this.width = width;
    this.height = height;
    this.container = new Phaser.GameObjects.Container(rt.scene, 0, 0);
    this.container.enableFilters();
    this.container.filters!.internal.addBlur(1, 2, 2, 1);
    this.view = this.container as unknown as Phaser.GameObjects.Sprite;
    this.solid = false;
  }

  override update(): void {
    for (const g of this.ghosts) g.alpha -= 0.5 / 20;
    while (this.ghosts.length && this.ghosts[0].alpha <= 0) this.ghosts.shift()!.destroy();

    const t = this.target;
    const src = t.view as Phaser.GameObjects.Sprite | null;
    const inside = t.x + t.width > this.x && t.x < this.x + this.width && t.y + t.height > this.y && t.y < this.y + this.height;
    if (!t.exists || !t.visible || !src || !inside) return;
    const ghost = new Phaser.GameObjects.Image(this.rt.scene, t.x - t.offset.x + t.frameWidth / 2, t.y - t.offset.y + t.frameHeight / 2, src.texture.key, src.frame.name);
    ghost.setFlipX(src.flipX).setAngle(t.angle).setAlpha(0.5);
    this.container.add(ghost);
    this.ghosts.push(ghost);
  }

  override render(): void {
    this.container.setVisible(this.exists && this.visible);
  }
}
