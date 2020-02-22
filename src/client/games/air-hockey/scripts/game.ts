import { MenuScene } from '../scenes/menu.scene';
import { MultiplayerScene } from '../scenes/multiplayer.scene';
import { LocalScene } from '../scenes/local.scene';

export class AirHockeyGame extends Phaser.Game {
    constructor(parent: string, type: GameType) {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1200,
                height: 600,
                parent,
            },
            disableContextMenu: true,
            backgroundColor: '0x000000',
            canvasStyle: 'border: 1px solid black',
        };

        if (type === 'local') {
            config.physics = {
                default: 'arcade',
                arcade: {
                    debug: true,
                },
            };

            config.scene = [LocalScene];
        } else {
            config.scene = [MenuScene, MultiplayerScene];
        }

        super(config);
    }
}
