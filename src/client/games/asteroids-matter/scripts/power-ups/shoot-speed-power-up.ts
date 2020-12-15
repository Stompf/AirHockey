import Phaser from 'phaser';
import { Player } from '../player';
import { PhysicsCategories } from '../utils';
import { BasePowerUp } from './base-power-up';

export class PowerUpShootSpeed extends BasePowerUp {
    private shootSpeedIncrease = 0.5;

    private durationMs = 5000;

    constructor(
        scene: Phaser.Scene,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        physicsCategories: PhysicsCategories
    ) {
        super(scene, 'powerUp_shootSpeed', position, velocity, angularVelocity, physicsCategories);
    }

    public activate(player: Player) {
        // eslint-disable-next-line no-param-reassign
        player.reloadTime *= this.shootSpeedIncrease;
        this.scene.time.delayedCall(this.durationMs, this.deactivate, [player], this);

        super.activate(player);
    }

    public deactivate(player: Player) {
        // eslint-disable-next-line no-param-reassign
        player.reloadTime /= this.shootSpeedIncrease;
        super.deactivate(player);
    }
}
