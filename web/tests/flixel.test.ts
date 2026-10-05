import { describe, expect, it } from 'vitest';
import {
  DOWN, LEFT, RIGHT, UP, computeVelocity, createFlxObject, createTilemap, hullsOverlap, postUpdate, preUpdate,
  separate, updateMotion,
} from '../src/flixel/core';
import { createControl, setGravity, updateControl } from '../src/flixel/control';

const DT = 1 / 60;

describe('computeVelocity (FlxU)', () => {
  it('applies acceleration when non-zero, otherwise drag towards zero, then clamps to max', () => {
    expect(computeVelocity(0, 600, 800, 150, DT)).toBeCloseTo(10);
    expect(computeVelocity(100, 0, 800, 150, DT)).toBeCloseTo(100 - 800 / 60);
    expect(computeVelocity(5, 0, 800, 150, DT)).toBe(0);
    expect(computeVelocity(149, 6000, 0, 150, DT)).toBe(150);
    expect(computeVelocity(-149, -6000, 0, 150, DT)).toBe(-150);
  });
});

describe('updateMotion (FlxObject)', () => {
  it('integrates position with the half-step velocity, like Flixel', () => {
    const o = createFlxObject({ x: 0, y: 0, width: 8, height: 32 });
    o.acceleration.y = 600;
    updateMotion(o, DT);
    // velocity goes 0 -> 10, position moves by the midpoint velocity (5) * dt
    expect(o.velocity.y).toBeCloseTo(10);
    expect(o.y).toBeCloseTo(5 * DT);
  });
});

describe('separate (FlxObject.separate)', () => {
  it('lands a falling object on an immovable one: snaps on top, zeroes velocity, sets touching', () => {
    const floor = createFlxObject({ x: 0, y: 100, width: 64, height: 32, immovable: true });
    const p = createFlxObject({ x: 10, y: 70, width: 8, height: 32 });
    preUpdate(floor);
    preUpdate(p);
    p.y = 72; // moved 2px down this frame and now overlaps the floor by 4px
    p.velocity.y = 120;
    expect(separate(p, floor)).toBe(true);
    expect(p.y).toBe(68);
    expect(p.velocity.y).toBe(0);
    expect(p.touching & DOWN).toBeTruthy();
    expect(floor.touching & UP).toBeTruthy();
  });

  it('blocks horizontal movement into a wall', () => {
    const wall = createFlxObject({ x: 100, y: 0, width: 32, height: 64, immovable: true });
    const p = createFlxObject({ x: 90, y: 10, width: 8, height: 32 });
    preUpdate(wall);
    preUpdate(p);
    p.x = 94;
    p.velocity.x = 150;
    separate(p, wall);
    expect(p.x).toBe(92);
    expect(p.velocity.x).toBe(0);
    expect(p.touching & RIGHT).toBeTruthy();
    expect(wall.touching & LEFT).toBeTruthy();
  });

  it('ignores overlaps deeper than the movement plus OVERLAP_BIAS', () => {
    const block = createFlxObject({ x: 0, y: 100, width: 64, height: 32, immovable: true });
    const p = createFlxObject({ x: 10, y: 80, width: 8, height: 32 });
    preUpdate(block);
    preUpdate(p);
    p.y = 81; // 13px deep after moving 1px: more than 1 + 4
    expect(separate(p, block)).toBe(false);
    expect(p.y).toBe(81);
  });

  it('carries an object riding a horizontally moving immovable platform', () => {
    const plat = createFlxObject({ x: 0, y: 100, width: 64, height: 32, immovable: true });
    const p = createFlxObject({ x: 10, y: 66, width: 8, height: 32 });
    preUpdate(plat);
    preUpdate(p);
    plat.x = 3;
    p.y = 70;
    separate(p, plat);
    expect(p.y).toBe(68);
    expect(p.x).toBe(13);
  });

  it('does nothing for non-solid objects', () => {
    const ghost = createFlxObject({ x: 0, y: 100, width: 64, height: 32, immovable: true, allowCollisions: 0 });
    const p = createFlxObject({ x: 10, y: 70, width: 8, height: 32 });
    preUpdate(ghost);
    preUpdate(p);
    p.y = 72;
    expect(separate(p, ghost)).toBe(false);
  });
});

describe('separate against a tilemap (FlxTilemap.overlapsWithCallback)', () => {
  // 4x3 map, bottom row solid; tile 0 is empty, anything >= collideIdx is solid
  const map = () => createTilemap({ x: 0, y: 0, tileWidth: 32, tileHeight: 32, widthInTiles: 4, heightInTiles: 3, collideIdx: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3] });

  it('lands on solid tiles', () => {
    const m = map();
    const p = createFlxObject({ x: 40, y: 30, width: 8, height: 32 });
    preUpdate(p);
    p.y = 34;
    p.velocity.y = 200;
    expect(separate(p, m)).toBe(true);
    expect(p.y).toBe(32);
    expect(p.velocity.y).toBe(0);
    expect(p.touching & DOWN).toBeTruthy();
  });

  it('passes through empty tiles', () => {
    const m = map();
    const p = createFlxObject({ x: 40, y: 0, width: 8, height: 32 });
    preUpdate(p);
    p.y = 4;
    expect(separate(p, m)).toBe(false);
    expect(p.y).toBe(4);
  });
});

describe('hullsOverlap (FlxQuadTree broad phase)', () => {
  it('uses the swept hull from last to current position', () => {
    const a = createFlxObject({ x: 0, y: 0, width: 10, height: 10 });
    preUpdate(a);
    a.x = 30;
    expect(hullsOverlap(a, createFlxObject({ x: 15, y: 0, width: 5, height: 5 }))).toBe(true);
    expect(hullsOverlap(a, createFlxObject({ x: 45, y: 0, width: 5, height: 5 }))).toBe(false);
  });
});

describe('postUpdate', () => {
  it('moves the object and clears touching after remembering it', () => {
    const o = createFlxObject({ x: 0, y: 0, width: 8, height: 8 });
    o.touching = DOWN;
    o.velocity.x = 60;
    postUpdate(o, DT);
    expect(o.x).toBeCloseTo(1);
    expect(o.wasTouching).toBe(DOWN);
    expect(o.touching).toBe(0);
  });
});

describe('FlxControl (photonstorm) as configured by Player.as', () => {
  const setup = () => {
    const o = createFlxObject({ x: 0, y: 0, width: 8, height: 32 });
    const c = createControl(o);
    setGravity(c, o, 0, 500);
    return { o, c };
  };
  const keys = (k: Partial<{ left: boolean; right: boolean; jump: boolean }> = {}) => ({ left: false, right: false, jump: false, ...k });

  it('sets max velocity 150/10000 and x drag 800', () => {
    const { o } = setup();
    expect(o.maxVelocity).toEqual({ x: 150, y: 10000 });
    expect(o.drag).toEqual({ x: 800, y: 0 });
  });

  it('accelerates at 500 while an arrow is held and resets acceleration to gravity otherwise', () => {
    const { o, c } = setup();
    expect(updateControl(c, o, keys({ right: true }), 0)).toMatchObject({ facing: 'right' });
    expect(o.acceleration).toEqual({ x: 500, y: 500 });
    updateControl(c, o, keys({ left: true }), 16);
    expect(o.acceleration.x).toBe(-500);
    updateControl(c, o, keys(), 32);
    expect(o.acceleration).toEqual({ x: 0, y: 500 });
  });

  it('jumps (vy = -265) only from the floor, respecting the 250ms repeat delay', () => {
    const { o, c } = setup();
    updateControl(c, o, keys({ jump: true }), 1000);
    expect(o.velocity.y).toBe(0);

    o.touching = DOWN;
    updateControl(c, o, keys({ jump: true }), 1000);
    expect(o.velocity.y).toBe(-265);

    o.velocity.y = 0;
    updateControl(c, o, keys({ jump: true }), 1100);
    expect(o.velocity.y).toBe(0);
    updateControl(c, o, keys({ jump: true }), 1250);
    expect(o.velocity.y).toBe(-265);
  });

  it('allows a jump within 200ms of walking off a ledge, once', () => {
    const { o, c } = setup();
    o.touching = DOWN;
    updateControl(c, o, keys(), 1000);
    o.touching = 0;
    updateControl(c, o, keys({ jump: true }), 1150);
    expect(o.velocity.y).toBe(-265);
    o.velocity.y = 0;
    updateControl(c, o, keys({ jump: true }), 1190);
    expect(o.velocity.y).toBe(0);
  });

  it('jumps downwards when gravity points up', () => {
    const { o, c } = setup();
    setGravity(c, o, 0, -500);
    o.touching = DOWN;
    updateControl(c, o, keys({ jump: true }), 1000);
    expect(o.velocity.y).toBe(265);
  });

  it('caps only positive velocity, as FlxControlHandler does', () => {
    const { o, c } = setup();
    o.velocity.x = 400;
    updateControl(c, o, keys(), 0);
    expect(o.velocity.x).toBe(150);
    o.velocity.x = -400;
    updateControl(c, o, keys(), 16);
    expect(o.velocity.x).toBe(-400);
  });
});
