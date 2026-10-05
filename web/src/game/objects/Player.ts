// Player.as: Flixel-driven movement (FlxControl + FlxG.collide) with a Box2D body dragged along for contacts,
// pushing objects, the swap mechanic, and kill/exit callbacks.
import { Box, Circle, Polygon, Vec2, type Body, type Contact, type ContactImpulse, type Fixture, type Manifold, type World } from 'planck';
import { FLOOR, isTouching } from '../../flixel/core';
import { createControl, setGravity, updateControl, type ControlState } from '../../flixel/control';
import type { Prop } from '../../levels/parseLevel';
import { as3MassData } from '../../physics/as3shapes';
import type { Runtime } from '../runtime';
import { FRAMERATE, Settings } from '../settings';
import type { FlxTimer } from '../timer';
import { PhysicalBody } from './PhysicalBody';
import { SwapAreaSprite, SwapTrail } from './effects';

const KEYS = { JUMP: 'SPACE', SWAP: 'X', TOUCHSWAP: 'S', LEFT: 'LEFT', RIGHT: 'RIGHT' };

export class Player extends PhysicalBody {
  private feetContactCount = 0;
  dead = false;
  private tempSwapObject: PhysicalBody | null = null;
  private onKillCallback: (() => void) | null = null;
  private onExitCallback: ((level: string | null) => void) | null = null;
  private canSwap = true;
  private swapCooldownTimer: FlxTimer;
  private swapTouchSensorSprite: SwapAreaSprite | null = null;
  private control: ControlState;
  private as3Mass: ReturnType<typeof as3MassData> | null = null;

  constructor(rt: Runtime, x: number, y: number) {
    super(rt, x, y, 1000, 0, 1);
    this.loadGraphic('Player', true, true, 32, 32);
    this.offset.x = 12;
    this.width = 8;
    this.height = 32;

    this.addAnimation('jump', [5], 1, false);
    this.addAnimation('move', [9, 10, 11, 12, 13, 14, 15, 16], 16, true);
    this.addAnimation('fall', [6], 1, false);
    this.addAnimation('idle', [2, 0, 1, 0, 0, 1], 3, true);

    this.immovable = false;
    this.swapCooldownTimer = rt.timers.create();

    this.bodyDef.fixedRotation = true;
    this.bodyDef.allowSleep = false;
    this.bodyDef.type = 'dynamic';

    this.control = createControl(this.flx);
  }

  /** FlxControl plugin update; runs before the state updates its members. */
  updateControl(): void {
    if (!this.exists) return;
    const keys = this.rt.keys;
    const { facing } = updateControl(this.control, this.flx, {
      left: keys.pressed(KEYS.LEFT),
      right: keys.pressed(KEYS.RIGHT),
      jump: keys.pressed(KEYS.JUMP),
    }, this.rt.now());
    if (facing) this.facing = facing;
  }

  setOnKill(callback: () => void): void {
    this.onKillCallback = callback;
  }

  setOnExit(callback: (level: string | null) => void): void {
    this.onExitCallback = callback;
  }

  exitLevel(warpToLevel: string | null): void {
    this.onExitCallback?.(warpToLevel);
  }

  swap(swapObject: PhysicalBody): void {
    if (!swapObject.swappable || !this.canSwap) return;

    // The original copies the object's Box2D velocity (m/s) straight into the Flixel velocity (px/s).
    const tmpLin = { x: this.velocity.x, y: this.velocity.y };
    const objVel = swapObject.body.getLinearVelocity();
    this.velocity.x = objVel.x;
    this.velocity.y = objVel.y;
    swapObject.body.setLinearVelocity(Vec2(tmpLin.x / Settings.ratio, tmpLin.y / Settings.ratio));

    const tmpPos = this.body.getPosition().clone();
    this.body.setPosition(swapObject.body.getPosition().clone());
    swapObject.body.setPosition(tmpPos);
    swapObject.body.setAwake(true);

    this.rt.add(new SwapTrail(this.rt, this.x - this.width / 2, this.y - this.height / 2));
    const p = this.body.getPosition();
    this.x = p.x * Settings.ratio - this.width / 2;
    this.y = p.y * Settings.ratio - this.height / 2;
    this.rt.add(new SwapTrail(this.rt, this.x - this.width / 2, this.y - this.height / 2));

    this.canSwap = false;
    this.swapCooldownTimer.start(Settings.SWAPCOOLDOWN, 0, (t) => {
      this.canSwap = true;
      t.stop();
    });
  }

  private addTouchSensor(): void {
    if (this.swapTouchSensorSprite?.exists) this.swapTouchSensorSprite.kill();
    this.swapTouchSensorSprite = this.rt.add(new SwapAreaSprite(this.rt, this.x, this.y, this));
    const fixture = this.body.createFixture({
      shape: new Box(Settings.TOUCHSENSORRADIUS, Settings.TOUCHSENSORRADIUS),
      isSensor: true,
      userData: this,
    });
    this.fixtureDefs[3] = { shape: fixture.getShape(), isSensor: true };
    this.fixtures[3] = fixture;
  }

  private removeTouchSensor(): void {
    this.swapTouchSensorSprite?.kill();
    const fixture = this.fixtures[3];
    if (fixture && this.isLive(fixture)) {
      this.body.destroyFixture(fixture);
      this.massChanged();
    }
  }

  private isLive(fixture: Fixture): boolean {
    for (let f = this.body.getFixtureList(); f; f = f.getNext()) if (f === fixture) return true;
    return false;
  }

  override update(): void {
    this.update2();
    const keys = this.rt.keys;

    if (keys.justPressed(KEYS.SWAP) && this.tempSwapObject) this.rt.physics.enqueueSwap(this.tempSwapObject, this);
    if (keys.justPressed(KEYS.TOUCHSWAP)) this.addTouchSensor();
    if (keys.justReleased(KEYS.TOUCHSWAP)) this.removeTouchSensor();

    if (!isTouching(this.flx, FLOOR)) {
      if (this.velocity.y > 0) this.play('fall');
      else if (this.velocity.y < 0) this.play('jump');
    } else if (Math.abs(this.velocity.x) > 0.1) {
      this.play('move');
      this.rt.playSound('step', 0.1);
    } else {
      this.play('idle');
    }

    this.body.setPosition(Vec2((this.x + this.width / 2) / Settings.ratio, (this.y + this.height / 2) / Settings.ratio));
  }

  override onStartCollision(contact: Contact): void {
    const [playerFixture, otherFixture] = this.identifyCollision(contact);
    const otherBody = otherFixture.getUserData() as PhysicalBody | null;

    if (otherBody && otherBody.kills) this.kill();

    if (playerFixture === this.fixtures[3] && otherBody && otherBody.swappable) {
      if (this.tempSwapObject && this.tempSwapObject.selected) this.tempSwapObject.selected = false;
      if (!otherBody.selected) {
        this.tempSwapObject = otherBody;
        this.tempSwapObject.selected = true;
      }
    } else if (playerFixture === this.fixtures[1] && !otherFixture.isSensor()) {
      this.feetContactCount++;
      this.onLand();
    }
  }

  override onEndCollision(contact: Contact): void {
    const [playerFixture, otherFixture] = this.identifyCollision(contact);
    if (playerFixture === this.fixtures[1] && !otherFixture.isSensor()) {
      this.feetContactCount--;
      if (this.feetContactCount === 0) this.onAir();
    }
  }

  override onBeforeSolveCollision(contact: Contact, _oldManifold: Manifold): void {
    const other = this.identifyCollision(contact)[1].getUserData() as PhysicalBody | null;
    if (other && !other.affectsPlayer) contact.setEnabled(false);
  }

  override onAfterSolveCollision(_contact: Contact, impulse: ContactImpulse): void {
    const appliedForce = impulse.normalImpulses[0] * FRAMERATE;
    if (appliedForce > Settings.MAXFORCE) {
      this.kill();
      this.dead = true;
    }
  }

  override kill(): void {
    super.kill();
    this.onKillCallback?.();
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    const w1 = this.width / Settings.ratio;
    const h1 = this.height / Settings.ratio;
    const foot = Settings.FOOTSENSORSIZE / Settings.ratio;

    // Same fixtures, in the same order, as Player.as: body box, foot sensor, bottom circle, touch sensor.
    const boxHx = w1 / 2.2;
    const boxHy = h1 / 3;
    const footVertices = [Vec2(-w1 / 3, h1 / 2), Vec2(-w1 / 3, h1 / 2 + foot), Vec2(w1 / 3, h1 / 2 + foot), Vec2(w1 / 3, h1 / 2)];
    const circleCenter = Vec2(0, h1 / 3);
    this.fixtureDefs = [
      { shape: new Box(boxHx, boxHy) },
      { shape: new Polygon(footVertices), isSensor: true },
      { shape: new Circle(circleCenter, w1 / 2) },
      { shape: new Box(Settings.TOUCHSENSORRADIUS, Settings.TOUCHSENSORRADIUS), isSensor: true },
    ];

    // AS3 Box2D keeps the foot sensor's clockwise winding, which gives it negative mass; planck would
    // reorder it. Keep the original mass so pushing, weight switches and crush deaths behave the same.
    this.as3Mass = as3MassData([
      { vertices: [Vec2(-boxHx, -boxHy), Vec2(boxHx, -boxHy), Vec2(boxHx, boxHy), Vec2(-boxHx, boxHy)], density: this.density },
      { vertices: footVertices, density: this.density },
      { radius: w1 / 2, center: circleCenter, density: this.density },
    ]);

    super.createPhysicsObject(world, properties);
    this.removeTouchSensor();
    this.body.setBullet(true);
    return this.body;
  }

  protected override massChanged(): void {
    if (this.as3Mass) this.body.setMassData(this.as3Mass);
  }

  jump(): void {}

  onAir(): void {
    this.setFriction(0);
  }

  onLand(): void {
    this.setFriction(1);
  }

  setFriction(friction: number): void {
    for (const f of this.fixtures) f.setFriction(friction);
  }

  override get gravityVector(): Vec2 {
    return this._gravityVector;
  }

  // Gravity fields change the Flixel acceleration that FlxControl applies.
  override set gravityVector(v: Vec2) {
    this._gravityVector = v;
    setGravity(this.control, this.flx, v.x * Settings.ratio, v.y * Settings.ratio);
  }
}
