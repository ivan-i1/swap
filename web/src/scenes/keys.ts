// Flixel-style keyboard: pressed / justPressed / justReleased sampled once per game tick, from key events so
// that a tap shorter than a tick is not lost.
import Phaser from 'phaser';
import type { KeyState } from '../game/runtime';

const CODES: Record<string, number> = {
  LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
  RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  UP: Phaser.Input.Keyboard.KeyCodes.UP,
  DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
  SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
  X: Phaser.Input.Keyboard.KeyCodes.X,
  S: Phaser.Input.Keyboard.KeyCodes.S,
  R: Phaser.Input.Keyboard.KeyCodes.R,
};

export class KeyTracker implements KeyState {
  private keys = new Map<string, Phaser.Input.Keyboard.Key>();
  private downs = new Set<string>();
  private ups = new Set<string>();
  private justDown = new Set<string>();
  private justUp = new Set<string>();

  constructor(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
    for (const [name, code] of Object.entries(CODES)) {
      const key = keyboard.addKey(code);
      key.on('down', () => this.downs.add(name));
      key.on('up', () => this.ups.add(name));
      this.keys.set(name, key);
    }
  }

  /** Call at the start of each tick. */
  sample(): void {
    this.justDown = this.downs;
    this.justUp = this.ups;
    this.downs = new Set();
    this.ups = new Set();
  }

  pressed(key: string): boolean {
    return Boolean(this.keys.get(key)?.isDown) || this.justDown.has(key);
  }

  justPressed(key: string): boolean {
    return this.justDown.has(key);
  }

  justReleased(key: string): boolean {
    return this.justUp.has(key);
  }
}
