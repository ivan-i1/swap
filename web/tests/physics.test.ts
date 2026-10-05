import { Box, Circle, Polygon, Transform, Vec2, World } from 'planck';
import { describe, expect, it } from 'vitest';
import { BuoyancyController } from '../src/physics/buoyancy';
import { as3MassData, computeSubmergedArea } from '../src/physics/as3shapes';

const identity = Transform.identity();
const down = Vec2(0, -1); // normal (0,-1), offset o => surface is y = -o, "submerged" where y > -o

describe('computeSubmergedArea (Box2D AS3 b2Shape.ComputeSubmergedArea)', () => {
  it('returns the full area and centroid for a fully submerged box', () => {
    const c = Vec2();
    const area = computeSubmergedArea(Box(1, 0.5), down, 10, identity, c);
    expect(area).toBeCloseTo(2);
    expect(c.x).toBeCloseTo(0);
    expect(c.y).toBeCloseTo(0);
  });

  it('returns zero when dry', () => {
    expect(computeSubmergedArea(Box(1, 0.5), down, -10, identity, Vec2())).toBe(0);
  });

  it('cuts a box at the surface plane', () => {
    // plane through y = 0: lower half (y > 0) is submerged
    const c = Vec2();
    const area = computeSubmergedArea(Box(1, 0.5), Vec2(0, -1), 0, identity, c);
    expect(area).toBeCloseTo(1);
    expect(c.y).toBeCloseTo(0.25);
  });

  it('handles circles: full, dry and half', () => {
    const c = Vec2();
    expect(computeSubmergedArea(Circle(1), down, 10, identity, c)).toBeCloseTo(Math.PI);
    expect(computeSubmergedArea(Circle(1), down, -10, identity, c)).toBe(0);
    expect(computeSubmergedArea(Circle(1), Vec2(0, -1), 0, identity, c)).toBeCloseTo(Math.PI / 2);
    expect(c.y).toBeCloseTo(4 / (3 * Math.PI));
  });
});

describe('as3MassData (b2Body.ResetMassData with AS3 signed polygon areas)', () => {
  it('gives a clockwise polygon negative mass, as Player.as foot sensor gets in Box2D AS3', () => {
    const ccw = as3MassData([{ vertices: [Vec2(-1, -1), Vec2(1, -1), Vec2(1, 1), Vec2(-1, 1)], density: 2 }]);
    expect(ccw.mass).toBeCloseTo(8);
    const cw = as3MassData([
      { vertices: [Vec2(-1, -1), Vec2(1, -1), Vec2(1, 1), Vec2(-1, 1)], density: 2 },
      { vertices: [Vec2(-1, 1), Vec2(-1, 2), Vec2(1, 2), Vec2(1, 1)], density: 1 },
    ]);
    expect(cw.mass).toBeCloseTo(8 - 2);
  });

  it('adds circles at their local position', () => {
    const m = as3MassData([{ radius: 1, center: Vec2(0, 2), density: 1 }]);
    expect(m.mass).toBeCloseTo(Math.PI);
    expect(m.center.y).toBeCloseTo(2);
  });
});

describe('BuoyancyController (b2BuoyancyController with zero world gravity)', () => {
  it('only drags submerged bodies (no lift because world gravity is zero)', () => {
    const world = new World({ gravity: Vec2(0, 0) });
    const body = world.createBody({ type: 'dynamic', position: Vec2(0, 0) });
    body.createFixture(Polygon([Vec2(-0.5, -0.5), Vec2(0.5, -0.5), Vec2(0.5, 0.5), Vec2(-0.5, 0.5)]), 1);
    body.setLinearVelocity(Vec2(4, 0));

    const bc = new BuoyancyController(world);
    bc.normal.set(0, -1);
    bc.offset = 10;
    bc.density = 200;
    bc.linearDrag = 500;
    bc.angularDrag = 250;
    bc.addBody(body);
    bc.step();

    // Force is -linearDrag * area * velocity = -500 * 1 * 4 on x, nothing on y.
    const force = (body as unknown as { m_force: Vec2 }).m_force;
    expect(force.x).toBeCloseTo(-2000);
    expect(force.y).toBeCloseTo(0);
  });

  it('skips sleeping bodies and bodies that left the controller', () => {
    const world = new World();
    const body = world.createBody({ type: 'dynamic' });
    body.createFixture(Box(0.5, 0.5), 1);
    body.setLinearVelocity(Vec2(1, 0));
    const bc = new BuoyancyController(world);
    bc.offset = 10;
    bc.addBody(body);
    bc.removeBody(body);
    bc.step();
    expect((body as unknown as { m_force: Vec2 }).m_force.x).toBe(0);
  });
});
