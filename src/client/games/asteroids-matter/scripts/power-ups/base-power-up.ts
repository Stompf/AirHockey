import Phaser from 'phaser';
import { IMatterSprite } from '../../../common';
import { Player } from '../player';
import { PhysicsCategories } from '../utils';

export class BasePowerUp {
    public sprite: IMatterSprite;
    public isActive: boolean = false;

    private readonly maxAngularVelocity = 0.05;

    constructor(
        protected scene: Phaser.Scene,
        spriteName: string,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        physicsCategories: PhysicsCategories
    ) {
        const sprite = scene.matter.add.image(position.x, position.y, spriteName) as IMatterSprite;

        sprite.setMass(1);
        sprite.setVelocity(velocity.x, velocity.y);
        sprite.setAngularVelocity(angularVelocity);
        sprite.setFrictionAir(0);

        sprite.setCollisionCategory(physicsCategories.powerUps);
        sprite.setCollidesWith([
            physicsCategories.asteroids,
            physicsCategories.powerUps,
            physicsCategories.player,
            physicsCategories.bullet,
            physicsCategories.shield,
        ]);
        sprite.setData('type', this);

        this.sprite = sprite;
    }

    public activate(_player: Player) {
        // Override what happens when activating
        this.sprite.destroy();
        this.isActive = true;
    }

    public deactivate(_player: Player) {
        // Override what happens when deactivating
        this.isActive = false;
    }

    public onUpdate() {
        if (this.sprite.body.angularVelocity > this.maxAngularVelocity) {
            this.sprite.setAngularVelocity(this.maxAngularVelocity);
        }
    }
}
