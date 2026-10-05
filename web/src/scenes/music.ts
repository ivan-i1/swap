// FlxG.playMusic: one looping track that survives state switches and restarts whenever it is played again.
import type Phaser from 'phaser';

let music: Phaser.Sound.BaseSound | null = null;

export function playMusic(scene: Phaser.Scene, key: string): void {
  music?.stop();
  music?.destroy();
  music = scene.sound.add(key, { loop: true, volume: 1 });
  music.play();
}
