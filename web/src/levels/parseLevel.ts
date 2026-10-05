// Reads the Level_LevelN.as classes that DAME's flixelComplex exporter generated, so the original
// level files stay the single source of truth. The format is fully regular: one statement per line.

export type PropValue = boolean | number | string;
export interface Prop {
  name: string;
  value: PropValue;
}

export interface TileLayerDef {
  name: string;
  csv: string; // repo-relative path
  image: string; // repo-relative path
  x: number;
  y: number;
  tileWidth: number;
  tileHeight: number;
  scrollX: number;
  scrollY: number;
  hits: boolean;
  collideIdx: number;
  drawIdx: number;
  tileProperties: Record<number, Prop[]>;
}

export interface TextEntity {
  kind: 'text';
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  text: string;
  font: string;
  size: number;
  color: number;
  align: string;
}

export interface BoxEntity {
  kind: 'box';
  id?: number;
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
  group: string;
  props: Prop[];
}

export interface SpriteEntity {
  kind: 'sprite';
  id?: number;
  type: string;
  ctorArgs: (number | string)[] | null; // null when DAME let BaseLevel construct it as new Type(x, y)
  group: string;
  x: number;
  y: number;
  angle: number;
  scrollX: number;
  scrollY: number;
  flipped: boolean;
  scaleX: number;
  scaleY: number;
  props: Prop[];
}

export type Entity = TextEntity | BoxEntity | SpriteEntity;

export interface LinkDef {
  from: number;
  to: number;
  props: Prop[];
}

export interface LevelDef {
  name: string;
  layers: TileLayerDef[];
  drawOrder: string[];
  entities: Entity[];
  links: LinkDef[];
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  bgColor: number;
}

const NUM = '(-?[\\d.]+)';
const STR = '"((?:[^"\\\\]|\\\\.)*)"';

const PROP_RE = new RegExp(`\\{\\s*name:${STR},\\s*value:(true|false|${STR}|-?[\\d.]+)\\s*\\}`, 'g');
const EMBED_RE = /\[Embed\(source="([^"]+)"[^\]]*\)\]\s*public var (\w+):Class;/g;
const TILEPROP_RE = /tileProperties\[(\d+)\]=generateProperties\((.*)\);/;
const TILEMAP_RE = new RegExp(
  `layer(\\w+) = addTilemap\\( (\\w+), (\\w+), ${NUM}, ${NUM}, (\\d+), (\\d+), ${NUM}, ${NUM}, (true|false), (\\d+), (\\d+), properties, onAddCallback \\);`,
);
const TEXT_RE = new RegExp(
  `new TextData\\(${NUM}, ${NUM}, ${NUM}, ${NUM}, ${NUM}, ${STR},\\s*${STR}, (\\d+), (0x[0-9a-fA-F]+), "(\\w+)"\\)`,
);
const BOX_RE = new RegExp(`obj = new BoxData\\(${NUM}, ${NUM}, ${NUM}, ${NUM}, ${NUM}, (\\w+) \\);`);
const CALLBACK_RE = /^(?:linkedObjectDictionary\[(\d+)\] = )?callbackNewData\(\s*(obj|new TextData\(.*\)), onAddCallback, (\w+), generateProperties\((.*?)\), [\d.]+, [\d.]+(?:, true)?\s*\)\s*;/;
const SPRITE_RE = new RegExp(
  `^(?:linkedObjectDictionary\\[(\\d+)\\] = )?addSpriteToLayer\\((null|new (\\w+)\\(([^)]*)\\)), (\\w+), (\\w+) , ${NUM}, ${NUM}, ${NUM}, ${NUM}, ${NUM}, (true|false), ${NUM}, ${NUM}, generateProperties\\((.*)\\), onAddCallback \\);`,
);
const LINK_RE = /createLink\(linkedObjectDictionary\[(\d+)\], linkedObjectDictionary\[(\d+)\], onAddCallback, generateProperties\((.*)\) \);/;

function unescape(s: string): string {
  return JSON.parse(`"${s}"`) as string;
}

export function parseProps(src: string): Prop[] {
  const props: Prop[] = [];
  for (const m of src.matchAll(PROP_RE)) {
    const raw = m[2];
    let value: PropValue;
    if (raw === 'true') value = true;
    else if (raw === 'false') value = false;
    else if (m[3] !== undefined) value = unescape(m[3]);
    else value = Number(raw);
    props.push({ name: unescape(m[1]), value });
  }
  return props;
}

// AS3 path in the Embed is relative to the level class; everything lives under the repo's assets/.
function repoPath(embedSource: string): string {
  return embedSource.replace(/^(\.\.\/)+/, '');
}

function functionBody(src: string, name: string): string[] {
  const start = src.indexOf(`public function ${name}(`);
  if (start < 0) throw new Error(`function ${name} not found`);
  const next = src.indexOf('public function ', start + 1);
  return src.slice(start, next < 0 ? undefined : next).split('\n').map((l) => l.trim());
}

export function parseLevel(name: string, src: string): LevelDef {
  const embeds = new Map<string, string>();
  for (const m of src.matchAll(EMBED_RE)) embeds.set(m[2], repoPath(m[1]));

  // Tile layers, with the shared tileProperties dictionary as it stood when each layer was added.
  const layers: TileLayerDef[] = [];
  const tileProperties: Record<number, Prop[]> = {};
  for (const line of src.split('\n').map((l) => l.trim())) {
    const tp = TILEPROP_RE.exec(line);
    if (tp) {
      tileProperties[Number(tp[1])] = parseProps(tp[2]);
      continue;
    }
    const t = TILEMAP_RE.exec(line);
    if (!t) continue;
    layers.push({
      name: t[1],
      csv: embeds.get(t[2])!,
      image: embeds.get(t[3])!,
      x: Number(t[4]),
      y: Number(t[5]),
      tileWidth: Number(t[6]),
      tileHeight: Number(t[7]),
      scrollX: Number(t[8]),
      scrollY: Number(t[9]),
      hits: t[10] === 'true',
      collideIdx: Number(t[11]),
      drawIdx: Number(t[12]),
      tileProperties: structuredClone(tileProperties),
    });
  }

  const drawOrder = [...src.matchAll(/masterLayer\.add\((\w+)\);/g)].map((m) => m[1].replace(/^layer/, ''));

  const num = (re: RegExp) => Number(re.exec(src)?.[1] ?? 0);
  const bounds = {
    minX: num(/boundsMinX = (-?[\d.]+);/),
    minY: num(/boundsMinY = (-?[\d.]+);/),
    maxX: num(/boundsMaxX = (-?[\d.]+);/),
    maxY: num(/boundsMaxY = (-?[\d.]+);/),
  };
  const bgColor = Number(/bgColor = (0x[0-9a-fA-F]+);/.exec(src)?.[1] ?? 0);

  // createObjects() fixes the order in which the per-layer functions run.
  const createObjects = functionBody(src, 'createObjects');
  const calls = createObjects.flatMap((l) => {
    const m = /^(\w+)\(onAddCallback\);$/.exec(l);
    return m ? [m[1]] : [];
  });

  const entities: Entity[] = [];
  const links: LinkDef[] = [];
  for (const fn of calls) {
    let pendingBox: Omit<BoxEntity, 'props' | 'id'> | null = null;
    for (const line of functionBody(src, fn)) {
      const box = BOX_RE.exec(line);
      if (box) {
        pendingBox = {
          kind: 'box',
          x: Number(box[1]),
          y: Number(box[2]),
          angle: Number(box[3]),
          // BoxData stores width/height as uint.
          width: Math.trunc(Number(box[4])),
          height: Math.trunc(Number(box[5])),
          group: box[6],
        };
        continue;
      }

      const cb = CALLBACK_RE.exec(line);
      if (cb) {
        const id = cb[1] === undefined ? undefined : Number(cb[1]);
        if (cb[2] === 'obj') {
          if (!pendingBox) throw new Error(`${name}: callbackNewData(obj) without BoxData`);
          entities.push({ ...pendingBox, id, props: parseProps(cb[4]) });
          pendingBox = null;
        } else {
          const t = TEXT_RE.exec(cb[2]);
          if (!t) throw new Error(`${name}: unreadable TextData: ${line}`);
          entities.push({
            kind: 'text',
            id,
            x: Number(t[1]),
            y: Number(t[2]),
            width: Math.trunc(Number(t[3])),
            height: Math.trunc(Number(t[4])),
            angle: Number(t[5]),
            text: unescape(t[6]),
            font: unescape(t[7]),
            size: Number(t[8]),
            color: Number(t[9]),
            align: t[10],
          });
        }
        continue;
      }

      const sp = SPRITE_RE.exec(line);
      if (sp) {
        entities.push({
          kind: 'sprite',
          id: sp[1] === undefined ? undefined : Number(sp[1]),
          type: sp[5],
          ctorArgs: sp[2] === 'null' ? null : sp[4].split(',').map((a) => {
            const s = a.trim();
            return /^-?[\d.]+$/.test(s) ? Number(s) : s;
          }),
          group: sp[6],
          x: Number(sp[7]),
          y: Number(sp[8]),
          angle: Number(sp[9]),
          scrollX: Number(sp[10]),
          scrollY: Number(sp[11]),
          flipped: sp[12] === 'true',
          scaleX: Number(sp[13]),
          scaleY: Number(sp[14]),
          props: parseProps(sp[15]),
        });
        continue;
      }

      const link = LINK_RE.exec(line);
      if (link) {
        links.push({ from: Number(link[1]), to: Number(link[2]), props: parseProps(link[3]) });
        continue;
      }

      if (/addSpriteToLayer|callbackNewData|createLink|new BoxData|new TextData/.test(line)) {
        throw new Error(`${name}: unrecognised level statement: ${line}`);
      }
    }
  }

  return { name, layers, drawOrder, entities, links, bounds, bgColor };
}
