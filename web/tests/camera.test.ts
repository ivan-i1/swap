import { describe, expect, it } from 'vitest';
import { clampToBounds, followDeadzone, platformerDeadzone } from '../src/game/camera';

describe('clampToBounds (FlxCamera.setBounds)', () => {
  it('keeps the view inside the bounds, left/top first then right/bottom', () => {
    const bounds = { x: 0, y: -32, width: 1120, height: 512 };
    expect(clampToBounds({ x: -40, y: -100 }, bounds, 640, 480)).toEqual({ x: 0, y: -32 });
    expect(clampToBounds({ x: 900, y: 200 }, bounds, 640, 480)).toEqual({ x: 480, y: 0 });
  });

  it('lets right/bottom win when the bounds are smaller than the view', () => {
    expect(clampToBounds({ x: 0, y: 0 }, { x: 0, y: 0, width: 320, height: 240 }, 640, 480)).toEqual({ x: -320, y: -240 });
  });
});

describe('platformerDeadzone (FlxCamera.STYLE_PLATFORMER)', () => {
  it('is width/8 by height/3, centred horizontally and raised by a quarter of its height', () => {
    // 800x600: w=100, h=200, x=(800-100)/2=350, y=(600-200)/2-50=150
    expect(platformerDeadzone(800, 600)).toEqual({ x: 350, y: 150, width: 100, height: 200 });
  });
});

describe('followDeadzone (FlxCamera.update)', () => {
  const dz = platformerDeadzone(800, 600);
  const target = { width: 28, height: 48 };

  it('does not move the camera while the target stays inside the deadzone', () => {
    const scroll = { x: 0, y: 0 };
    expect(followDeadzone(scroll, { ...target, x: 360, y: 200 }, dz)).toEqual({ x: 0, y: 0 });
  });

  it('pushes the camera when the target leaves the deadzone on the left/top', () => {
    const out = followDeadzone({ x: 0, y: 0 }, { ...target, x: 300, y: 100 }, dz);
    expect(out.x).toBeCloseTo(-50);
    expect(out.y).toBeCloseTo(-50);
  });

  it('pushes the camera when the target leaves the deadzone on the right/bottom', () => {
    // right edge: 500+28 - 350 - 100 = 78; bottom: 400+48 - 150 - 200 = 98
    const out = followDeadzone({ x: 0, y: 0 }, { ...target, x: 500, y: 400 }, dz);
    expect(out.x).toBeCloseTo(78);
    expect(out.y).toBeCloseTo(98);
  });
});
