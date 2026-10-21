// Rubble.as, SwapTrail.as, SwapAreaSprite.as
import type { Runtime } from '../runtime';
import { Settings } from '../settings';
import { GameSprite } from '../sprite';

export class Rubble extends GameSprite {
  constructor(rt: Runtime, x: number, y: number, image: string) {
    // Rubble.as takes int coordinates.
    super(rt, Math.trunc(x), Math.trunc(y));
    this.loadGraphic(image);
    this.velocity.x = Math.random() * 100 - 50;
    this.velocity.y = Math.random() * 100 - 50;
    this.acceleration.y = 10 * Settings.ratio;
    rt.timers.create().start(0.5, 0, () => this.flicker());
    rt.timers.create().start(1, 0, () => this.kill());
  }
}

export class SwapTrail extends GameSprite {
  constructor(rt: Runtime, x: number, y: number) {
    super(rt, Math.trunc(x), Math.trunc(y));
    this.loadGraphic('SwapTrail', true, false, 64, 64);
    this.solid = false;
    this.addAnimation('play', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12);
    this.play('play');
    // SwapTrail.as starts the same FlxTimer twice, so only the fade (12 x -0.1 alpha every 0.16s) runs.
    rt.timers.create().start(0.16, 12, () => {
      this.alpha -= 0.1;
    });
  }
}

export class SwapAreaSprite extends GameSprite {
  constructor(rt: Runtime, x: number, y: number, private follow: GameSprite) {
    super(rt, Math.trunc(x), Math.trunc(y));
    this.loadGraphic('SwapArea', false, false, 64, 64);
  }

  override update(): void {
    this.x = this.follow.x - this.follow.width - 18;
    this.y = this.follow.y - this.follow.height / 2;
  }
}
