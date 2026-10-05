// Assets.as, plus the level files. Everything is imported in place from the ActionScript project.
import type Phaser from 'phaser';
import aniswap from '../../../assets/aniswap.png';
import breakableWall1 from '../../../assets/BreakableWall1.png';
import crate1 from '../../../assets/crate1.png';
import crate2 from '../../../assets/crate2.png';
import crate3 from '../../../assets/crate3.png';
import exit from '../../../assets/exit.png';
import forestBoulderLarge from '../../../assets/ForestBoulderLarge.png';
import sarah from '../../../assets/SarahSS.png';
import splash from '../../../assets/splash.png';
import squareRock1 from '../../../assets/SquareRock1.png';
import squareRock2 from '../../../assets/SquareRock2.png';
import squareRock3 from '../../../assets/SquareRock3.png';
import squareRock4 from '../../../assets/SquareRock4.png';
import step from '../../../assets/step.mp3';
import swaparea from '../../../assets/swaparea.png';
import switch1 from '../../../assets/switch1.png';
import dark from '../../../assets/test.mp3';
import button from '../../../src/org/flixel/data/button.png';

// Texture keys match the Assets.as field names so level constructor args (`Assets.SquareRock2`) resolve directly.
export const IMAGES: Record<string, string> = {
  SplashScreen: splash,
  ForestBoulderLarge: forestBoulderLarge,
  BreakableWall1: breakableWall1,
  SquareRock1: squareRock1,
  SquareRock2: squareRock2,
  SquareRock3: squareRock3,
  SquareRock4: squareRock4,
  Crate1: crate1,
  Crate2: crate2,
  Crate3: crate3,
  Switch1: switch1,
};

export const SPRITESHEETS: Record<string, { url: string; frameWidth: number; frameHeight: number }> = {
  Player: { url: sarah, frameWidth: 32, frameHeight: 32 },
  Exit: { url: exit, frameWidth: 48, frameHeight: 48 },
  SwapTrail: { url: aniswap, frameWidth: 64, frameHeight: 64 },
  SwapArea: { url: swaparea, frameWidth: 64, frameHeight: 64 },
  FlxButton: { url: button, frameWidth: 80, frameHeight: 20 },
};

export const SOUNDS: Record<string, string> = { step, dark };

// Level sources and the files they embed, keyed by repo-relative path.
const levelSources = import.meta.glob('../../../src/org/dinosaurriders/swap/levels/Level_Level*.as', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const csvSources = import.meta.glob('../../../assets/worlds/maps/*.csv', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const tilesetUrls = import.meta.glob('../../../assets/spritesheet*.png', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>;

const repoRelative = (globKey: string) => globKey.replace(/^(\.\.\/)+/, '');

export const LEVEL_SOURCES: Record<string, string> = Object.fromEntries(
  Object.entries(levelSources).map(([k, v]) => [/Level_(Level\d+)\.as$/.exec(k)![1], v]),
);
export const CSV: Record<string, string> = Object.fromEntries(Object.entries(csvSources).map(([k, v]) => [repoRelative(k), v]));
export const TILESETS: Record<string, string> = Object.fromEntries(Object.entries(tilesetUrls).map(([k, v]) => [repoRelative(k), v]));

export function assetKey(arg: string | number): string {
  return String(arg).replace(/^Assets\./, '');
}

export function preloadAll(load: Phaser.Loader.LoaderPlugin): void {
  for (const [key, url] of Object.entries(IMAGES)) load.image(key, url);
  for (const [key, s] of Object.entries(SPRITESHEETS)) load.spritesheet(key, s.url, { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
  for (const [path, url] of Object.entries(TILESETS)) load.image(path, url);
  for (const [key, url] of Object.entries(SOUNDS)) load.audio(key, url);
}
