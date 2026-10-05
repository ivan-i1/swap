// states/EndgameState.as: "Thank you for playing" on black, back to the title after 5 seconds.
import Phaser from 'phaser';
import { FLIXEL_FONT } from '../fonts';

export class EndgameScene extends Phaser.Scene {
  constructor() {
    super('Endgame');
  }

  create(): void {
    const { width } = this.scale;
    this.cameras.main.setBackgroundColor(0x000000);
    this.add.text(2, 302, 'Thank you for playing', {
      fontFamily: FLIXEL_FONT, fontSize: '21px', color: '#ffffff', align: 'center', fixedWidth: width - 4,
    });
    this.time.delayedCall(5000, () => this.scene.start('Title'));
  }
}
