import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private player: Phaser.Physics.Arcade.Image | undefined;

    constructor() {
        super({
            key: 'GameScene',
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
        this.load.image('player', 'assets/player.png');
    }

    protected create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as Phaser.Types.Input.Keyboard.CursorKeys;

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
