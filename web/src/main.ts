import Phaser from 'phaser';
import { loadFonts } from './fonts';
import { EndgameScene } from './scenes/EndgameScene';
import { LevelScene } from './scenes/LevelScene';
import { TitleScene } from './scenes/TitleScene';

// Flixel.as: new FlxGame(640, 480, Inicio, zoom 1, 60 updates/s, 30 draws/s).
await loadFonts();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  height: 480,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [TitleScene, LevelScene, EndgameScene],
});

(window as unknown as { game: Phaser.Game }).game = game;
