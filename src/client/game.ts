import { GameScene, MenuScene } from './scenes';

export class AirHockeyGame extends Phaser.Game {
    constructor() {
        const config: GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 800,
                height: 600,
                parent: 'game-canvas',
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                },
            },
            scene: [MenuScene, GameScene],
            disableContextMenu: true,
            backgroundColor: '0x000000',
        };

        super(config);
    }
}
