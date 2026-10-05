import Phaser from 'phaser';
import { loadFonts } from './fonts';
import { LevelScene } from './scenes/LevelScene';
import { TitleScene } from './scenes/TitleScene';

// Flixel.as: new FlxGame(800, 600, Inicio, zoom 1, 60 updates/s).
await loadFonts();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { fps: 60, fixedStep: true } },
  scene: [TitleScene, LevelScene],
});

// Handy for poking at the game from devtools.
(window as unknown as { game: Phaser.Game }).game = game;
