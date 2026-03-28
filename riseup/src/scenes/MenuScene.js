// src/scenes/MenuScene.js

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const cx = GAME_WIDTH / 2;
    this._buildBackground();

    // Title
    const title = this.add.text(cx, 200, 'RISE UP', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '72px',
      color: '#4fffb0',
      stroke: '#003322',
      strokeThickness: 8,
      shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 8, fill: true },
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: 210,
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: 'Sine.easeInOut',
    });

    // High score
    const hs = StorageManager.getHighScore();
    this.add.text(cx, 310, `BEST: ${hs}m`, {
      fontFamily: 'Courier New, monospace',
      fontSize: '22px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    // Tap to play prompt
    const tap = this.add.text(cx, 500, 'TAP TO RISE', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: tap,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 800,
      ease: 'Sine.easeInOut',
    });

    // Credits
    this.add.text(cx, GAME_HEIGHT - 24, 'Shield the balloon · Don\'t touch the walls', {
      fontFamily: 'Courier New, monospace',
      fontSize: '12px',
      color: '#667788',
    }).setOrigin(0.5);

    // Start on any input
    this.input.once('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(310, () => this.scene.start('PlayScene'));
    });
  }

  _buildBackground() {
    this.add.image(0, 0, 'bg_deep').setOrigin(0, 0);

    // Scatter stars
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const s = this.add.image(x, y, 'star').setAlpha(Math.random() * 0.8 + 0.2);
      this.tweens.add({
        targets: s,
        alpha: Math.random() * 0.3,
        yoyo: true,
        repeat: -1,
        duration: Phaser.Math.Between(1000, 3000),
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000),
      });
    }

    // A few drifting clouds
    for (let i = 0; i < 5; i++) {
      const c = this.add.image(
        Phaser.Math.Between(-40, GAME_WIDTH + 40),
        Phaser.Math.Between(100, GAME_HEIGHT - 100),
        'cloud'
      ).setAlpha(0.12).setScale(Phaser.Math.FloatBetween(1.5, 3.5));
      this.tweens.add({
        targets: c, x: c.x + Phaser.Math.Between(40, 80),
        yoyo: true, repeat: -1,
        duration: Phaser.Math.Between(6000, 12000),
        ease: 'Sine.easeInOut',
      });
    }
  }
}
