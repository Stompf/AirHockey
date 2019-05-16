import Phaser from 'phaser';
import { Player } from '../player';
import { BasePowerUp } from './base-power-up';

export class PowerUpShootSpeed extends BasePowerUp {
    private shootSpeedIncrease = 0.5;
    private durationMs = 5000;

    constructor(
        scene: Phaser.Scene,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        group: Phaser.GameObjects.Group
    ) {
        super(scene, 'powerUp_shootSpeed', position, velocity, angularVelocity, group);
    }

    public activate(player: Player) {
        player.reloadTime -= this.shootSpeedIncrease;
        this.scene.time.delayedCall(this.durationMs, this.deactivate, [], this);

        super.activate(player);
    }

    public deactivate(player: Player) {
        player.reloadTime += this.shootSpeedIncrease;
        super.deactivate(player);
    }
}
