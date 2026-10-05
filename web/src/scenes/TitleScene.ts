// Port of Inicio.as: scrolling "Al infinito" text, a Start button, a white flash and a gentle shake.
import Phaser from 'phaser';
import buttonUrl from '../../../src/org/flixel/data/button.png';
import { FLIXEL_FONT } from '../fonts';

const BUTTON_W = 80;
const BUTTON_H = 20;

export class TitleScene extends Phaser.Scene {
  private texto!: Phaser.GameObjects.Text;

  constructor() {
    super('Title');
  }

  preload(): void {
    this.load.spritesheet('button', buttonUrl, { frameWidth: BUTTON_W, frameHeight: BUTTON_H });
  }

  create(): void {
    const { width, height } = this.scale;

    this.texto = this.add
      .text(0, 300, 'Al infinito', { fontFamily: FLIXEL_FONT, fontSize: '21px', color: '#ff0000', align: 'center', fixedWidth: width });

    this.addButton(width / 2 - 40, height / 2 - 60, 'Start Game!', () => this.scene.start('Level'));

    this.cameras.main.flash(1000, 255, 255, 255);
    this.cameras.main.shake(3000, 0.005);
  }

  update(_time: number, delta: number): void {
    // The original moved one pixel per 60Hz update.
    this.texto.x += (delta / 1000) * 60;
  }

  // FlxButton: frame 0 normal, 1 highlight, 2 pressed; fires on mouse-up over the button.
  private addButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add.sprite(x, y, 'button', 0).setOrigin(0).setInteractive({ useHandCursor: false });
    this.add.text(x - 1, y + 3, label, { fontFamily: FLIXEL_FONT, fontSize: '8px', color: '#333333', align: 'center', fixedWidth: BUTTON_W });

    let pressed = false;
    button.on('pointerover', () => button.setFrame(pressed ? 2 : 1));
    button.on('pointerout', () => button.setFrame(0));
    button.on('pointerdown', () => {
      pressed = true;
      button.setFrame(2);
    });
    button.on('pointerup', () => {
      const wasPressed = pressed;
      pressed = false;
      button.setFrame(1);
      if (wasPressed) onClick();
    });
    this.input.on('pointerup', () => {
      pressed = false;
    });
  }
}
