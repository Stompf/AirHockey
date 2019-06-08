import Phaser from 'phaser';
import { flags } from './debug';
import { AsteroidGameScene, GameOverScene } from './scenes';

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
                default: 'matter',
                matter: {
                    gravity: {
                        y: 0,
                        x: 0,
                    },
                    debug: flags.DEBUG_PHYSICS,
                },
            },
            scene: [AsteroidGameScene as any, GameOverScene],
            disableContextMenu: true,
            backgroundColor: '0x000000',
            canvasStyle: 'border: 1px solid black',
        };

        super(config);
    }
}
