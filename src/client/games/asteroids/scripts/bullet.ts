import Phaser from 'phaser';
import { IArcadeSprite } from '../../common';

export class Bullet {
    public static BulletRadius = 3;
    public static BulletLifeTime = 900;
    public static BulletSpeed = 1200;

    public shape!: p2.Circle;
    public sprite: IArcadeSprite;

    constructor(
        scene: Phaser.Scene,
        angle: number,
        position: WebKitPoint,
        velocity: WebKitPoint,
        group: Phaser.GameObjects.Group
    ) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fill();
        graphics.arc(0, 0, Bullet.BulletRadius, 0, 2 * Math.PI, false);
        graphics.generateTexture('bullet');

        const sprite = group.create(position.x, position.y, 'bullet') as IArcadeSprite;

        sprite.body.mass = 0.05;
        sprite.body.velocity.x = Bullet.BulletSpeed * Math.cos(angle) + velocity.x;
        sprite.body.velocity.y = Bullet.BulletSpeed * Math.sin(angle) + velocity.y;
        // sprite.body.damping = 0;
        // sprite.body.angularDamping = 0;
        sprite.body.setCircle(Bullet.BulletRadius);

        // sprite.body.setCollisionGroup(MASKS.BULLET);
        // sprite.body.collides([MASKS.ASTEROID, MASKS.POWER_UP]);
        scene.physics.add.existing(sprite);

        this.sprite = sprite;

        scene.time.delayedCall(Bullet.BulletLifeTime, this.destroy, [], this);
    }

    private destroy() {
        if (this.sprite.visible) {
            this.sprite.destroy();
        }
    }
}
