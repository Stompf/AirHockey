import { GameScene } from './scenes';

export class AirHockeyGame extends Phaser.Game {
    constructor() {
        const config: GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'AirHockeyCanvas',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                },
            },
            scene: [GameScene],
            disableContextMenu: true,
            backgroundColor: '0xffffff',
        };

        super(config);
    }
}
