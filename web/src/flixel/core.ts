// Port of the parts of Flixel 2.5 the game relies on for the player: FlxObject motion, FlxObject.separate
// and FlxTilemap.overlapsWithCallback. Kept engine-free so it can be unit-tested against the AS3 behaviour.

export const NONE = 0;
export const LEFT = 0x0001;
export const RIGHT = 0x0010;
export const UP = 0x0100;
export const DOWN = 0x1000;
export const ANY = LEFT | RIGHT | UP | DOWN;
export const FLOOR = DOWN;
export const OVERLAP_BIAS = 4;

interface Point {
  x: number;
  y: number;
}

export interface FlxObject {
  kind: 'object';
  x: number;
  y: number;
  width: number;
  height: number;
  last: Point;
  velocity: Point;
  acceleration: Point;
  drag: Point;
  maxVelocity: Point;
  immovable: boolean;
  allowCollisions: number;
  touching: number;
  wasTouching: number;
  mass: number;
  elasticity: number;
  moves: boolean;
  active: boolean;
}

export interface FlxTilemap {
  kind: 'tilemap';
  x: number;
  y: number;
  last: Point;
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  widthInTiles: number;
  heightInTiles: number;
  collideIdx: number;
  data: number[];
}

type Init = Partial<Omit<FlxObject, 'kind' | 'last' | 'velocity' | 'acceleration' | 'drag' | 'maxVelocity'>>;

export function createFlxObject(init: Init = {}): FlxObject {
  const x = init.x ?? 0;
  const y = init.y ?? 0;
  return {
    kind: 'object',
    x,
    y,
    width: 0,
    height: 0,
    immovable: false,
    allowCollisions: ANY,
    touching: NONE,
    wasTouching: NONE,
    mass: 1,
    elasticity: 0,
    moves: true,
    active: true,
    ...init,
    last: { x, y },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    drag: { x: 0, y: 0 },
    maxVelocity: { x: 10000, y: 10000 },
  };
}

export function createTilemap(init: Omit<FlxTilemap, 'kind' | 'last' | 'width' | 'height'>): FlxTilemap {
  return {
    kind: 'tilemap',
    ...init,
    last: { x: init.x, y: init.y },
    width: init.widthInTiles * init.tileWidth,
    height: init.heightInTiles * init.tileHeight,
  };
}

export function computeVelocity(velocity: number, acceleration: number, drag: number, max: number, elapsed: number): number {
  let v = velocity;
  if (acceleration !== 0) v += acceleration * elapsed;
  else if (drag !== 0) {
    const d = drag * elapsed;
    if (v - d > 0) v -= d;
    else if (v + d < 0) v += d;
    else v = 0;
  }
  if (v !== 0 && max !== 10000) {
    if (v > max) v = max;
    else if (v < -max) v = -max;
  }
  return v;
}

export function updateMotion(o: FlxObject, elapsed: number): void {
  let delta = (computeVelocity(o.velocity.x, o.acceleration.x, o.drag.x, o.maxVelocity.x, elapsed) - o.velocity.x) / 2;
  o.velocity.x += delta;
  o.x += o.velocity.x * elapsed;
  o.velocity.x += delta;

  delta = (computeVelocity(o.velocity.y, o.acceleration.y, o.drag.y, o.maxVelocity.y, elapsed) - o.velocity.y) / 2;
  o.velocity.y += delta;
  o.y += o.velocity.y * elapsed;
  o.velocity.y += delta;
}

export function preUpdate(o: FlxObject | FlxTilemap): void {
  o.last.x = o.x;
  o.last.y = o.y;
}

export function postUpdate(o: FlxObject, elapsed: number): void {
  if (o.moves) updateMotion(o, elapsed);
  o.wasTouching = o.touching;
  o.touching = NONE;
}

export const isTouching = (o: FlxObject, direction: number) => (o.touching & direction) > NONE;

// FlxQuadTree only hands pairs whose swept hulls overlap to the separate callback.
export function hullsOverlap(a: FlxObject, b: FlxObject | FlxTilemap): boolean {
  const hull = (o: FlxObject | FlxTilemap) => {
    const dx = o.x - o.last.x;
    const dy = o.y - o.last.y;
    return {
      x: Math.min(o.x, o.last.x),
      y: Math.min(o.y, o.last.y),
      w: o.width + Math.abs(dx),
      h: o.height + Math.abs(dy),
    };
  };
  const ha = hull(a);
  const hb = hull(b);
  return ha.x + ha.w > hb.x && ha.x < hb.x + hb.w && ha.y + ha.h > hb.y && ha.y < hb.y + hb.h;
}

type Separator = (a: FlxObject, b: FlxObject) => boolean;

export function separate(a: FlxObject, b: FlxObject | FlxTilemap): boolean {
  const sx = separateX(a, b);
  const sy = separateY(a, b);
  return sx || sy;
}

export function separateX(a: FlxObject, b: FlxObject | FlxTilemap): boolean {
  if (b.kind === 'tilemap') return overlapsWithCallback(b, a, separateXObjects);
  return separateXObjects(a, b);
}

export function separateY(a: FlxObject, b: FlxObject | FlxTilemap): boolean {
  if (b.kind === 'tilemap') return overlapsWithCallback(b, a, separateYObjects);
  return separateYObjects(a, b);
}

function separateXObjects(o1: FlxObject, o2: FlxObject): boolean {
  if (o1.immovable && o2.immovable) return false;

  let overlap = 0;
  const d1 = o1.x - o1.last.x;
  const d2 = o2.x - o2.last.x;
  if (d1 !== d2) {
    const d1Abs = Math.abs(d1);
    const d2Abs = Math.abs(d2);
    const r1x = o1.x - (d1 > 0 ? d1 : 0);
    const r1w = o1.width + d1Abs;
    const r2x = o2.x - (d2 > 0 ? d2 : 0);
    const r2w = o2.width + d2Abs;
    if (r1x + r1w > r2x && r1x < r2x + r2w && o1.last.y + o1.height > o2.last.y && o1.last.y < o2.last.y + o2.height) {
      const maxOverlap = d1Abs + d2Abs + OVERLAP_BIAS;
      if (d1 > d2) {
        overlap = o1.x + o1.width - o2.x;
        if (overlap > maxOverlap || !(o1.allowCollisions & RIGHT) || !(o2.allowCollisions & LEFT)) overlap = 0;
        else {
          o1.touching |= RIGHT;
          o2.touching |= LEFT;
        }
      } else if (d1 < d2) {
        overlap = o1.x - o2.width - o2.x;
        if (-overlap > maxOverlap || !(o1.allowCollisions & LEFT) || !(o2.allowCollisions & RIGHT)) overlap = 0;
        else {
          o1.touching |= LEFT;
          o2.touching |= RIGHT;
        }
      }
    }
  }

  if (overlap === 0) return false;
  const v1 = o1.velocity.x;
  const v2 = o2.velocity.x;
  if (!o1.immovable && !o2.immovable) {
    overlap *= 0.5;
    o1.x -= overlap;
    o2.x += overlap;
    let nv1 = Math.sqrt((v2 * v2 * o2.mass) / o1.mass) * (v2 > 0 ? 1 : -1);
    let nv2 = Math.sqrt((v1 * v1 * o1.mass) / o2.mass) * (v1 > 0 ? 1 : -1);
    const average = (nv1 + nv2) * 0.5;
    nv1 -= average;
    nv2 -= average;
    o1.velocity.x = average + nv1 * o1.elasticity;
    o2.velocity.x = average + nv2 * o2.elasticity;
  } else if (!o1.immovable) {
    o1.x -= overlap;
    o1.velocity.x = v2 - v1 * o1.elasticity;
  } else {
    o2.x += overlap;
    o2.velocity.x = v1 - v2 * o2.elasticity;
  }
  return true;
}

function separateYObjects(o1: FlxObject, o2: FlxObject): boolean {
  if (o1.immovable && o2.immovable) return false;

  let overlap = 0;
  const d1 = o1.y - o1.last.y;
  const d2 = o2.y - o2.last.y;
  if (d1 !== d2) {
    const d1Abs = Math.abs(d1);
    const d2Abs = Math.abs(d2);
    const r1y = o1.y - (d1 > 0 ? d1 : 0);
    const r1h = o1.height + d1Abs;
    const r2y = o2.y - (d2 > 0 ? d2 : 0);
    const r2h = o2.height + d2Abs;
    if (o1.x + o1.width > o2.x && o1.x < o2.x + o2.width && r1y + r1h > r2y && r1y < r2y + r2h) {
      const maxOverlap = d1Abs + d2Abs + OVERLAP_BIAS;
      if (d1 > d2) {
        overlap = o1.y + o1.height - o2.y;
        if (overlap > maxOverlap || !(o1.allowCollisions & DOWN) || !(o2.allowCollisions & UP)) overlap = 0;
        else {
          o1.touching |= DOWN;
          o2.touching |= UP;
        }
      } else if (d1 < d2) {
        overlap = o1.y - o2.height - o2.y;
        if (-overlap > maxOverlap || !(o1.allowCollisions & UP) || !(o2.allowCollisions & DOWN)) overlap = 0;
        else {
          o1.touching |= UP;
          o2.touching |= DOWN;
        }
      }
    }
  }

  if (overlap === 0) return false;
  const v1 = o1.velocity.y;
  const v2 = o2.velocity.y;
  if (!o1.immovable && !o2.immovable) {
    overlap *= 0.5;
    o1.y -= overlap;
    o2.y += overlap;
    let nv1 = Math.sqrt((v2 * v2 * o2.mass) / o1.mass) * (v2 > 0 ? 1 : -1);
    let nv2 = Math.sqrt((v1 * v1 * o1.mass) / o2.mass) * (v1 > 0 ? 1 : -1);
    const average = (nv1 + nv2) * 0.5;
    nv1 -= average;
    nv2 -= average;
    o1.velocity.y = average + nv1 * o1.elasticity;
    o2.velocity.y = average + nv2 * o2.elasticity;
  } else if (!o1.immovable) {
    o1.y -= overlap;
    o1.velocity.y = v2 - v1 * o1.elasticity;
    // Riding horizontally moving platforms.
    if (o2.active && o2.moves && d1 > d2) o1.x += o2.x - o2.last.x;
  } else {
    o2.y += overlap;
    o2.velocity.y = v1 - v2 * o2.elasticity;
    if (o1.active && o1.moves && d1 < d2) o2.x += o1.x - o1.last.x;
  }
  return true;
}

// FlxTilemap.overlapsWithCallback with FlipCallbackParams = true: callback(object, tile).
function overlapsWithCallback(map: FlxTilemap, obj: FlxObject, callback: Separator): boolean {
  let results = false;
  const uint = (n: number) => n >>> 0;

  let selX = Math.floor((obj.x - map.x) / map.tileWidth);
  let selY = Math.floor((obj.y - map.y) / map.tileHeight);
  let selW = uint(selX + Math.ceil(obj.width / map.tileWidth) + 1);
  let selH = uint(selY + Math.ceil(obj.height / map.tileHeight) + 1);
  if (selX < 0) selX = 0;
  if (selY < 0) selY = 0;
  if (selW > map.widthInTiles) selW = map.widthInTiles;
  if (selH > map.heightInTiles) selH = map.heightInTiles;

  const deltaX = map.x - map.last.x;
  const deltaY = map.y - map.last.y;
  const tile = createFlxObject({ width: map.tileWidth, height: map.tileHeight, immovable: true });
  for (let row = selY; row < selH; row++) {
    for (let col = selX; col < selW; col++) {
      if (map.data[row * map.widthInTiles + col] < map.collideIdx) continue;
      tile.x = map.x + col * map.tileWidth;
      tile.y = map.y + row * map.tileHeight;
      tile.last.x = tile.x - deltaX;
      tile.last.y = tile.y - deltaY;
      tile.touching = NONE;
      if (callback(obj, tile)) results = true;
    }
  }
  return results;
}
