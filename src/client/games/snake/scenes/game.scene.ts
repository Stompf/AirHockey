import Phaser from 'phaser';
import { GameMap, Player } from '../scripts';

export class GameScene extends Phaser.Scene {
    private player!: Player;
    private gameMap!: GameMap;

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    public update(_time: number, _delta: number) {
        this.player.onUpdate(this.gameMap);
    }

    protected preload() {
        this.gameMap = new GameMap(
            this.sys.canvas.width / Player.WIDTH,
            this.sys.canvas.height / Player.WIDTH
        );
        this.player = new Player(this, '1', 0xff0000, this.gameMap);
    }

    protected create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
    }
}
