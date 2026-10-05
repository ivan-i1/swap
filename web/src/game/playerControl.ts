// Port of the input/energy/animation logic in objects/Player.as, kept free of Phaser so it can be unit-tested.

export const MOVE_SPEED = 400;
export const JUMP_POWER = 1800;
export const MAX_ENERGY = 0.3;
const ENERGY_WAIT = 0.2;

export type Facing = 'left' | 'right';
export type PlayerAnimation = 'jump' | 'fall' | 'idle' | 'move';

export interface ControlInput {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface PlayerControlState {
  energy: number;
  energyWaitTimer: number;
  facing: Facing;
}

export interface Vec2 {
  x: number;
  y: number;
}

export function createPlayerControl(): PlayerControlState {
  return { energy: MAX_ENERGY, energyWaitTimer: 0, facing: 'right' };
}

// Mutates `state`; returns the new velocity and what the sprite should show.
export function stepPlayerControl(
  state: PlayerControlState,
  velocity: Vec2,
  input: ControlInput,
  dt: number,
): { velocity: Vec2; facing: Facing; animation: PlayerAnimation } {
  let { x: vx, y: vy } = velocity;

  if (input.left) {
    state.facing = 'left';
    vx -= MOVE_SPEED * dt;
  } else if (input.right) {
    state.facing = 'right';
    vx += MOVE_SPEED * dt;
  }

  if (input.jump && state.energy > 0) {
    vy -= JUMP_POWER * dt;
    state.energy -= dt;
    if (state.energy <= 0) state.energyWaitTimer = ENERGY_WAIT;
  } else if (state.energyWaitTimer > 0) {
    state.energyWaitTimer -= dt;
  } else {
    state.energy = Math.min(state.energy + dt, MAX_ENERGY);
  }

  let animation: PlayerAnimation;
  if (vy < 0) animation = 'jump';
  else if (vy > 0) animation = 'fall';
  else if (vx === 0) animation = 'idle';
  else animation = 'move';

  return { velocity: { x: vx, y: vy }, facing: state.facing, animation };
}
