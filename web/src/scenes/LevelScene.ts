// Hosts a LevelContainer and drives it on Flixel's fixed 60Hz step.
import Phaser from 'phaser';
import { LevelContainer } from '../game/LevelContainer';
import { ELAPSED } from '../game/settings';
import { playMusic } from './music';
import { KeyTracker } from './keys';

const STEP_MS = 1000 * ELAPSED;
// FlxGame caps the catch-up at 2000 / flashFramerate - 1 ms (flash framerate 30).
const MAX_ACCUMULATION = 2000 / 30 - 1;

export class LevelScene extends Phaser.Scene {
  private container!: LevelContainer;
  private keys!: KeyTracker;
  private accumulator = 0;
  private levelName = 'Level1';

  constructor() {
    super('Level');
  }

  init(data: { level?: string }): void {
    this.levelName = data.level ?? 'Level1';
    this.accumulator = 0;
  }

  create(): void {
    this.keys = new KeyTracker(this.input.keyboard!);
    this.container = new LevelContainer(this, this.keys, this.levelName);
    playMusic(this, 'dark');
    // Exposed for automated play-checks and debugging.
    (window as unknown as { swap: unknown }).swap = { level: this.levelName, container: this.container };
  }

  update(_time: number, delta: number): void {
    this.accumulator = Math.min(this.accumulator + delta, MAX_ACCUMULATION);
    while (this.accumulator >= STEP_MS) {
      this.accumulator -= STEP_MS;
      this.keys.sample();
      this.container.tick();
      const outcome = this.container.outcome;
      if (outcome) {
        if (outcome.kind === 'endgame') this.scene.start('Endgame');
        else this.scene.restart({ level: outcome.level });
        return;
      }
    }
    this.container.render();
  }
}
