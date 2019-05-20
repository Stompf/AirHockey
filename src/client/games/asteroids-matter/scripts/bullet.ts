import Phaser from 'phaser';
import { PhysicsCategories } from './utils';

export class Bullet {
    public static BulletRadius = 4;
    public static BulletLifeTime = 900;
    public static BulletSpeed = 25;

    public static createBulletTexture(scene: Phaser.Scene) {
        const graphics = scene.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(Bullet.BulletRadius, Bullet.BulletRadius, Bullet.BulletRadius);
        graphics.generateTexture('bullet', Bullet.BulletRadius * 2, Bullet.BulletRadius * 2);
    }

    public sprite: Phaser.Physics.Matter.Image;

    constructor(
        scene: Phaser.Scene,
        angle: number,
        position: WebKitPoint,
        velocity: WebKitPoint,
        physicsCategory: PhysicsCategories
    ) {
        const sprite = scene.matter.add.image(position.x, position.y, 'bullet');

        sprite.setMass(1);
        sprite.setCircle(Bullet.BulletRadius, {});
        sprite.setVelocity(
            Bullet.BulletSpeed * Math.cos(angle) + velocity.x,
            Bullet.BulletSpeed * Math.sin(angle) + velocity.y
        );
        sprite.setCollisionCategory(physicsCategory.bullet);
        sprite.setCollidesWith([
            physicsCategory.bullet,
            physicsCategory.asteroids,
            physicsCategory.powerUps,
        ]);

        sprite.setData('type', this);

        this.sprite = sprite;

        scene.time.delayedCall(Bullet.BulletLifeTime, this.destroy, [], this);
    }

    public destroy() {
        if (this.sprite.visible) {
            this.sprite.destroy();
        }
    }
}
