// src/main.js — Game Config & Bootstrap

const GAME_WIDTH  = 390;
const GAME_HEIGHT = 700;

const config = {
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a0a1a',
  parent: document.body,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      fps: 120,
      overlapBias: 64,
      debug: false,         // flip to true to see hitboxes
    },
  },

  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    PlayScene,
    GameOverScene,
  ],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// Expose globals the scenes need
window.GAME_WIDTH  = GAME_WIDTH;
window.GAME_HEIGHT = GAME_HEIGHT;

window.game = new Phaser.Game(config);
