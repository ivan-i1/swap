import { describe, expect, it } from 'vitest';
import { parseFlixelCsv } from '../src/game/tilemapCsv';

describe('parseFlixelCsv', () => {
  it('maps Flixel empty tile 0 to Phaser empty tile -1 and keeps other indices as frames', () => {
    expect(parseFlixelCsv('0,3,17\n10,0,2\n')).toEqual([
      [-1, 3, 17],
      [10, -1, 2],
    ]);
  });

  it('ignores blank lines and CRLF line endings', () => {
    expect(parseFlixelCsv('1,0\r\n\r\n0,1\r\n')).toEqual([
      [1, -1],
      [-1, 1],
    ]);
  });
});
