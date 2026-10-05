import { describe, expect, it } from 'vitest';
import {
  JUMP_POWER,
  MAX_ENERGY,
  MOVE_SPEED,
  createPlayerControl,
  stepPlayerControl,
  type ControlInput,
} from '../src/game/playerControl';

const DT = 1 / 60;
const none: ControlInput = { left: false, right: false, jump: false };

describe('stepPlayerControl (port of Player.update)', () => {
  it('accelerates left/right by move speed * dt and sets facing', () => {
    const s = createPlayerControl();
    const l = stepPlayerControl(s, { x: 0, y: 0 }, { ...none, left: true }, DT);
    expect(l.velocity.x).toBeCloseTo(-MOVE_SPEED * DT);
    expect(l.facing).toBe('left');
    const r = stepPlayerControl(s, { x: 0, y: 0 }, { ...none, right: true }, DT);
    expect(r.velocity.x).toBeCloseTo(MOVE_SPEED * DT);
    expect(r.facing).toBe('right');
  });

  it('left wins when both directions are held (else-if order of the original)', () => {
    const out = stepPlayerControl(createPlayerControl(), { x: 0, y: 0 }, { ...none, left: true, right: true }, DT);
    expect(out.facing).toBe('left');
  });

  it('keeps previous facing when no direction is held', () => {
    const s = createPlayerControl();
    stepPlayerControl(s, { x: 0, y: 0 }, { ...none, left: true }, DT);
    expect(stepPlayerControl(s, { x: 0, y: 0 }, none, DT).facing).toBe('left');
  });

  it('thrusts upward while jump is held and drains energy', () => {
    const s = createPlayerControl();
    const out = stepPlayerControl(s, { x: 0, y: 0 }, { ...none, jump: true }, DT);
    expect(out.velocity.y).toBeCloseTo(-JUMP_POWER * DT);
    expect(s.energy).toBeCloseTo(MAX_ENERGY - DT);
  });

  it('runs out of energy after MAX_ENERGY seconds, then waits 0.2s before refilling', () => {
    const s = createPlayerControl();
    let thrustSteps = 0;
    for (let i = 0; i < 60; i++) {
      const out = stepPlayerControl(s, { x: 0, y: 0 }, { ...none, jump: true }, DT);
      if (out.velocity.y < 0) thrustSteps++;
      else break;
    }
    // 0.3s of fuel at 60Hz = 18 steps (float drift may give one extra)
    expect(thrustSteps).toBeGreaterThanOrEqual(18);
    expect(thrustSteps).toBeLessThanOrEqual(19);
    expect(s.energyWaitTimer).toBeCloseTo(0.2 - DT);

    // While waiting, energy does not refill.
    const before = s.energy;
    for (let i = 0; i < 10; i++) stepPlayerControl(s, { x: 0, y: 0 }, none, DT);
    expect(s.energy).toBe(before);
    // After the wait, energy refills up to MAX_ENERGY and no further.
    for (let i = 0; i < 120; i++) stepPlayerControl(s, { x: 0, y: 0 }, none, DT);
    expect(s.energy).toBe(MAX_ENERGY);
  });

  it('picks the animation from velocity like the original', () => {
    const s = createPlayerControl();
    expect(stepPlayerControl(s, { x: 0, y: -5 }, none, DT).animation).toBe('jump');
    expect(stepPlayerControl(s, { x: 0, y: 5 }, none, DT).animation).toBe('fall');
    expect(stepPlayerControl(s, { x: 0, y: 0 }, none, DT).animation).toBe('idle');
    expect(stepPlayerControl(s, { x: 3, y: 0 }, none, DT).animation).toBe('move');
  });

  it('picks the animation from the velocity after this step\'s input, as Player.as does', () => {
    const s = createPlayerControl();
    expect(stepPlayerControl(s, { x: 0, y: 0 }, { ...none, jump: true }, DT).animation).toBe('jump');
    expect(stepPlayerControl(s, { x: 0, y: 0 }, { ...none, right: true }, DT).animation).toBe('move');
  });
});
