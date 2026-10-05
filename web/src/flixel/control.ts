// Port of photonstorm's FlxControlHandler, reduced to the configuration Player.as uses:
// MOVEMENT_ACCELERATES + STOPPING_DECELERATES, left/right only, jump on a held key from the floor.
import { FLOOR, isTouching, type FlxObject } from './core';

const MOVE_SPEED = 500; // Settings.PLAYERSPEED
const MAX_X = 150; // Settings.PLAYERMAXVELOCITY
const MAX_Y = 10000; // Settings.PLAYERMAXFALLSPEED
const DECELERATION = 800; // Settings.PLAYERDECCELERATION
const JUMP_HEIGHT = 265; // Settings.PLAYERJUMP
const JUMP_RATE = 250; // repeat delay, ms
const JUMP_FROM_FALL = 200; // grace period after leaving a surface, ms

export interface ControlState {
  gravityX: number;
  gravityY: number;
  extraSurfaceTime: number;
  lastJumpTime: number;
  nextJumpTime: number;
}

export interface ControlKeys {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export function createControl(o: FlxObject): ControlState {
  o.maxVelocity.x = MAX_X;
  o.maxVelocity.y = MAX_Y;
  o.drag.x = DECELERATION;
  o.drag.y = 0;
  return { gravityX: 0, gravityY: 0, extraSurfaceTime: 0, lastJumpTime: 0, nextJumpTime: 0 };
}

// setGravity takes ints in AS3, so fractional forces are truncated.
export function setGravity(c: ControlState, o: FlxObject, x: number, y: number): void {
  c.gravityX = Math.trunc(x);
  c.gravityY = Math.trunc(y);
  o.acceleration.x = c.gravityX;
  o.acceleration.y = c.gravityY;
}

// `now` stands in for getTimer(): milliseconds since start.
export function updateControl(c: ControlState, o: FlxObject, keys: ControlKeys, now: number): { facing: 'left' | 'right' | null } {
  o.acceleration.x = c.gravityX;
  o.acceleration.y = c.gravityY;

  let facing: 'left' | 'right' | null = null;
  if (keys.left) {
    facing = 'left';
    o.acceleration.x = -MOVE_SPEED;
  } else if (keys.right) {
    facing = 'right';
    o.acceleration.x = MOVE_SPEED;
  }

  runJump(c, o, keys.jump, now);

  if (o.velocity.x > o.maxVelocity.x) o.velocity.x = o.maxVelocity.x;
  if (o.velocity.y > o.maxVelocity.y) o.velocity.y = o.maxVelocity.y;

  return { facing };
}

function runJump(c: ControlState, o: FlxObject, pressed: boolean, now: number): void {
  const onSurface = isTouching(o, FLOOR);
  if (onSurface) c.extraSurfaceTime = now + JUMP_FROM_FALL;
  if (!pressed) return;

  if (!onSurface) {
    if (now > c.extraSurfaceTime) return;
    if (c.lastJumpTime > c.extraSurfaceTime - JUMP_FROM_FALL) return;
  }
  if (now < c.nextJumpTime) return;

  o.velocity.y = c.gravityY > 0 ? -JUMP_HEIGHT : JUMP_HEIGHT;
  c.lastJumpTime = now;
  c.nextJumpTime = now + JUMP_RATE;
}
