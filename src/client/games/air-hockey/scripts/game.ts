import { MenuScene } from "../scenes/menu.scene";
import { MultiplayerScene } from "../scenes/multiplayer.scene";

export class AirHockeyGame extends Phaser.Game {
    constructor(parent: string) {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1200,
                height: 600,
                parent,
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
