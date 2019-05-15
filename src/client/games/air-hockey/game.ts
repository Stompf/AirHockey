import { MenuScene, MultiplayerScene } from './scenes';

export class AirHockeyGame extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1200,
                height: 600,
                parent: 'app',
            },
            // physics: {
            //     default: 'arcade',
            //     arcade: {
            //         debug: true,
            //     },
            // },
            scene: [MenuScene as any, MultiplayerScene],
            disableContextMenu: true,
            backgroundColor: '0x000000',
            canvasStyle: 'border: 1px solid black',
        };

        super(config);
    }
}
