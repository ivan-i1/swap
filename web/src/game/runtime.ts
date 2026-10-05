// What game objects need from the running level (LevelContainer + FlxG in the original).
import type Phaser from 'phaser';
import type { World } from 'planck';
import type { PhysicsUtil } from './physicsUtil';
import type { GameSprite } from './sprite';
import type { TimerManager } from './timer';

export interface KeyState {
  pressed(key: string): boolean;
  justPressed(key: string): boolean;
  justReleased(key: string): boolean;
}

export interface Runtime {
  scene: Phaser.Scene;
  world: World;
  timers: TimerManager;
  physics: PhysicsUtil;
  keys: KeyState;
  /** getTimer(): ms of game time. */
  now(): number;
  /** FlxG.state.add: appended to the update list and drawn above the level. */
  add<T extends GameSprite>(obj: T): T;
  /** FlxG.state.remove */
  remove(obj: GameSprite): void;
  /** Run a planck mutation now, or right after the current step if the world is locked. */
  physicsOp(fn: () => void): void;
  flash(color: number, duration: number): void;
  playSound(key: string, volume: number): void;
  endGame(): void;
}
