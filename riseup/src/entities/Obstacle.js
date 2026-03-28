// src/entities/Obstacle.js
// Thin factory/helper — WaveController calls these to get configured physics sprites.

const ObstacleFactory = {

  /**
   * Create a basic rectangular block obstacle.
   * @param {Phaser.Scene}        scene
   * @param {Phaser.Physics.Arcade.Group} group
   * @param {number} x
   * @param {number} y
   * @param {string} [textureKey='block']
   * @param {number} [mass=1]
   * @returns {Phaser.Physics.Arcade.Image}
   */
  block(scene, group, x, y, textureKey = 'block', mass = 1) {
    const obj = scene.physics.add.image(x, y, textureKey);
    obj.body.setAllowGravity(false);
    obj.body.immovable = false;
    obj.setData('mass', mass);
    obj.setDepth(5);
    group.add(obj);
    return obj;
  },

  /**
   * Create a wall segment (taller block).
   */
  wall(scene, group, x, y) {
    const obj = scene.physics.add.image(x, y, 'wall');
    obj.body.setAllowGravity(false);
    obj.body.immovable = true;   // walls don't get pushed
    obj.setData('mass', 3);
    obj.setDepth(5);
    group.add(obj);
    return obj;
  },

  /**
   * Create a triangle obstacle.
   */
  triangle(scene, group, x, y) {
    const obj = scene.physics.add.image(x, y, 'triangle');
    obj.body.setAllowGravity(false);
    obj.setData('mass', 1.5);
    obj.setDepth(5);
    group.add(obj);
    return obj;
  },

  /**
   * Create a pendulum bar (pivots around anchor via tween).
   */
  bar(scene, group, x, y) {
    const obj = scene.physics.add.image(x, y, 'bar');
    obj.body.setAllowGravity(false);
    obj.setData('mass', 2);
    obj.setDepth(5);
    group.add(obj);
    return obj;
  },

  /** Remove obstacle cleanly */
  destroy(obj) {
    if (obj && obj.active) {
      obj.destroy();
    }
  },
};
