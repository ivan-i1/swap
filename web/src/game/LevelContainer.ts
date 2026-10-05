// LevelContainer.as: builds a DAME level into Flixel sprites + a Box2D (planck) world and runs one Flixel
// frame per tick() in the original order.
import Phaser from 'phaser';
import { Vec2, World, type Contact, type ContactImpulse, type Manifold } from 'planck';
import { createTilemap, hullsOverlap, separate, type FlxTilemap } from '../flixel/core';
import { parseLevel, type BoxEntity, type Entity, type Prop, type SpriteEntity, type TextEntity } from '../levels/parseLevel';
import { assetKey, CSV, LEVEL_SOURCES } from './assets';
import { clampToBounds, followDeadzone, platformerDeadzone, type Rect } from './camera';
import { BreakableWall, Exit, PolygonBody, Tileblock, WeightSwitch } from './objects/bodies';
import { PhysicalBody } from './objects/PhysicalBody';
import { Player } from './objects/Player';
import { PropertyField } from './objects/PropertyField';
import { TextObject } from './objects/TextObject';
import { PhysicsUtil } from './physicsUtil';
import type { KeyState, Runtime } from './runtime';
import { ELAPSED, Settings } from './settings';
import { GameSprite } from './sprite';
import { parseFlixelCsv } from './tilemapCsv';
import { TimerManager } from './timer';

export type LevelOutcome = { kind: 'restart'; level: string } | { kind: 'endgame' };

const VIEW_W = Settings.SCREENX;
const VIEW_H = Settings.SCREENY;

export class LevelContainer implements Runtime {
  world: World;
  timers = new TimerManager();
  physics = new PhysicsUtil();
  outcome: LevelOutcome | null = null;
  player!: Player;

  private clock = 0;
  private members: GameSprite[] = [];
  private spriteGroup: (GameSprite | FlxTilemap)[] = [];
  private hitTilemap!: FlxTilemap;
  private layers = new Map<string, Phaser.GameObjects.Layer>();
  private stateLayer: Phaser.GameObjects.Layer;
  private deferred: (() => void)[] = [];
  private exitTo: string | null = null;

  private scroll = { x: 0, y: 0 };
  private deadzone = platformerDeadzone(VIEW_W, VIEW_H);
  private bounds!: Rect;

  private flashColor = 0;
  private flashAlpha = 0;
  private flashDuration = 1;
  private flashRect: Phaser.GameObjects.Rectangle;

  constructor(public scene: Phaser.Scene, public keys: KeyState, private levelName: string) {
    this.world = new World({ gravity: Vec2(0, 0) });
    this.listenForContacts();

    const def = parseLevel(levelName, LEVEL_SOURCES[levelName]);
    for (const name of def.drawOrder) this.layers.set(name, scene.add.layer());
    this.stateLayer = scene.add.layer();

    this.buildTilemaps(def.layers);
    this.buildEntities(def.entities, def.links);
    this.spriteGroup.push(this.hitTilemap);

    scene.cameras.main.setBackgroundColor(def.bgColor & 0xffffff);
    this.bounds = { x: this.hitTilemap.x, y: this.hitTilemap.y, width: this.hitTilemap.width, height: this.hitTilemap.height };

    this.flashRect = scene.add.rectangle(0, 0, VIEW_W, VIEW_H, 0xffffff, 0).setOrigin(0).setScrollFactor(0).setDepth(1);
    this.flash(0xffffff, 2);
  }

  // ---- Runtime -------------------------------------------------------------------------------------------

  now(): number {
    return this.clock;
  }

  add<T extends GameSprite>(obj: T): T {
    this.members.push(obj);
    if (obj.view) this.stateLayer.add(obj.view);
    return obj;
  }

  remove(obj: GameSprite): void {
    const i = this.members.indexOf(obj);
    if (i >= 0) this.members.splice(i, 1);
    obj.view?.setVisible(false);
  }

  physicsOp(fn: () => void): void {
    if (this.world.isLocked()) this.deferred.push(fn);
    else fn();
  }

  // FlxCamera.flash: ignored while a flash is running; a zero alpha byte means opaque.
  flash(color: number, duration: number): void {
    if (this.flashAlpha > 0) return;
    this.flashColor = color;
    this.flashDuration = duration <= 0 ? Number.MIN_VALUE : duration;
    this.flashAlpha = 1;
  }

  playSound(key: string, volume: number): void {
    this.scene.sound.play(key, { volume });
  }

  endGame(): void {
    this.outcome ??= { kind: 'endgame' };
  }

  // ---- Level construction --------------------------------------------------------------------------------

  private buildTilemaps(layers: ReturnType<typeof parseLevel>['layers']): void {
    for (const def of layers) {
      const data = parseFlixelCsv(CSV[def.csv]);
      const map = this.scene.make.tilemap({ data, tileWidth: def.tileWidth, tileHeight: def.tileHeight });
      const tileset = map.addTilesetImage(def.image, def.image, def.tileWidth, def.tileHeight, 0, 0, 0)!;
      const layer = map.createLayer(0, tileset, def.x, def.y)!;
      layer.setScrollFactor(def.scrollX, def.scrollY);
      this.layers.get(def.name)?.add(layer);

      if (!def.hits) continue;
      const flx = createTilemap({
        x: def.x,
        y: def.y,
        tileWidth: def.tileWidth,
        tileHeight: def.tileHeight,
        widthInTiles: data[0].length,
        heightInTiles: data.length,
        collideIdx: def.collideIdx,
        data: data.flat().map((t) => (t < 0 ? 0 : t)),
      });
      this.hitTilemap = flx;
      this.createTilemapPhysics(flx, def.tileProperties, def.x / Settings.TILESIZE, def.y / Settings.TILESIZE);
    }
  }

  // One static box per solid tile, solid columns beyond both sides, and a killing row below the map.
  private createTilemapPhysics(map: FlxTilemap, tileProperties: Record<number, Prop[]>, offsetX: number, offsetY: number): void {
    for (let y = 0, i = 0; y < map.heightInTiles; y++) {
      for (let x = 0; x < map.widthInTiles; x++, i++) {
        const tile = map.data[i];
        if (tile !== 0) this.createTileBox(x, y, offsetX, offsetY, tileProperties[tile] ?? []);
      }
    }
    for (let y1 = -10; y1 <= map.heightInTiles + 10; y1++) {
      this.spriteGroup.push(this.createTileBox(-1, y1, offsetX, offsetY, []));
      this.spriteGroup.push(this.createTileBox(map.widthInTiles, y1, offsetX, offsetY, []));
    }
    for (let x1 = -1; x1 < map.widthInTiles; x1++) {
      this.spriteGroup.push(this.createTileBox(x1, map.heightInTiles + 5, offsetX, offsetY, [
        { name: 'kills', value: true },
        { name: 'sensor', value: false },
      ]));
    }
  }

  private createTileBox(tileX: number, tileY: number, offsetX: number, offsetY: number, properties: Prop[]): Tileblock {
    const tile = new Tileblock(this, (offsetX + tileX) * Settings.TILESIZE, (offsetY + tileY) * Settings.TILESIZE);
    tile.width = Settings.TILESIZE;
    tile.height = Settings.TILESIZE;
    tile.createPhysicsObject(this.world, properties);
    return tile;
  }

  private createPropertyField(obj: { x: number; y: number; width: number; height: number }, properties: Prop[]): PropertyField {
    const field = new PropertyField(this, obj.x, obj.y);
    field.width = obj.width;
    field.height = obj.height;
    field.createPhysicsObject(this.world, properties);
    return field;
  }

  private buildEntities(entities: Entity[], links: ReturnType<typeof parseLevel>['links']): void {
    const linked = new Map<number, TextEntity | BoxEntity | GameSprite>();

    for (const e of entities) {
      let obj: TextEntity | BoxEntity | GameSprite = e as TextEntity | BoxEntity;
      if (e.kind === 'box') this.createPropertyField(e, e.props);
      else if (e.kind === 'sprite') obj = this.addSprite(e);
      if (e.id !== undefined) linked.set(e.id, obj);
    }

    for (const link of links) {
      const from = linked.get(link.from)!;
      const to = linked.get(link.to)!;
      const [first] = link.props;
      if (from instanceof PhysicalBody) from.addObjectLink(first.name, first.value, to);
      if (!(to instanceof GameSprite) && to.kind === 'text') {
        // The original creates a second field for the text link (its FIXME), carrying only the link props.
        const field = this.createPropertyField(from as BoxEntity, link.props);
        field.addObjectLink(first.name, first.value, new TextObject(this, to));
      }
    }
  }

  private addSprite(e: SpriteEntity): GameSprite {
    const a = e.ctorArgs ?? [e.x, e.y];
    const n = (i: number, fallback?: number) => (a[i] === undefined ? fallback : Number(a[i])) as number;
    let obj: GameSprite;
    switch (e.type) {
      case 'Player': obj = new Player(this, n(0), n(1)); break;
      case 'Exit': obj = new Exit(this, n(0), n(1)); break;
      case 'PolygonBody': obj = new PolygonBody(this, n(0), n(1), assetKey(a[2]), n(3, 4), n(4, 1), n(5, 0), n(6, 1)); break;
      case 'WeightSwitch': obj = new WeightSwitch(this, n(0), n(1), assetKey(a[2]), n(3)); break;
      case 'BreakableWall': obj = new BreakableWall(this, n(0), n(1), assetKey(a[2]), assetKey(a[3]), n(4)); break;
      default: throw new Error(`${this.levelName}: unsupported sprite type ${e.type}`);
    }

    // BaseLevel.addSpriteToLayer
    obj.x += obj.offset.x;
    obj.y += obj.offset.y;
    obj.angle = e.angle;
    if (e.flipped && obj.facing === 'right') obj.facing = 'left';
    obj.scrollFactor.x = e.scrollX;
    obj.scrollFactor.y = e.scrollY;
    this.members.push(obj);
    if (obj.view) (this.layers.get(e.group) ?? this.stateLayer).add(obj.view);

    // LevelContainer.onObjectAddedCallback
    if (obj instanceof Player) {
      this.player = obj;
      obj.setOnKill(() => this.reset());
      obj.setOnExit((level) => {
        this.exitTo = level;
      });
    }
    if (obj instanceof PhysicalBody) {
      obj.createPhysicsObject(this.world, e.props);
      if (!(obj instanceof Player)) this.spriteGroup.push(obj);
    }
    return obj;
  }

  private listenForContacts(): void {
    const each = (contact: Contact, fn: (body: PhysicalBody) => void) => {
      const a = contact.getFixtureA().getUserData();
      const b = contact.getFixtureB().getUserData();
      if (a instanceof PhysicalBody) fn(a);
      if (b instanceof PhysicalBody) fn(b);
    };
    this.world.on('begin-contact', (c: Contact) => each(c, (body) => body.onStartCollision(c)));
    this.world.on('end-contact', (c: Contact) => each(c, (body) => body.onEndCollision(c)));
    this.world.on('pre-solve', (c: Contact, m: Manifold) => each(c, (body) => body.onBeforeSolveCollision(c, m)));
    this.world.on('post-solve', (c: Contact, i: ContactImpulse) => each(c, (body) => body.onAfterSolveCollision(c, i)));
  }

  // ---- Frame -----------------------------------------------------------------------------------------------

  tick(): void {
    this.clock += 1000 * ELAPSED;

    // Plugins: TimerManager, then FlxControl.
    this.timers.update(ELAPSED);
    this.player.updateControl();

    // state.update(): members in order, including any added during the loop.
    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];
      if (!m.exists) continue;
      m.preUpdate(ELAPSED);
      m.update();
      m.postUpdate(ELAPSED);
    }

    // FlxG.collide(player, spriteGroup)
    const p = this.player;
    if (p.exists) {
      for (const other of this.spriteGroup) {
        if (other instanceof GameSprite) {
          if (!other.exists || !other.solid) continue;
          if (hullsOverlap(p.flx, other.flx)) separate(p.flx, other.flx);
        } else if (hullsOverlap(p.flx, other)) {
          separate(p.flx, other);
        }
      }
    }

    this.physics.update(this.world);
    // The AS3 world also steps its controllers inside Step().
    this.physics.updateControllers();
    this.world.step(ELAPSED, 10, 10);
    for (const fn of this.deferred.splice(0)) fn();
    this.physics.callSwaps();

    if (this.keys.justPressed('R')) this.reset();
    if (this.exitTo !== null) {
      this.levelName = this.exitTo;
      this.exitTo = null;
      this.reset();
    }

    // FlxG.updateCameras()
    this.scroll = clampToBounds(followDeadzone(this.scroll, this.player.flx, this.deadzone), this.bounds, VIEW_W, VIEW_H);
    if (this.flashAlpha > 0) this.flashAlpha -= ELAPSED / this.flashDuration;
  }

  private reset(): void {
    this.outcome ??= { kind: 'restart', level: this.levelName };
  }

  render(): void {
    for (const m of this.members) m.render();
    this.scene.cameras.main.setScroll(this.scroll.x, this.scroll.y);

    const alphaByte = this.flashColor >>> 24;
    const a = this.flashAlpha > 0 ? ((alphaByte <= 0 ? 0xff : alphaByte) / 255) * this.flashAlpha : 0;
    this.flashRect.setFillStyle(this.flashColor & 0xffffff, a);
  }
}
