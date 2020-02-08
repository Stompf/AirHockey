import { AirHockey, Shared } from 'src/shared';

export class NetworkPlayer {
    public readonly Id: Shared.Id;

    private sprite: Phaser.GameObjects.Arc;

    constructor(options: AirHockey.IPlayer, scene: Phaser.Scene) {
        this.Id = options.id;
        this.sprite = scene.add.circle(
            options.position.x,
            options.position.y,
            options.diameter / 2,
            options.color,
        );
    }

    public updatePlayer(update: AirHockey.IPlayerUpdate) {
        this.sprite.x = update.position.x;
        this.sprite.y = update.position.y;
    }

    public destroy() {
        this.sprite.destroy();
    }
}
