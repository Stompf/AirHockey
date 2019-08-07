import Phaser from 'phaser';
import { GameMap, Player, snakeUtils } from '../scripts';

export class GameScene extends Phaser.Scene {
    private players!: Player[];
    private gameMap!: GameMap;
    private lastDelta = 0;
    private readonly UpdateTick = 40;
    private isPaused: boolean = true;
    private readonly PauseTimer = 3000;

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
            player.onUpdate(this.gameMap, this, this.isPaused);
        });
    }

    protected preload() {
        this.load.image('arrow', '/assets/games/snake/arrow.png');

        this.gameMap = new GameMap(
            this.sys.canvas.width / snakeUtils.playerSize,
            this.sys.canvas.height / snakeUtils.playerSize
        );
    }

    protected create() {
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
            new Player(this, '1', 0xff0000, cursor1),
            new Player(this, '2', 0x0000ff, cursor2),
        ];

        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.reset();
    }

    private reset() {
        this.isPaused = true;
        this.gameMap.reset();
        this.players.forEach(player => {
            const startPosition = this.gameMap.getRandomStartPosition();
            const startDirection = snakeUtils.getRandomStartDirection();
            player.showStartArrow(true);
            player.setPosition(startPosition, startDirection, this.gameMap, this);
        });

        window.setTimeout(() => {
            // this.isPaused = false;
            // this.players.forEach(player => player.showStartArrow(false));
        }, this.PauseTimer);
    }
}
