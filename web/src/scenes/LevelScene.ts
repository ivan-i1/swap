// Port of LevelLoader.as + Level_Level1.as: three tile layers, the player, and a kill trigger below the map.
import Phaser from 'phaser';
import playerUrl from '../../../assets/player2.png';
import spritesheet1Url from '../../../assets/spritesheet1.png';
import spritesheet2Url from '../../../assets/spritesheet2.png';
import { followDeadzone, platformerDeadzone, type Rect } from '../game/camera';
import { bgColor, killTrigger, layers, playerSpawn, TILE_SIZE } from '../game/level1';
import { createPlayerControl, stepPlayerControl, type PlayerControlState } from '../game/playerControl';
import { parseFlixelCsv } from '../game/tilemapCsv';

const FRAME = 48;
// Player.as bounding-box tweaks: 28x48 hull, drawn 8px left of the hull.
const HULL = { width: 28, height: 48, offsetX: 8 };

export class LevelScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private control!: PlayerControlState;
  private keys!: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; jump: Phaser.Input.Keyboard.Key };
  private deadzone!: Rect;

  constructor() {
    super('Level');
  }

  preload(): void {
    this.load.image('spritesheet1', spritesheet1Url);
    this.load.image('spritesheet2', spritesheet2Url);
    this.load.spritesheet('player', playerUrl, { frameWidth: FRAME, frameHeight: FRAME });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(bgColor);

    const colliders: (Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer)[] = [];
    for (const def of layers) {
      const map = this.make.tilemap({ data: parseFlixelCsv(def.csv), tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
      const tileset = map.addTilesetImage(def.tileset, def.tileset, TILE_SIZE, TILE_SIZE, 0, 0, 0)!;
      const layer = map.createLayer(0, tileset, def.x, def.y)!;
      layer.setScrollFactor(def.scroll);
      if (def.collides) {
        layer.setCollisionByExclusion([-1]);
        colliders.push(layer);
      }
    }

    this.createAnimations();
    this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'player', 1).setOrigin(0);
    const body = this.player.body;
    body.setSize(HULL.width, HULL.height, false);
    body.setOffset(HULL.offsetX, 0);
    body.setMaxVelocity(800, 800);
    body.setDrag(100, 0);
    body.setAccelerationY(900);
    this.control = createPlayerControl();

    for (const layer of colliders) this.physics.add.collider(this.player, layer);

    const trigger = this.add.zone(killTrigger.x, killTrigger.y, killTrigger.width, killTrigger.height).setOrigin(0);
    this.physics.add.existing(trigger, true);
    this.physics.add.overlap(trigger, this.player, () => this.player.disableBody(true, true));

    const kb = this.input.keyboard!;
    this.keys = {
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      jump: kb.addKey(Phaser.Input.Keyboard.KeyCodes.X),
    };

    this.deadzone = platformerDeadzone(this.scale.width, this.scale.height);

    // Flixel ran game logic on a fixed 60Hz step; hook the arcade world step so behaviour
    // doesn't depend on the display's refresh rate.
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, (delta: number) => this.step(delta));
  }

  private step(dt: number): void {
    if (!this.player.active) return;
    const body = this.player.body;

    const out = stepPlayerControl(
      this.control,
      { x: body.velocity.x, y: body.velocity.y },
      { left: this.keys.left.isDown, right: this.keys.right.isDown, jump: this.keys.jump.isDown },
      dt,
    );
    body.setVelocity(out.velocity.x, out.velocity.y);
    this.player.setFlipX(out.facing === 'left');
    this.player.anims.play(out.animation, true);

    const cam = this.cameras.main;
    const scroll = followDeadzone(
      { x: cam.scrollX, y: cam.scrollY },
      { x: body.x, y: body.y, width: body.width, height: body.height },
      this.deadzone,
    );
    cam.setScroll(scroll.x, scroll.y);
  }

  private createAnimations(): void {
    const anim = (key: string, frames: number[], frameRate: number) => {
      if (this.anims.exists(key)) return;
      this.anims.create({ key, frames: this.anims.generateFrameNumbers('player', { frames }), frameRate, repeat: -1 });
    };
    anim('jump', [1], 10);
    anim('move', [0, 1, 2], 10);
    anim('fall', [1], 10);
    anim('idle', [1], 2);
  }
}
