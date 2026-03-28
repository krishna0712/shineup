// src/scenes/PreloadScene.js
// All textures are generated via canvas so the game runs with zero external assets.
// To swap in real PNGs: replace the generate*() calls with this.load.image() here,
// then remove the generate calls — key names stay the same throughout the codebase.

class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  create() {
    this._generateBalloon();
    this._generateShield();
    this._generateObstacles();
    this._generateParticles();
    this._generateBackgroundLayers();

    this.scene.start('MenuScene');
  }

  // ── Balloon ─────────────────────────────────────────────────────────────────

  _generateBalloon() {
    const r = 28;
    const g = this.make.graphics({ add: false });

    // Main body gradient simulation (canvas only has fill, fake with layered circles)
    g.fillStyle(0xff4466, 1);
    g.fillCircle(r, r, r);
    g.fillStyle(0xff88aa, 0.5);
    g.fillCircle(r - 8, r - 8, r * 0.55);
    g.fillStyle(0xffffff, 0.2);
    g.fillCircle(r - 12, r - 12, r * 0.3);

    // Knot
    g.fillStyle(0xcc2244, 1);
    g.fillRect(r - 4, r * 2 - 2, 8, 8);

    // String
    g.lineStyle(1.5, 0xffccdd, 1);
    g.beginPath();
    g.moveTo(r, r * 2 + 6);
    g.lineTo(r - 4, r * 2 + 20);
    g.strokePath();

    g.generateTexture('balloon', r * 2, r * 2 + 22);
    g.destroy();
  }

  // ── Shield ───────────────────────────────────────────────────────────────────

  _generateShield() {
    const r = 38;
    const g = this.make.graphics({ add: false });

    // Outer ring
    g.lineStyle(4, 0x4fffb0, 1);
    g.strokeCircle(r, r, r - 3);

    // Inner glow ring
    g.lineStyle(2, 0x4fffb0, 0.4);
    g.strokeCircle(r, r, r - 10);

    // Center cross-hatch
    g.lineStyle(1, 0x4fffb0, 0.25);
    g.beginPath();
    g.moveTo(r, 4); g.lineTo(r, r * 2 - 4);
    g.moveTo(4, r); g.lineTo(r * 2 - 4, r);
    g.strokePath();

    g.generateTexture('shield', r * 2, r * 2);
    g.destroy();
  }

  // ── Obstacles ────────────────────────────────────────────────────────────────

  _generateObstacles() {
    // Rectangular block (used for walls, tunnel, wall-gap)
    const bg = this.make.graphics({ add: false });
    bg.fillStyle(0x334466, 1);
    bg.fillRect(0, 0, 60, 24);
    bg.lineStyle(2, 0x5577aa, 1);
    bg.strokeRect(1, 1, 58, 22);
    // Rivets
    bg.fillStyle(0x7799cc, 1);
    [8, 28, 48].forEach(x => bg.fillCircle(x, 12, 3));
    bg.generateTexture('block', 60, 24);
    bg.destroy();

    // Tall wall segment (for tunnel sides, pendulum)
    const wg = this.make.graphics({ add: false });
    wg.fillStyle(0x223355, 1);
    wg.fillRect(0, 0, 40, 120);
    wg.lineStyle(2, 0x4466aa, 1);
    wg.strokeRect(1, 1, 38, 118);
    wg.generateTexture('wall', 40, 120);
    wg.destroy();

    // Triangle / shredder blade
    const tg = this.make.graphics({ add: false });
    tg.fillStyle(0xff6633, 1);
    tg.fillTriangle(30, 0, 60, 60, 0, 60);
    tg.lineStyle(2, 0xff9966, 1);
    tg.strokeTriangle(30, 0, 60, 60, 0, 60);
    tg.generateTexture('triangle', 60, 60);
    tg.destroy();

    // Pendulum bar
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0x556688, 1);
    pg.fillRect(0, 0, 120, 18);
    pg.lineStyle(2, 0x8899bb, 1);
    pg.strokeRect(1, 1, 118, 16);
    pg.generateTexture('bar', 120, 18);
    pg.destroy();
  }

  // ── Particles ────────────────────────────────────────────────────────────────

  _generateParticles() {
    // Wind streak
    const sg = this.make.graphics({ add: false });
    sg.fillStyle(0xffffff, 1);
    sg.fillRect(0, 0, 40, 2);
    sg.generateTexture('streak', 40, 2);
    sg.destroy();

    // Pop spark
    const pk = this.make.graphics({ add: false });
    pk.fillStyle(0xff4466, 1);
    pk.fillCircle(6, 6, 6);
    pk.generateTexture('spark', 12, 12);
    pk.destroy();

    // Tiny cloud puff
    const cg = this.make.graphics({ add: false });
    cg.fillStyle(0xffffff, 0.7);
    cg.fillCircle(20, 14, 14);
    cg.fillCircle(34, 10, 10);
    cg.fillCircle(8,  12, 10);
    cg.fillCircle(26, 20, 10);
    cg.generateTexture('cloud', 48, 32);
    cg.destroy();

    // Star (far background)
    const stg = this.make.graphics({ add: false });
    stg.fillStyle(0xffffff, 1);
    stg.fillCircle(2, 2, 2);
    stg.generateTexture('star', 4, 4);
    stg.destroy();
  }

  // ── Parallax Background Layers ───────────────────────────────────────────────

  _generateBackgroundLayers() {
    // Layer 0: deep space gradient
    const deep = this.make.graphics({ add: false });
    deep.fillGradientStyle(0x0a0a2a, 0x0a0a2a, 0x0a1a3a, 0x0a1a3a, 1);
    deep.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    deep.generateTexture('bg_deep', GAME_WIDTH, GAME_HEIGHT);
    deep.destroy();

    // Layer 1: mid sky
    const mid = this.make.graphics({ add: false });
    mid.fillGradientStyle(0x112244, 0x112244, 0x1a3a6a, 0x1a3a6a, 1);
    mid.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    mid.generateTexture('bg_mid', GAME_WIDTH, GAME_HEIGHT);
    mid.destroy();
  }
}
