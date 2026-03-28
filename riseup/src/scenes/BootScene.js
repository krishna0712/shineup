// src/scenes/BootScene.js

class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    // Tiny loading bar for the preloader itself
    const bar = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      0, 6, 0x4fffb0
    );
    this.load.on('progress', v => bar.width = GAME_WIDTH * v);
  }

  create() {
    // Seed global registry values
    this.registry.set('score',    0);
    this.registry.set('highScore', StorageManager.getHighScore());
    this.registry.set('difficulty', 1.0);

    this.scene.start('PreloadScene');
  }
}
