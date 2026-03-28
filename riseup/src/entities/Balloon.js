// src/entities/Balloon.js
// The balloon stays fixed in the lower-centre of the screen.
// It does NOT move — the scrolling world gives the illusion of ascent.

class Balloon {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, 'balloon');
    this.sprite.setCircle(
      26,              // radius (slightly smaller than visual for forgiveness)
      2,               // offsetX
      2                // offsetY
    );
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.immovable = true;    // doesn't get pushed
    this.sprite.setDepth(10);

    // Gentle bob tween
    scene.tweens.add({
      targets: this.sprite,
      y: y + 8,
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: 'Sine.easeInOut',
    });
  }

  /** Called every frame — keeps the balloon anchored */
  keepAlive() {
    this.sprite.body.setVelocity(0, 0);
  }

  destroy() {
    this.sprite.destroy();
  }
}
