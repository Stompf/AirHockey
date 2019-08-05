import Phaser from 'phaser';
import { GameMap, Player } from '../scripts';

export class GameScene extends Phaser.Scene {
    private players!: Player[];
    private gameMap!: GameMap;

    private lastDelta = 0;
    private readonly UpdateTick = 20;

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
        this.players.forEach(player => {
            player.onUpdate(this.gameMap, this);
        });
    }

    protected preload() {
        this.gameMap = new GameMap(
            this.sys.canvas.width / Player.SIZE,
            this.sys.canvas.height / Player.SIZE
        );

        const cursor1 = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        const cursor2 = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

        this.players = [
            new Player(this, '1', 0xff0000, this.gameMap, { x: 50, y: 50 }, 'right', cursor1),
            new Player(this, '2', 0x0000ff, this.gameMap, { x: 10, y: 10 }, 'right', cursor2),
        ];
    }

    protected create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
    }
}
