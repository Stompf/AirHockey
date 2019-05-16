import Phaser from 'phaser';
import { AsteroidGameScene } from './scene';

export class AsteroidsGame extends Phaser.Game {
    constructor(parent: string) {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1400,
                height: 600,
                parent,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                },
            },
            scene: [AsteroidGameScene as any],
            disableContextMenu: true,
            backgroundColor: '0x000000',
            canvasStyle: 'border: 1px solid black',
        };

        super(config);
    }

    public destroy() {
        this.destroy();
    }
}
