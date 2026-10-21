// PhysicalBody.as: a Flixel sprite whose position comes from a Box2D (planck) body.
import type Phaser from 'phaser';
import { Box, PrismaticJoint, Vec2, type Body, type Contact, type ContactImpulse, type Fixture, type Manifold, type Shape, type World } from 'planck';
import type { Prop, PropValue } from '../../levels/parseLevel';
import type { Runtime } from '../runtime';
import { Settings } from '../settings';
import { GameSprite } from '../sprite';

export interface FixtureSpec {
  shape: Shape;
  isSensor?: boolean;
}

export const INNER_GLOW = 0x6600cc;
export const SELECTED_GLOW = 0x66ff33;

export abstract class PhysicalBody extends GameSprite {
  body!: Body;
  protected world!: World;
  protected bodyDef = { type: 'static' as 'static' | 'dynamic', fixedRotation: false, allowSleep: true, bullet: false };
  fixtureDefs: FixtureSpec[] = [];
  fixtures: Fixture[] = [];

  protected _gravityVector = Vec2(0, 0);
  protected _enabled = true;
  protected _swappable = false;
  affectsPlayer = true;
  kills = false;
  protected _selected = false;
  protected _fixedRotation = false;

  private objectLinks: [string, PropValue, unknown][] = [];
  private glow: Phaser.Filters.Glow | null = null;

  constructor(rt: Runtime, x: number, y: number, protected density = 1, protected restitution = 0, protected friction = 1) {
    super(rt, x, y);
    this.solid = true;
    this.immovable = true;
  }

  createPhysicsObject(world: World, properties: Prop[] = []): Body {
    let isSensor = false;
    this.world = world;
    const position = Vec2((this.x + this.width / 2) / Settings.ratio, (this.y + this.height / 2) / Settings.ratio);

    for (const p of properties) {
      switch (p.name) {
        case 'sensor': isSensor = Boolean(p.value); break;
        case 'swappable': this.swappable = Boolean(p.value); break;
        case 'fixedrotation': this.fixedRotation = Boolean(p.value); break;
        case 'kills': this.kills = Boolean(p.value); break;
        case 'friction': this.friction = Number(p.value); break;
        case 'affectsplayer': this.affectsPlayer = this.solid = Boolean(p.value); break;
        case 'innerglow': this.applyInnerGlow(Number(p.value)); break;
        case 'outerglow': this.applyOuterGlow(Number(p.value)); break;
      }
    }

    this.body = world.createBody({
      type: this.bodyDef.type,
      position,
      fixedRotation: this.bodyDef.fixedRotation,
      allowSleep: this.bodyDef.allowSleep,
      bullet: this.bodyDef.bullet,
    });
    this.body.setUserData(this);

    for (const p of properties) {
      switch (p.name) {
        case 'enabled': this.enabled = Boolean(p.value); break;
        case 'fixedx': this.addVerticalRail(world); break;
      }
    }

    this.fixtures = this.fixtureDefs.map((def) => this.body.createFixture({
      shape: def.shape,
      density: this.density,
      restitution: this.restitution,
      friction: this.friction,
      userData: this,
      isSensor: Boolean(def.isSensor) || isSensor,
    }));
    this.massChanged();

    this.gravityVector = Vec2(Settings.DEFAULTGRAVITYX, Settings.DEFAULTGRAVITYY);
    return this.body;
  }

  // "fixedx": a prismatic joint to a tiny static sensor, so the body can only slide vertically.
  private addVerticalRail(world: World): void {
    const base = world.createBody({ type: 'static', position: this.body.getPosition(), fixedRotation: true });
    base.createFixture({ shape: boxShape(0.01, 0.01), isSensor: true });
    world.createJoint(new PrismaticJoint(
      { enableLimit: true, lowerTranslation: -100, upperTranslation: 100 },
      this.body, base, this.body.getWorldCenter(), Vec2(0, 1),
    ));
  }

  /** Hook for bodies whose mass must follow AS3 Box2D rather than planck (see Player). */
  protected massChanged(): void {}

  override update(): void {
    super.update();
    const p = this.body.getPosition();
    this.x = p.x * Settings.ratio - this.width / 2;
    this.y = p.y * Settings.ratio - this.height / 2;
    this.angle = this.body.getAngle() * (180 / Math.PI);

    const force = Vec2(this._gravityVector.x, this._gravityVector.y).mul(this.body.getMass());
    this.body.applyForce(force, this.body.getWorldCenter());
  }

  /** FlxSprite.update without PhysicalBody's body sync (Player drives its body from Flixel instead). */
  protected update2(): void {
    super.update();
  }

  addObjectLink(key: string, value: PropValue, target: unknown): void {
    this.objectLinks.push([key, value, target]);
  }

  protected findAllObjectLinks(key: string): [string, PropValue, unknown][] {
    return this.objectLinks.filter((l) => l[0] === key);
  }

  /** [this body's fixture, the other fixture] */
  protected identifyCollision(contact: Contact): [Fixture, Fixture] {
    const a = contact.getFixtureA();
    const b = contact.getFixtureB();
    return a.getUserData() === this ? [a, b] : [b, a];
  }

  onStartCollision(_contact: Contact): void {}
  onEndCollision(_contact: Contact): void {}
  onBeforeSolveCollision(_contact: Contact, _oldManifold: Manifold): void {}
  onAfterSolveCollision(_contact: Contact, _impulse: ContactImpulse): void {}

  override kill(): void {
    this.rt.physics.enqueueDeletedBody(this.body);
    super.kill();
  }

  get gravityVector(): Vec2 {
    return this._gravityVector;
  }

  set gravityVector(v: Vec2) {
    this._gravityVector = v;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    this.visible = enabled;
    const body = this.body;
    this.rt.physicsOp(() => body.setActive(enabled));
    this._enabled = enabled;
  }

  get swappable(): boolean {
    return this._swappable;
  }

  set swappable(swappable: boolean) {
    this._swappable = swappable;
    if (swappable) this.applyInnerGlow();
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(selected: boolean) {
    this._selected = selected;
    this.applyInnerGlow(selected ? SELECTED_GLOW : INNER_GLOW);
  }

  get fixedRotation(): boolean {
    return this._fixedRotation;
  }

  set fixedRotation(fixed: boolean) {
    this._fixedRotation = fixed;
    this.bodyDef.fixedRotation = fixed;
    const body = this.body;
    if (!body) return;
    if (fixed) this.rt.physics.enqueueRotation(body, 0);
    this.rt.physicsOp(() => {
      if (fixed) body.setAngularVelocity(0);
      body.setFixedRotation(fixed);
      this.massChanged();
    });
  }

  // The AS3 code bakes a flash GlowFilter (blur 12, strength 1.5, alpha 0.5) into the frame pixels; a
  // Phaser 4 glow filter on the sprite stands in for it. Re-applying replaces the colour, as in the original.
  applyInnerGlow(color = INNER_GLOW): void {
    this.setGlow(color, 0, 1);
  }

  applyOuterGlow(color = 0xff0000): void {
    this.setGlow(color, 1, 0);
  }

  protected setGlow(color: number, outer: number, inner: number): void {
    const view = this.view as Phaser.GameObjects.Sprite | null;
    if (!view) return;
    if (!this.glow) {
      view.enableFilters();
      this.glow = view.filters!.internal.addGlow(color, outer, inner, 1, false, 10, 12);
    }
    this.glow.color = color;
    this.glow.outerStrength = outer;
    this.glow.innerStrength = inner;
  }
}

export function boxShape(hx: number, hy: number): Shape {
  return new Box(hx, hy);
}
