import { AirHockey } from 'src/shared';

export class NetworkBall {
    private sprite: Phaser.GameObjects.Arc;

    constructor(options: AirHockey.BallOptions, scene: Phaser.Scene) {
        this.sprite = scene.add.circle(
            options.position.x,
            options.position.y,
            options.diameter / 2,
            options.color
        );
    }

    public update(update: AirHockey.IBallUpdate) {
        this.sprite.x = update.position.x;
        this.sprite.y = update.position.y;
    }

    public destroy() {
        this.sprite.destroy();
    }
}
