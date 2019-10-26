import { GameScene } from '../scenes';

export class SnakeGame extends Phaser.Game {
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
            scene: [GameScene],
            disableContextMenu: true,
            backgroundColor: '0xFFFFFF',
            canvasStyle: 'border: 1px solid black',
        };

        super(config);
    }
}
