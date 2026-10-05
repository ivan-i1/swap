// Flixel's default "system" font, embedded by FlxGame.
import nokiaUrl from '../../src/org/flixel/data/nokiafc22.ttf';

export const FLIXEL_FONT = 'nokiafc22';

export async function loadFonts(): Promise<void> {
  const face = new FontFace(FLIXEL_FONT, `url(${nokiaUrl})`);
  document.fonts.add(await face.load());
}
