// src/systems/ParticleManager.js
// Wraps Phaser 3 particle emitters for visual polish.

class ParticleManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this._streakEmitter = null;
  }

  // ── Wind Streaks ──────────────────────────────────────────────────────────────

  startWindStreaks() {
    this._streakEmitter = this.scene.add.particles(0, 0, 'streak', {
      x:          { min: 0, max: GAME_WIDTH },
      y:          { min: -10, max: -10 },
      speedY:     { min: 280, max: 520 },
      speedX:     { min: -20, max: 20 },
      lifespan:   { min: 600, max: 1200 },
      scale:      { start: 1, end: 0 },
      alpha:      { start: 0.25, end: 0 },
      quantity:   1,
      frequency:  55,
      rotate:     { min: -5, max: 5 },
      blendMode:  Phaser.BlendModes.ADD,
    });
    this._streakEmitter.setDepth(25);
  }

  setWindSpeed(multiplier) {
    if (!this._streakEmitter) return;
    this._streakEmitter.setParticleSpeed(
      { min: -20 * multiplier, max: 20 * multiplier },
      { min: 280 * multiplier, max: 520 * multiplier }
    );
  }

  // ── Pop Effect ────────────────────────────────────────────────────────────────

  emitPop(x, y) {
    // Burst emitter — fires once then stops
    const burst = this.scene.add.particles(x, y, 'spark', {
      speed:      { min: 80, max: 320 },
      scale:      { start: 1.4, end: 0 },
      alpha:      { start: 1, end: 0 },
      lifespan:   700,
      quantity:   28,
      blendMode:  Phaser.BlendModes.ADD,
      tint:       [0xff4466, 0xff8899, 0xffccdd, 0xffffff],
      emitting:   false,
    });
    burst.setDepth(30);
    burst.explode(28, x, y);

    // Secondary debris
    const debris = this.scene.add.particles(x, y, 'block', {
      speed:      { min: 40, max: 180 },
      scale:      { start: 0.4, end: 0 },
      alpha:      { start: 0.9, end: 0 },
      lifespan:   900,
      quantity:   8,
      emitting:   false,
    });
    debris.setDepth(29);
    debris.explode(8, x, y);

    // Cleanup after animation
    this.scene.time.delayedCall(1200, () => {
      burst.destroy();
      debris.destroy();
    });
  }

  destroy() {
    this._streakEmitter?.destroy();
  }
}
