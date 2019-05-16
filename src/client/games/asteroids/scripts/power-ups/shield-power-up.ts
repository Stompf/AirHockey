import { IArcadeSprite } from '../../../common';
import { Player } from '../player';
import { BasePowerUp } from './base-power-up';

export class PowerUpShield extends BasePowerUp {
    private durationMs = 7000;
    private warningMs = 2000;
    private radius = 80;
    private shieldSprite!: IArcadeSprite;

    constructor(
        scene: Phaser.Scene,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        group: Phaser.GameObjects.Group
    ) {
        super(scene, 'powerUp_shield', position, velocity, angularVelocity, group);
    }

    public activate(player: Player) {
        this.radius = player.sprite.width * 3;

        this.createShieldGraphics(player, this.scene);
        player.hasShield = true;
        this.scene.time.delayedCall(this.durationMs - this.warningMs, this.warn, [], this);
        this.scene.time.delayedCall(this.durationMs, this.deactivate, [], this);

        super.activate(player);
    }

    public deactivate(player: Player) {
        player.hasShield = false;
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

    private createShieldGraphics(_player: Player, scene: Phaser.Scene) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(0x428cf4, 0.5);
        graphics.fillCircle(0, 0, this.radius);
        graphics.generateTexture('shield');
        // graphics.beginFill(0x428cf4, 0.5);
        // graphics.drawCircle(0, 0, this.radius);
        // graphics.endFill();

        const shieldSprite = this.group.create(0, 0, 'shield');
        scene.physics.add.existing(shieldSprite);

        shieldSprite.body.setCircle(this.radius);
        // shieldSprite.body.setCollisionGroup(shieldSprite.game.physics.p2.everythingCollisionGroup);
        // shieldSprite.body.collides(player.sprite.body.collidesWith);
        shieldSprite.body.static = true;

        // player.sprite. .addChild(shieldSprite);
        this.shieldSprite = shieldSprite;
    }
}
