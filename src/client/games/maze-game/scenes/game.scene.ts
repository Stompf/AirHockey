import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    private lastDelta = 0;
    private readonly UpdateTick = 40;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    public update(_time: number, delta: number) {
        this.lastDelta += delta;
        if (this.lastDelta < this.UpdateTick) {
            return;
        }

        this.lastDelta = 0;
    }

    protected preload() {
        // TODO
    }

    protected create() {
        // TODO
    }
}
