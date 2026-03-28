// src/systems/WaveController.js
// Manages curated obstacle patterns, dynamic scaling, and endless looping.

class WaveController {
  /**
   * @param {Phaser.Scene}                    scene
   * @param {Phaser.Physics.Arcade.Group}     group
   */
  constructor(scene, group) {
    this.scene      = scene;
    this.group      = group;
    this._diff      = 1.0;        // set externally by PlayScene
    this._waveIndex = 0;          // current position in pattern queue
    this._loopCount = 0;          // how many full loops completed
    this._cooldown  = 0;          // ms until next wave spawns
    this._active    = [];         // live obstacle refs for cleanup
    this._baseDelay = 2800;       // ms between waves at diff=1

    // Curated pattern queue — loops with increasing difficulty
    this._patternQueue = [
      'theTunnel',
      'fallingBlocks',
      'thePendulum',
      'theWall',
      'theShredder',
      'theGauntlet',
    ];
  }

  setDifficulty(d) { this._diff = d; }

  update(time, delta) {
    this._cooldown -= delta;
    if (this._cooldown > 0) return;

    // Pick next pattern
    const patternName = this._patternQueue[this._waveIndex % this._patternQueue.length];

    // Advance; loop detection
    this._waveIndex++;
    if (this._waveIndex > 0 && this._waveIndex % this._patternQueue.length === 0) {
      this._loopCount++;
    }

    // Spawn
    this._spawn(patternName);

    // Reduce inter-wave delay as difficulty grows
    const delayMultiplier = Math.max(0.4, 1 - (this._diff - 1) * 0.18);
    this._cooldown = this._baseDelay * delayMultiplier;
  }

  // ── Pattern Dispatcher ────────────────────────────────────────────────────────

  _spawn(name) {
    const methods = {
      theTunnel:     () => this._patternTunnel(),
      fallingBlocks: () => this._patternFallingBlocks(),
      thePendulum:   () => this._patternPendulum(),
      theWall:       () => this._patternWall(),
      theShredder:   () => this._patternShredder(),
      theGauntlet:   () => this._patternGauntlet(),
    };
    (methods[name] || methods.fallingBlocks)();
  }

  // ── Speed/density helpers ─────────────────────────────────────────────────────

  _vel()     { return 200 * this._diff * (1 + this._loopCount * 0.2); }
  _density() { return Math.min(6, 2 + Math.floor(this._loopCount * 0.5)); }

  // ── Patterns ──────────────────────────────────────────────────────────────────

  /**
   * THE TUNNEL — two tall wall segments slide in from the sides,
   * leaving a shrinking gap in the centre the player must thread.
   */
  _patternTunnel() {
    const gapWidth = Phaser.Math.Between(160, 220) / this._diff;
    const gapCX    = GAME_WIDTH / 2;
    const spawnY   = -70;
    const vel      = this._vel() * 0.75;

    // Left wall
    const left  = ObstacleFactory.wall(this.scene, this.group, gapCX - gapWidth / 2 - 30, spawnY);
    // Right wall
    const right = ObstacleFactory.wall(this.scene, this.group, gapCX + gapWidth / 2 + 30, spawnY);

    [left, right].forEach(w => {
      w.setVelocityY(vel);
      this._autoDestroy(w);
      this._active.push(w);
    });
  }

  /**
   * FALLING BLOCKS — random scattering of blocks from the top.
   */
  _patternFallingBlocks() {
    const count = this._density();
    const vel   = this._vel();

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 160, () => {
        if (!this.scene.scene.isActive('PlayScene')) return;
        const x = Phaser.Math.Between(30, GAME_WIDTH - 30);
        const b = ObstacleFactory.block(this.scene, this.group, x, -30);
        b.setVelocityY(vel);
        b.setVelocityX(Phaser.Math.Between(-60, 60));
        this._autoDestroy(b);
        this._active.push(b);
      });
    }
  }

  /**
   * THE PENDULUM — a long bar anchored at the top swings like a pendulum.
   * We fake the physics with a tween on angle.
   */
  _patternPendulum() {
    const anchorX = Phaser.Math.Between(80, GAME_WIDTH - 80);
    const anchorY = -10;
    const bar     = ObstacleFactory.bar(this.scene, this.group, anchorX, anchorY + 9);

    // Move downward slowly
    bar.setVelocityY(this._vel() * 0.4);

    // Swing tween
    this.scene.tweens.add({
      targets: bar,
      angle:   { from: -55, to: 55 },
      yoyo:    true,
      repeat:  4,
      duration: 700 / this._diff,
      ease:    'Sine.easeInOut',
      onComplete: () => ObstacleFactory.destroy(bar),
    });

    this._active.push(bar);
  }

  /**
   * THE WALL — a full-width row of blocks with ONE moving gap.
   * Gap starts at a random position and drifts horizontally.
   */
  _patternWall() {
    const blockW  = 52;
    const blockH  = 24;
    const spawnY  = -blockH;
    const vel     = this._vel() * 0.65;
    const count   = Math.ceil(GAME_WIDTH / blockW) + 1;
    const gapIdx  = Phaser.Math.Between(1, count - 2);  // never at edge

    for (let i = 0; i < count; i++) {
      if (i === gapIdx) continue;   // leave the gap

      const x = i * blockW + blockW / 2;
      const b = ObstacleFactory.block(this.scene, this.group, x, spawnY);
      b.setVelocityY(vel);
      this._autoDestroy(b);
      this._active.push(b);
    }

    // Drift the wall slightly so the gap oscillates
    const allBlocks = this._active.slice(-count + 1);
    this.scene.tweens.add({
      targets:  allBlocks,
      x:        `+=${Phaser.Math.Between(-50, 50)}`,
      yoyo:     true,
      repeat:   -1,
      duration: 800,
      ease:     'Sine.easeInOut',
    });
  }

  /**
   * THE SHREDDER — three triangles descend in a rotating formation.
   */
  _patternShredder() {
    const cx  = GAME_WIDTH / 2;
    const vel = this._vel();
    const positions = [
      { x: cx - 80, y: -40 },
      { x: cx,      y: -80 },
      { x: cx + 80, y: -40 },
    ];

    positions.forEach(({ x, y }, i) => {
      this.scene.time.delayedCall(i * 80, () => {
        if (!this.scene.scene.isActive('PlayScene')) return;
        const t = ObstacleFactory.triangle(this.scene, this.group, x, y);
        t.setVelocityY(vel * 0.9);

        // Spin!
        this.scene.tweens.add({
          targets:  t,
          angle:    360,
          repeat:   -1,
          duration: 800 / this._diff,
          ease:     'Linear',
        });

        this._autoDestroy(t);
        this._active.push(t);
      });
    });
  }

  /**
   * THE GAUNTLET — combines tunnel sides with falling blocks in the gap.
   * Appears only after first loop.
   */
  _patternGauntlet() {
    if (this._loopCount === 0) {
      // First loop — do a simpler version
      this._patternTunnel();
      return;
    }

    this._patternTunnel();

    // After a short delay, drop blocks through the gap
    this.scene.time.delayedCall(600, () => {
      if (!this.scene.scene.isActive('PlayScene')) return;
      this._patternFallingBlocks();
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  /** Auto-destroy obstacle when it travels past the bottom of the screen */
  _autoDestroy(obj) {
    const checkTimer = this.scene.time.addEvent({
      delay:    100,
      repeat:   80,
      callback: () => {
        if (!obj || !obj.active) { checkTimer.remove(); return; }
        if (obj.y > GAME_HEIGHT + 100) {
          ObstacleFactory.destroy(obj);
          checkTimer.remove();
        }
      },
    });
  }
}
