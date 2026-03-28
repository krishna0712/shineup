// src/ui/HUD.js
// Heads-Up Display: altitude meter, high score, difficulty indicator.

class HUD {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this._score     = 0;
    this._highScore = StorageManager.getHighScore();

    const textStyle = {
      fontFamily: 'Courier New, monospace',
      fontSize: '15px',
      color: '#aabbcc',
      stroke: '#000000',
      strokeThickness: 3,
    };

    // Altitude label
    this._altLabel = scene.add
      .text(10, 12, 'ALT', { ...textStyle, fontSize: '11px', color: '#556677' })
      .setDepth(50)
      .setScrollFactor(0);

    // Score (big)
    this._scoreText = scene.add
      .text(10, 22, '0m', {
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontSize:   '32px',
        color:      '#ffffff',
        stroke:     '#000000',
        strokeThickness: 5,
      })
      .setDepth(50)
      .setScrollFactor(0);

    // High score (top right)
    this._hsText = scene.add
      .text(GAME_WIDTH - 10, 12, `BEST ${this._highScore}m`, {
        ...textStyle, fontSize: '13px',
      })
      .setOrigin(1, 0)
      .setDepth(50)
      .setScrollFactor(0);

    // Altitude bar (thin vertical strip, right edge)
    this._barBg = scene.add.rectangle(GAME_WIDTH - 4, GAME_HEIGHT, 4, GAME_HEIGHT, 0x223344)
      .setOrigin(0.5, 1)
      .setDepth(50)
      .setScrollFactor(0);

    this._barFill = scene.add.rectangle(GAME_WIDTH - 4, GAME_HEIGHT, 4, 0, 0x4fffb0)
      .setOrigin(0.5, 1)
      .setDepth(51)
      .setScrollFactor(0);
  }

  /**
   * @param {number} score — altitude in metres
   */
  setScore(score) {
    this._score = score;
    this._scoreText.setText(`${score}m`);

    // Update high score text live
    if (score > this._highScore) {
      this._highScore = score;
      this._hsText.setText(`BEST ${score}m`).setColor('#ffdd44');
    }

    // Progress bar — shows last 500 m of progress
    const pct = Math.min(1, (score % 500) / 500);
    this._barFill.height = GAME_HEIGHT * pct;
  }
}
