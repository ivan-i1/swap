// Port of Box2D AS3 2.1a b2BuoyancyController (planck.js has no controllers).
import { Vec2, type Body, type World } from 'planck';
import { computeSubmergedArea } from './as3shapes';

export class BuoyancyController {
  normal = Vec2(0, -1);
  offset = 0;
  density = 0;
  velocity = Vec2(0, 0);
  linearDrag = 2;
  angularDrag = 1;
  private bodies = new Set<Body>();

  constructor(private world: World) {}

  addBody(body: Body): void {
    this.bodies.add(body);
  }

  removeBody(body: Body): void {
    this.bodies.delete(body);
  }

  step(): void {
    // useWorldGravity: the game's world gravity is zero, so lift is always zero and only drag acts.
    const gravity = this.world.getGravity();
    for (const body of this.bodies) {
      if (!body.isAwake()) continue;
      const areac = Vec2();
      const massc = Vec2();
      let area = 0;
      let mass = 0;
      for (let f = body.getFixtureList(); f; f = f.getNext()) {
        const sc = Vec2();
        const sarea = computeSubmergedArea(f.getShape(), this.normal, this.offset, body.getTransform(), sc);
        area += sarea;
        areac.x += sarea * sc.x;
        areac.y += sarea * sc.y;
        mass += sarea;
        massc.x += sarea * sc.x;
        massc.y += sarea * sc.y;
      }
      areac.x /= area;
      areac.y /= area;
      massc.x /= mass;
      massc.y /= mass;
      if (area < Number.MIN_VALUE) continue;

      const buoyancyForce = Vec2.neg(gravity).mul(this.density * area);
      body.applyForce(buoyancyForce, massc);
      const dragForce = body.getLinearVelocityFromWorldPoint(areac).sub(this.velocity).mul(-this.linearDrag * area);
      body.applyForce(dragForce, areac);
      body.applyTorque((-body.getInertia() / body.getMass()) * area * body.getAngularVelocity() * this.angularDrag);
    }
  }
}
