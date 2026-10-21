import Phaser from 'phaser';
import { loadFonts } from './fonts';
import { listenToKeyboard } from './input/keyboard';
import { setupNative } from './native';
import { EndgameScene } from './scenes/EndgameScene';
import { LevelScene } from './scenes/LevelScene';
import { TitleScene } from './scenes/TitleScene';

// Flixel.as: new FlxGame(640, 480, Inicio, zoom 1, 60 updates/s, 30 draws/s).
await loadFonts();
listenToKeyboard();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  height: 480,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  // Two thumbs on the touch buttons plus one on the canvas.
  input: { activePointers: 3, keyboard: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [TitleScene, LevelScene, EndgameScene],
});

setupNative(game);
(window as unknown as { game: Phaser.Game }).game = game;
