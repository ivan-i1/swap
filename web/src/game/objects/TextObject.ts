// TextObject.as: a level hint shown on a translucent band for TEXTDURATION seconds, once.
import { FLIXEL_FONT } from '../../fonts';
import type { TextEntity } from '../../levels/parseLevel';
import type { Runtime } from '../runtime';
import { Settings } from '../settings';
import { GameSprite } from '../sprite';
import type { FlxTimer } from '../timer';

const hex = (rgb: number) => `#${(rgb & 0xffffff).toString(16).padStart(6, '0')}`;

export class TextObject extends GameSprite {
  private timer: FlxTimer | null = null;
  private backgroundBox: GameSprite;
  private onKillCallback: (() => void) | null = null;

  constructor(rt: Runtime, data: TextEntity) {
    super(rt, data.x, data.y);
    this.width = data.width;
    this.height = data.height;
    // FlxText renders through a TextField with a 2px gutter, word-wrapped to its width.
    this.view = rt.scene.make.text({
      text: data.text,
      style: {
        fontFamily: data.font === 'system' ? FLIXEL_FONT : data.font,
        fontSize: `${data.size}px`,
        color: hex(data.color),
        align: data.align,
        wordWrap: { width: data.width - 4 },
        fixedWidth: data.width - 4,
      },
    }, false);
    this.scrollFactor.x = this.scrollFactor.y = 0;

    // A 50px band behind the text, in the colour's complement, at 75% opacity.
    this.backgroundBox = new GameSprite(rt, 0, this.y - 15);
    this.backgroundBox.makeGraphic(800, 50, 0xffffffff - (data.color & 0xffffff));
    this.backgroundBox.width = Settings.SCREENX;
    this.backgroundBox.height = 50;
    this.backgroundBox.scrollFactor.x = this.backgroundBox.scrollFactor.y = 0;
    this.backgroundBox.alpha = 0.75;
    this.backgroundBox.solid = false;
  }

  show(): void {
    if (this.timer) return;
    this.rt.add(this.backgroundBox);
    this.rt.add(this);
    this.timer = this.rt.timers.create().start(Settings.TEXTDURATION, 0, () => this.kill());
  }

  setOnKillCallback(callback: () => void): void {
    this.onKillCallback = callback;
  }

  override kill(): void {
    this.timer?.stop();
    this.onKillCallback?.();
    this.backgroundBox.kill();
    super.kill();
  }

  override render(): void {
    const v = this.view;
    if (!v) return;
    v.setVisible(this.exists && this.visible);
    v.setOrigin(0, 0);
    v.setPosition(this.x + 2, this.y + 2);
    v.setScrollFactor(0, 0);
  }
}
