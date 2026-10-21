// Settings.as
export const Settings = {
  ratio: 50, // pixels per Box2D metre
  TILESIZE: 32,
  SCREENX: 640,
  SCREENY: 480,

  DEFAULTGRAVITYY: 10,
  DEFAULTGRAVITYX: 0,

  FOOTSENSORSIZE: 5,
  MAXFORCE: 10000,
  TOUCHSENSORRADIUS: 0.5,
  SWAPCOOLDOWN: 1,
  SWAPSKIPCOUNT: 2,
  TEXTDURATION: 4,
} as const;

// Flixel game settings from Flixel.as: new FlxGame(640, 480, Inicio, 1, 60, 30, true)
export const FRAMERATE = 60;
export const ELAPSED = 1 / FRAMERATE;
