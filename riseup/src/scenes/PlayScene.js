// src/scenes/PlayScene.js

class PlayScene extends Phaser.Scene {
  constructor() { super({ key: 'PlayScene' }); }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  create() {
    this._alive       = true;
    this._score       = 0;
    this._difficulty  = 1.0;
    this._shakeTime   = 0;

    this._buildParallax();
    this._buildPhysicsGroups();
    this._buildEntities();
    this._buildSystems();
    this._buildCollisions();
    this._buildInput();

    this.hud = new HUD(this);
    this.cameras.main.fadeIn(400);

    // Wind-streak particles (cosmetic only — no physics)
    this.particleManager = new ParticleManager(this);
    this.particleManager.startWindStreaks();
  }

  update(time, delta) {
    if (!this._alive) return;

    // Score = altitude in metres (1 metre per 4 px scrolled upward)
    this._score += delta * 0.004 * this._difficulty;
    this.hud.setScore(Math.floor(this._score));

    // Ramp difficulty every 100 m
    this._difficulty = 1.0 + Math.floor(this._score / 100) * 0.12;
    this.waveController.setDifficulty(this._difficulty);

    // Parallax scroll
    this._scrollParallax(delta);

    // Shield lerp toward pointer
    this.shield.lerpToPointer(this.input.activePointer, delta);

    // Wave controller tick
    this.waveController.update(time, delta);

    // Screen shake decay
    if (this._shakeTime > 0) {
      this._shakeTime -= delta;
      if (this._shakeTime <= 0) this.cameras.main.resetFX();
    }

    // Keep balloon fixed vertically — it never moves, the world scrolls
    this.balloon.keepAlive();
  }

  // ── Build helpers ────────────────────────────────────────────────────────────

  _buildParallax() {
    // Three layers at different scroll speeds
    this._layers = [
      { img: this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_deep')
               .setOrigin(0,0).setAlpha(1),   speed: 0 },
      { img: this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_mid')
               .setOrigin(0,0).setAlpha(0.6), speed: 0.3 },
    ];

    // Procedural star/cloud sprites on two deeper layers
    this._starSprites  = this._scatterDecor('star',  100, 0.06);
    this._cloudSprites = this._scatterDecor('cloud',  12, 0.18);
  }

  _scatterDecor(key, count, speed) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(-GAME_HEIGHT, GAME_HEIGHT);
      const sc = key === 'cloud' ? Phaser.Math.FloatBetween(1, 3) : 1;
      const s = this.add.image(x, y, key)
        .setAlpha(key === 'cloud' ? 0.07 : Phaser.Math.FloatBetween(0.2, 0.9))
        .setScale(sc);
      arr.push({ sprite: s, speed, startY: y });
    }
    return arr;
  }

  _scrollParallax(delta) {
    const scrollPx = delta * 0.22 * this._difficulty;

    this._layers.forEach(l => {
      if (l.speed > 0) l.img.tilePositionY -= scrollPx * l.speed;
    });

    const wrap = (sprites, speed) => {
      sprites.forEach(d => {
        d.sprite.y += scrollPx * speed;
        if (d.sprite.y > GAME_HEIGHT + 80) {
          d.sprite.y = -80;
          d.sprite.x = Phaser.Math.Between(0, GAME_WIDTH);
        }
      });
    };

    wrap(this._starSprites,  0.04);
    wrap(this._cloudSprites, 0.14);
  }

  _buildPhysicsGroups() {
    // Static group for non-moving obstacles that can still have velocity via tween
    this.obstacleGroup = this.physics.add.group({
      allowGravity: false,
      immovable: false,
    });
  }

  _buildEntities() {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT - 160;

    this.balloon = new Balloon(this, cx, cy);
    this.shield  = new Shield(this, cx, cy - 60);
  }

  _buildSystems() {
    this.waveController = new WaveController(this, this.obstacleGroup);
  }

  _buildCollisions() {
    // Shield overlaps obstacles — pushes them aside
    this.physics.add.overlap(
      this.shield.body_obj,
      this.obstacleGroup,
      this._onShieldHit,
      null,
      this
    );

    // Balloon overlaps obstacles — game over
    this.physics.add.overlap(
      this.balloon.sprite,
      this.obstacleGroup,
      this._onBalloonHit,
      null,
      this
    );
  }

  _buildInput() {
    // Mouse / touch — shield follows pointer (lerped in update)
    this.input.on('pointerdown', () => { /* handled in Shield */ });
  }

  // ── Collision Handlers ───────────────────────────────────────────────────────

  _onShieldHit(shieldObj, obstacle) {
    // Give obstacle velocity based on shield's momentum direction
    const dx = obstacle.x - shieldObj.x;
    const dy = obstacle.y - shieldObj.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const force = 480 * this._difficulty;
    obstacle.setVelocity((dx / len) * force, (dy / len) * force);

    // Screen shake proportional to obstacle mass
    const mass = obstacle.getData('mass') || 1;
    if (mass >= 1) {
      this.cameras.main.shake(120 * mass, 0.006 * mass);
      this._shakeTime = 120 * mass;
    }
  }

  _onBalloonHit(balloonSprite /*, obstacle */) {
    if (!this._alive) return;
    this._alive = false;
    this._endGame();
  }

  _endGame() {
    // Pop effect
    this.particleManager.emitPop(this.balloon.sprite.x, this.balloon.sprite.y);
    this.balloon.sprite.setVisible(false);

    // Save high score
    const score = Math.floor(this._score);
    StorageManager.saveHighScore(score);

    this.time.delayedCall(900, () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(420, () => {
        this.scene.start('GameOverScene', { score, highScore: StorageManager.getHighScore() });
      });
    });
  }

  // ── Public API (used by WaveController / HUD) ────────────────────────────────

  get score()      { return this._score; }
  get difficulty() { return this._difficulty; }
}
