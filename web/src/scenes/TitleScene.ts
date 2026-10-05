// Inicio.as: splash screen, "SWAP" title and the Start Game button. Also preloads every asset.
import Phaser from 'phaser';
import { FLIXEL_FONT } from '../fonts';
import { preloadAll } from '../game/assets';

const BUTTON_W = 80;

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  preload(): void {
    preloadAll(this.load);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x000000);
    this.add.image(0, 0, 'SplashScreen').setOrigin(0);
    this.add.text(2, 32, 'SWAP', {
      fontFamily: FLIXEL_FONT, fontSize: '21px', color: '#9944ff', align: 'center', fixedWidth: width - 4,
    });
    this.addButton(width / 2 - 40, height / 2 - 60, 'Start Game!', () => this.scene.start('Level', { level: 'Level1' }));
  }

  // FlxButton: frame 0 normal, 1 highlight, 2 pressed; fires on mouse-up over the button.
  private addButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = this.add.sprite(x, y, 'FlxButton', 0).setOrigin(0).setInteractive();
    this.add.text(x - 1, y + 3, label, {
      fontFamily: FLIXEL_FONT, fontSize: '8px', color: '#333333', align: 'center', fixedWidth: BUTTON_W,
    });
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
