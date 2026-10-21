// PolygonBody.as, Tileblock.as, Exit.as, Switch.as, WeightSwitch.as, BreakableWall.as
import { Box, Polygon, Vec2, type Body, type Contact, type Manifold, type World } from 'planck';
import type { Prop } from '../../levels/parseLevel';
import type { Runtime } from '../runtime';
import { Settings } from '../settings';
import { PhysicalBody } from './PhysicalBody';
import { Player } from './Player';
import { Rubble } from './effects';

export class PolygonBody extends PhysicalBody {
  constructor(rt: Runtime, x: number, y: number, image: string, private sides = 4, density = 1, restitution = 0, friction = 1) {
    super(rt, x, y, density, restitution, friction);
    this.loadGraphic(image);
    this.bodyDef.type = 'dynamic';
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    let shape;
    if (this.sides === 4) {
      shape = new Box(this.width / Settings.ratio / 2, this.height / Settings.ratio / 2);
    } else {
      const dtheta = (2 * Math.PI) / this.sides;
      const radius = this.width / Settings.ratio / 2;
      // Start half a step round so even-sided shapes rest on a flat side.
      const initAngle = this.sides % 2 === 0 ? dtheta / 2 : 0;
      const vertices = [];
      for (let i = 0; i < this.sides; i++) {
        vertices.push(Vec2(Math.cos(dtheta * i + initAngle) * radius, Math.sin(dtheta * i + initAngle) * radius));
      }
      shape = new Polygon(vertices);
    }
    this.fixtureDefs[0] = { shape };
    return super.createPhysicsObject(world, properties);
  }
}

export class Tileblock extends PhysicalBody {
  constructor(rt: Runtime, x: number, y: number, density = 1, restitution = 0, friction = 2) {
    super(rt, x, y, density, restitution, friction);
    this.bodyDef.type = 'static';
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    this.fixtureDefs[0] = { shape: new Box(Settings.TILESIZE / Settings.ratio / 2, Settings.TILESIZE / Settings.ratio / 2) };
    return super.createPhysicsObject(world, properties);
  }
}

export class Exit extends PhysicalBody {
  private warpTo: string | null = null;

  constructor(rt: Runtime, x: number, y: number) {
    super(rt, x, y + 10, 0, 0, 0);
    this.loadGraphic('Exit', true, true, 48, 48);
    this.addAnimation('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 8, true);
    this.solid = false;
    this.immovable = false;
    this.bodyDef.fixedRotation = true;
    this.bodyDef.type = 'static';
    this.play('idle');
    // Exit.update re-applies a purple inner GlowFilter every frame.
    this.setGlow(0xcc00ff, 0, 0.6);
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    this.bodyDef.fixedRotation = true;
    this.fixtureDefs[0] = { shape: new Box(this.width / Settings.ratio / 2, this.height / Settings.ratio / 2), isSensor: true };
    for (const p of properties) if (p.name === 'warp') this.warpTo = String(p.value);
    return super.createPhysicsObject(world, properties);
  }

  override onStartCollision(contact: Contact): void {
    const other = this.identifyCollision(contact)[1].getUserData();
    if (other instanceof Player) other.exitLevel(this.warpTo);
  }
}

export class Switch extends PhysicalBody {
  activated = false;

  constructor(rt: Runtime, x: number, y: number, image: string) {
    super(rt, x, y, 1, 0, 1);
    this.loadGraphic(image);
    this.bodyDef.type = 'static';
  }

  protected activate(): void {
    this.activated = true;
    this.applyLinks();
  }

  protected deactivate(): void {
    this.activated = false;
    this.applyLinks();
  }

  // "require AND" links name other switches that must also be active; "onActivate ENABLE" links
  // are enabled while the requirements hold and disabled otherwise.
  private applyLinks(): void {
    let metRequirements = this.activated;
    for (const [, kind, target] of this.findAllObjectLinks('require')) {
      if (kind === 'AND' && !(target as Switch).activated) metRequirements = false;
    }
    for (const [, kind, target] of this.findAllObjectLinks('onActivate')) {
      if (kind === 'ENABLE') (target as PhysicalBody).enabled = metRequirements;
    }
  }
}

export class WeightSwitch extends Switch {
  private currentForce = 0;

  constructor(rt: Runtime, x: number, y: number, image: string, private requiredForce: number) {
    super(rt, x, y, image);
  }

  override onStartCollision(contact: Contact): void {
    const other = this.identifyCollision(contact)[1].getUserData() as PhysicalBody;
    this.currentForce += other.body.getMass() * other.gravityVector.length();
    if (this.currentForce >= this.requiredForce) this.activate();
  }

  override onEndCollision(contact: Contact): void {
    const other = this.identifyCollision(contact)[1].getUserData() as PhysicalBody;
    this.currentForce -= other.body.getMass() * other.gravityVector.length();
    if (this.currentForce < this.requiredForce) this.deactivate();
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    this.fixtureDefs[0] = { shape: new Box(this.width / Settings.ratio / 2, this.height / Settings.ratio / 2) };
    return super.createPhysicsObject(world, properties);
  }
}

export class BreakableWall extends PhysicalBody {
  constructor(rt: Runtime, x: number, y: number, image: string, private rubbleImage: string, private forceToBreak: number) {
    super(rt, x, y, 100, 0, 1);
    this.loadGraphic(image);
    this.bodyDef.type = 'static';
  }

  override createPhysicsObject(world: World, properties: Prop[] = []): Body {
    this.fixtureDefs[0] = { shape: new Box(this.width / Settings.ratio / 2, this.height / Settings.ratio / 2) };
    return super.createPhysicsObject(world, properties);
  }

  // Momentum along x only (the original's FIXME), checked every time the contact is about to be solved.
  override onBeforeSolveCollision(contact: Contact, _oldManifold: Manifold): void {
    if (!this.exists) return;
    const other = this.identifyCollision(contact)[1].getBody();
    const forceApplied = Math.abs(other.getLinearVelocity().x) * other.getMass();
    if (forceApplied > this.forceToBreak) {
      this.kill();
    } else if (forceApplied > this.forceToBreak * 0.3) {
      const rubble = new Rubble(this.rt, this.x, this.y + Math.random() * 50, this.rubbleImage);
      rubble.scale.x = rubble.scale.y = Math.random() * 0.1 + 0.05;
      this.rt.add(rubble);
    }
  }

  override kill(): void {
    for (let i = 0; i < 10; i++) {
      const rubble = new Rubble(this.rt, this.x, this.y + Math.random() * 50, this.rubbleImage);
      rubble.scale.x = rubble.scale.y = Math.random() * 0.25 + 0.25;
      this.rt.add(rubble);
    }
    super.kill();
  }
}
