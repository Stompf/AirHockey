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
    private statusText!: Phaser.GameObjects.Text;
    private scoreTexts: Phaser.GameObjects.Text[] = [];
    private startTime: Date = new Date();
    private readonly topContainerHeight = 30;
    private graphics!: Phaser.GameObjects.Graphics;

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

        if (!this.isPaused) {
            const alivePlayers = this.players.filter(p => p.IsAlive);
            if (alivePlayers.length === 0) {
                this.isPaused = true;
                this.statusText.setVisible(true);
                this.statusText.setText(`Draw!`);

                window.setTimeout(() => {
                    this.reset();
                }, this.PauseTimer);
            } else if (alivePlayers.length === 1) {
                this.isPaused = true;
                const player = alivePlayers[0];
                this.statusText.setVisible(true);
                this.statusText.setText(`Player: ${player.DisplayName} won!`);
                player.score += 1;
                this.scoreTexts[this.players.indexOf(player)].setText(String(player.score));

                window.setTimeout(() => {
                    this.reset();
                }, this.PauseTimer);
            }
        }
    }

    protected preload() {
        this.load.image('arrow', '/assets/games/snake/arrow.png');

        this.gameMap = new GameMap(
            this.sys.canvas.width / snakeUtils.playerSize,
            (this.sys.canvas.height - this.topContainerHeight) / snakeUtils.playerSize,
            this.topContainerHeight / snakeUtils.playerSize
        );
    }

    protected create() {
        if (this.graphics) {
            this.graphics.destroy();
        }

        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x000000 } });

        const line = new Phaser.Geom.Line(
            0,
            this.topContainerHeight,
            this.sys.canvas.width,
            this.topContainerHeight
        );

        this.graphics.strokeLineShape(line);

        const statusText = this.add.text(this.sys.canvas.width / 2, 7, '', {
            fill: '#000000',
            fontSize: 20,
        });

        if (this.scoreTexts) {
            this.scoreTexts.forEach(scoreText => {
                scoreText.destroy();
            });
            this.scoreTexts = [];
        }

        statusText.setDepth(10);
        statusText.setOrigin(0, 0);
        utils.centerText(statusText);
        this.statusText = statusText;

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

        this.players.forEach((player, index) => {
            const text = this.add.text(10 + 25 * index, 7, '0', {
                fill: player.DisplayName,
                fontSize: 20,
            });
            text.setOrigin(0, 0);
            this.scoreTexts.push(text);
        });

        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.reset(true);
    }

    private reset(center?: boolean) {
        this.startTime = moment()
            .add(this.PauseTimer, 'milliseconds')
            .toDate();

        this.statusText.setText(this.getStartText(this.PauseTimer / 1000));

        if (center) {
            utils.centerText(this.statusText);
        }

        this.isPaused = true;
        this.gameMap.reset();
        this.players.forEach(player => {
            const startPosition = this.gameMap.getRandomStartPosition();
            const startDirection = snakeUtils.getRandomStartDirection();
            player.reset();
            player.showStartArrow(true);
            player.setPosition(startPosition, startDirection, this.gameMap, this);
        });

        this.statusText.setVisible(true);

        this.updateStartText();

        window.setTimeout(() => {
            this.isPaused = false;
            this.players.forEach(player => player.showStartArrow(false));
            this.statusText.setVisible(false);
        }, this.PauseTimer);
    }

    private updateStartText = () => {
        window.setTimeout(() => {
            const diff = moment(this.startTime).diff(moment(), 'seconds');
            this.statusText.setText(this.getStartText(diff));
            if (diff > 0 && this.isPaused) {
                this.updateStartText();
            }
        }, 500);
    };

    private getStartText(time: number) {
        return `Starting in: ${time} seconds`;
    }
}
