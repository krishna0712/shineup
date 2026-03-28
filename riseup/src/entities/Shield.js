// src/entities/Shield.js
// The shield lerps toward the pointer, giving it physical momentum so it
// naturally knocks obstacles sideways.

class Shield {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    this.scene = scene;

    // Actual physics object for collision detection
    this.body_obj = scene.physics.add.image(x, y, 'shield');
    this.body_obj.setCircle(
      34,              // radius matches visual ring
      2,               // offsetX
      2                // offsetY
    );
    this.body_obj.body.setAllowGravity(false);
    this.body_obj.body.immovable  = false;
    this.body_obj.body.useDamping = false;

    // BULLET mode — never tunnels through fast obstacles
    this.body_obj.body.setBounce(1.0);
    this.body_obj.setDepth(20);

    // Track previous position to compute velocity for knockback
    this._prevX = x;
    this._prevY = y;
    this._velX  = 0;
    this._velY  = 0;

    // Visual glow pulse
    scene.tweens.add({
      targets: this.body_obj,
      alpha: 0.75,
      yoyo: true,
      repeat: -1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Smoothly lerp the shield toward the active pointer.
   * Lerp factor is high enough to feel responsive but low enough to
   * preserve momentum for obstacle knockback.
   *
   * @param {Phaser.Input.Pointer} pointer
   * @param {number} delta  — frame delta in ms
   */
  lerpToPointer(pointer, delta) {
    const lerpFactor = 1 - Math.pow(0.006, delta / 1000);  // frame-rate independent

    const targetX = Phaser.Math.Clamp(pointer.x, 34, GAME_WIDTH  - 34);
    const targetY = Phaser.Math.Clamp(pointer.y, 34, GAME_HEIGHT - 34);

    const newX = Phaser.Math.Linear(this.body_obj.x, targetX, lerpFactor);
    const newY = Phaser.Math.Linear(this.body_obj.y, targetY, lerpFactor);

    // Derive velocity from displacement (used for knockback force)
    this._velX = (newX - this._prevX) / (delta / 1000);
    this._velY = (newY - this._prevY) / (delta / 1000);

    this.body_obj.x = newX;
    this.body_obj.y = newY;
    this.body_obj.body.reset(newX, newY);   // keep physics body in sync

    this._prevX = newX;
    this._prevY = newY;

    // Slight rotation to show movement direction
    this.body_obj.angle += (this._velX * 0.04);
  }

  get velocityX() { return this._velX; }
  get velocityY() { return this._velY; }

  destroy() {
    this.body_obj.destroy();
  }
}
