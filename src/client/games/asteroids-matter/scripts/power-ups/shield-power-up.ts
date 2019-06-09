import { IMatterSprite } from '../../../common';
import { Player } from '../player';
import { PhysicsCategories } from '../utils';
import { BasePowerUp } from './base-power-up';

export class PowerUpShield extends BasePowerUp {
    public static createShieldTexture(scene: Phaser.Scene) {
        const graphics = scene.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0x428cf4, 0.5);
        graphics.fillCircle(PowerUpShield.radius, PowerUpShield.radius, PowerUpShield.radius);
        graphics.generateTexture('shield', PowerUpShield.radius * 2, PowerUpShield.radius * 2);
    }
    private static radius = 80;

    private durationMs = 7000;
    private warningMs = 2000;
    private shieldSprite!: IMatterSprite;

    constructor(
        scene: Phaser.Scene,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        private physicsCategories: PhysicsCategories
    ) {
        super(scene, 'powerUp_shield', position, velocity, angularVelocity, physicsCategories);
    }

    public activate(player: Player) {
        this.addShield(player, this.scene);
        this.scene.time.delayedCall(this.durationMs - this.warningMs, this.warn, [], this);
        this.scene.time.delayedCall(this.durationMs, this.deactivate, [player], this);

        super.activate(player);
    }

    public deactivate(player: Player) {
        player.removeShield();
        this.shieldSprite.destroy();
        super.deactivate(player);
    }

    private warn = () => {
        this.shieldSprite.visible = !this.shieldSprite.visible;

        if (this.isActive) {
            setTimeout(() => {
                this.warn();
            }, 200);
        }
    };

    private addShield(player: Player, scene: Phaser.Scene) {
        this.shieldSprite = scene.matter.add.image(
            player.sprite.x,
            player.sprite.y,
            'shield'
        ) as IMatterSprite;

        this.shieldSprite.setCircle(PowerUpShield.radius, {});

        this.shieldSprite.setCollisionCategory(this.physicsCategories.shield);
        this.shieldSprite.setCollidesWith([
            this.physicsCategories.asteroids,
            this.physicsCategories.powerUps,
        ]);

        player.setShield(this.shieldSprite);
    }
}
