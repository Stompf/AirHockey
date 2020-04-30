import Phaser from 'phaser';
import { ArenaRender } from '../scripts/arena';

export class LocalScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private player: Phaser.Physics.Arcade.Image | undefined;

    private arenaRender!: ArenaRender;

    constructor() {
        super({
            key: 'LocalScene',
        });
    }

    public update() {
        const SPEED = 3;
        if (this.player) {
            if (this.cursors.left!.isDown) {
                this.player.setVelocityX(-90 * SPEED);
            } else if (this.cursors.right!.isDown) {
                this.player.setVelocityX(90 * SPEED);
            } else {
                this.player.setVelocityX(0);
            }

            if (this.cursors.up!.isDown) {
                this.player.setVelocityY(-90 * SPEED);
            } else if (this.cursors.down!.isDown) {
                this.player.setVelocityY(90 * SPEED);
            } else {
                this.player.setVelocityY(0);
            }
        }
    }

    protected preload() {
        this.load.bitmapFont('font', '/assets/fonts/font.png', '/assets/fonts/font.fnt');
        this.load.image('player', '/assets/games/air-hockey/player.png');
        this.arenaRender = new ArenaRender(this);
    }

    protected create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');

        this.arenaRender.renderArena({
            height: this.sys.canvas.height,
            width: this.sys.canvas.width,
        });

        this.arenaRender.renderGoals({});

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        const player = this.physics.add.image(400, 300, 'player');
        player.setDisplaySize(50, 50);
        player.setOrigin(0.5, 0.5);
        player.setCircle(25);
        player.setCollideWorldBounds(true);
        player.setBounce(1, 1);
        player.setTintFill(0xff9955);
        this.player = player;

        const ball = this.physics.add.image(100, 50, 'player');
        ball.setDisplaySize(20, 20);
        ball.setCollideWorldBounds(true);
        ball.setTintFill(0x000000);
        ball.setBounce(1, 1);
        ball.setCircle(25);

        this.physics.add.collider(player, ball);
    }
}
