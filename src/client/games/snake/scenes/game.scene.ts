import Phaser from 'phaser';
import { GameMap, Player } from '../scripts';

export class GameScene extends Phaser.Scene {
    private players!: Player[];
    private gameMap!: GameMap;
    private lastDelta = 0;
    private readonly UpdateTick = 40;
    private isPaused: boolean = true;
    private readonly PauseTimer = 3000;
    private sprites: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super({
            key: 'GameScene',
        });
    }

    public update(_time: number, delta: number) {
        this.lastDelta += delta;
        if (this.isPaused || this.lastDelta < this.UpdateTick) {
            return;
        }

        this.lastDelta = 0;
        this.players.forEach(player => {
            player.onUpdate(this.gameMap, this);
        });
    }

    protected preload() {
        this.load.image('arrow', '/assets/games/snake/arrow.png');

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
            new Player(this, '1', 0xff0000, cursor1),
            new Player(this, '2', 0x0000ff, cursor2),
        ];
    }

    protected create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.reset();
    }

    private reset() {
        this.isPaused = true;
        this.gameMap.reset();
        this.players.forEach(player => {
            const startPosition = this.gameMap.getRandomStartPosition(Player.SIZE);
            const startDirection = this.gameMap.getRandomStartDirection();
            player.setPosition(startPosition, startDirection, this.gameMap, this);
            const startArrow = this.add.image(
                startPosition.x * Player.SIZE + 5,
                startPosition.y * Player.SIZE + 5,
                'arrow'
            );
            startArrow.setName('arrow');
            this.sprites.push(startArrow);
            startArrow.setDisplaySize(20, 20);
            startArrow.setRotation(this.gameMap.getDirectionInRadians(startDirection));

            switch (startDirection) {
                case 'down':
                    startArrow.setY(startArrow.y + Player.SIZE * 1.5);
                    break;
                case 'up':
                    startArrow.setY(startArrow.y - Player.SIZE * 1.5);
                    break;
                case 'right':
                    startArrow.setX(startArrow.x + Player.SIZE * 1.5);
                    break;
                case 'left':
                    startArrow.setX(startArrow.x - Player.SIZE * 1.5);
                    break;
            }
        });

        window.setTimeout(() => {
            this.isPaused = false;
            this.sprites
                .filter(sprite => sprite.name === 'arrow')
                .forEach(arrow => arrow.destroy());
        }, this.PauseTimer);
    }
}
