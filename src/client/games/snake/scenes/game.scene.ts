import moment from 'moment';
import Phaser from 'phaser';
import { utils } from 'src/shared';
import { Colors, GameMap, Player, snakeUtils } from '../scripts';

export class GameScene extends Phaser.Scene {
    private players!: Player[];
    private gameMap!: GameMap;
    private lastDelta = 0;
    private readonly UpdateTick = 40;
    private isPaused: boolean = true;
    private readonly PauseTimer = 3000;
    private startText!: Phaser.GameObjects.Text;
    private startTime: Date = new Date();

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

        const alivePlayers = this.players.filter(p => p.isAlive());
        if (alivePlayers.length === 0) {
            alert('Draw');
        } else if (alivePlayers.length === 1) {
            alert(`player: ${alivePlayers[0].displayName()} won`);
        }
    }

    protected preload() {
        this.load.image('arrow', '/assets/games/snake/arrow.png');

        this.gameMap = new GameMap(
            this.sys.canvas.width / snakeUtils.playerSize,
            this.sys.canvas.height / snakeUtils.playerSize
        );
    }

    protected create() {
        const startText = this.add.text(
            this.sys.canvas.width / 2,
            10,
            this.getStartText(this.PauseTimer / 1000),
            {
                fill: '#000000',
                fontSize: 20,
            }
        );
        this.startTime = moment()
            .add(this.PauseTimer, 'milliseconds')
            .toDate();

        startText.setDepth(10);
        startText.setOrigin(0, 0);
        utils.centerText(startText);
        this.startText = startText;

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
            new Player(this, 'blue', Colors.blue, cursor1),
            new Player(this, 'red', Colors.red, cursor2),
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

        this.startText.setVisible(true);

        this.updateStartText();

        window.setTimeout(() => {
            this.isPaused = false;
            this.players.forEach(player => player.showStartArrow(false));
            this.startText.setVisible(false);
        }, this.PauseTimer);
    }

    private updateStartText = () => {
        window.setTimeout(() => {
            const diff = moment(this.startTime).diff(moment(), 'seconds');
            this.startText.setText(this.getStartText(diff));
            if (diff > 0 && this.isPaused) {
                this.updateStartText();
            }
        }, 500);
    };

    private getStartText(time: number) {
        return `Starting in: ${time} seconds`;
    }
}
