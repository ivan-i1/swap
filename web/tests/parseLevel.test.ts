import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseLevel } from '../src/levels/parseLevel';

const LEVELS_DIR = join(__dirname, '../../src/org/dinosaurriders/swap/levels');
const read = (name: string) => readFileSync(join(LEVELS_DIR, `Level_${name}.as`), 'utf8');

describe('parseLevel (DAME flixelComplex export → data)', () => {
  const level2 = parseLevel('Level2', read('Level2'));

  it('reads tile layers with their CSV/tileset embeds, placement and scroll factors', () => {
    expect(level2.layers.map((l) => l.name)).toEqual(['Sky', 'Background', 'PlayerLayer', 'FrontLayer']);
    const sky = level2.layers[0];
    expect(sky).toMatchObject({
      csv: 'assets/worlds/maps/mapCSV_Level2_Sky.csv',
      image: 'assets/spritesheet1.png',
      x: 0, y: -32, tileWidth: 32, tileHeight: 32, scrollX: 0.25, scrollY: 0.25, hits: false, collideIdx: 1, drawIdx: 1,
    });
    expect(level2.layers.filter((l) => l.hits).map((l) => l.name)).toEqual(['PlayerLayer']);
  });

  it('collects DAME tile properties visible when each layer is added', () => {
    expect(level2.layers[2].tileProperties).toEqual({
      14: [{ name: 'kills', value: true }],
      15: [{ name: 'kills', value: true }],
    });
  });

  it('keeps masterLayer draw order, bounds and background colour', () => {
    expect(level2.drawOrder).toEqual(['Sky', 'Background', 'PlayerLayer', 'SpritesGroup', 'FrontLayer', 'TextGroup']);
    expect(level2.bounds).toEqual({ minX: 0, minY: -32, maxX: 1120, maxY: 480 });
    expect(level2.bgColor).toBe(0xff88beef);
  });

  it('lists entities in creation order (shapes, then sprites) with link ids and properties', () => {
    const kinds = level2.entities.map((e) => e.kind);
    expect(kinds).toEqual(['text', 'box', 'box', 'box', 'text', 'text', 'box', 'sprite', 'sprite', 'sprite']);

    expect(level2.entities[0]).toMatchObject({
      kind: 'text', id: 13, x: 0, y: 30, width: 510, height: 50,
      text: 'Thankfully, I can jump over obstacles like this one by pressing the [SPACE] key.',
      font: 'system', size: 11, color: 0x000000, align: 'center',
    });
    expect(level2.entities[1]).toMatchObject({ kind: 'box', id: 12, x: 120, y: 210, width: 50, height: 200, props: [] });
    expect(level2.entities[6]).toMatchObject({ kind: 'box', id: undefined, x: 810, y: 330 });

    expect(level2.entities[7]).toMatchObject({ kind: 'sprite', type: 'Player', ctorArgs: null, x: 0, y: 383, props: [] });
    expect(level2.entities[8]).toMatchObject({
      kind: 'sprite', type: 'Exit', ctorArgs: [1080, 352, 'Assets.Exit'], x: 1080, y: 352,
      props: [{ name: 'sensor', value: true }, { name: 'warp', value: 'Level3' }],
    });
    expect(level2.entities[9]).toMatchObject({
      kind: 'sprite', type: 'PolygonBody', ctorArgs: [446, 352, 'Assets.SquareRock3', 4, 2000],
      props: [{ name: 'swappable', value: false }],
    });
  });

  it('reads object links', () => {
    expect(level2.links).toEqual([
      { from: 12, to: 13, props: [{ name: 'showText', value: true }] },
      { from: 14, to: 15, props: [{ name: 'showText', value: true }] },
      { from: 16, to: 17, props: [{ name: 'showText', value: true }] },
    ]);
  });

  it('keeps string-typed numbers as DAME wrote them (AS3 coerces them later)', () => {
    const props = parseLevel('Level6', read('Level6')).entities.flatMap((e) => (e.kind === 'box' ? e.props : []));
    expect(props).toContainEqual({ name: 'gravityy', value: '-20' });
    expect(props).toContainEqual({ name: 'affectsplayer', value: false });
  });

  describe('every shipped level', () => {
    const names = readdirSync(LEVELS_DIR)
      .filter((f) => /^Level_Level\d+\.as$/.test(f))
      .map((f) => f.slice('Level_'.length, -'.as'.length));

    it.each(names)('%s parses completely', (name) => {
      const src = read(name);
      const level = parseLevel(name, src);
      const count = (re: RegExp) => (src.match(re) ?? []).length;

      expect(level.layers).toHaveLength(count(/= addTilemap\(/g));
      expect(level.layers.filter((l) => l.hits)).toHaveLength(1);
      expect(level.entities.filter((e) => e.kind === 'sprite')).toHaveLength(count(/addSpriteToLayer\((null|new )/g));
      expect(level.entities.filter((e) => e.kind === 'box')).toHaveLength(count(/new BoxData\(/g));
      expect(level.entities.filter((e) => e.kind === 'text')).toHaveLength(count(/new TextData\(/g));
      expect(level.entities.filter((e) => e.kind === 'sprite' && e.type === 'Player')).toHaveLength(1);
      expect(level.links).toHaveLength(count(/createLink\(/g));

      const ids = new Set(level.entities.map((e) => e.id).filter((id) => id !== undefined));
      for (const link of level.links) {
        expect(ids.has(link.from)).toBe(true);
        expect(ids.has(link.to)).toBe(true);
      }
    });
  });
});
