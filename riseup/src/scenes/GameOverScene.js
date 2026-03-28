// src/scenes/GameOverScene.js

class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) {
    this._score     = data.score     || 0;
    this._highScore = data.highScore || 0;
  }

  create() {
    const cx = GAME_WIDTH / 2;
    const isNewRecord = this._score >= this._highScore;

    this.add.image(0, 0, 'bg_deep').setOrigin(0, 0);

    // Title
    this.add.text(cx, 160, 'POPPED!', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '64px',
      color: '#ff4466',
      stroke: '#330011',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Score
    this.add.text(cx, 270, `${this._score}m`, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '52px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // New record badge
    if (isNewRecord) {
      const badge = this.add.text(cx, 340, '✦ NEW RECORD ✦', {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#ffdd44',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: badge, alpha: 1, scaleX: 1.1, scaleY: 1.1,
        yoyo: true, repeat: -1, duration: 600,
      });
    } else {
      this.add.text(cx, 340, `Best: ${this._highScore}m`, {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        color: '#aabbcc',
      }).setOrigin(0.5);
    }

    // Retry button
    const btn = this.add.text(cx, 480, '[ RISE AGAIN ]', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '30px',
      color: '#4fffb0',
      stroke: '#003322',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setColor('#ffffff'));
    btn.on('pointerout',   () => btn.setColor('#4fffb0'));
    btn.on('pointerdown',  () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(310, () => this.scene.start('PlayScene'));
    });

    // Menu link
    const menu = this.add.text(cx, 545, 'Main Menu', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#556677',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menu.on('pointerover', () => menu.setColor('#aabbcc'));
    menu.on('pointerout',  () => menu.setColor('#556677'));
    menu.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(310, () => this.scene.start('MenuScene'));
    });

    this.cameras.main.fadeIn(400);
  }
}
