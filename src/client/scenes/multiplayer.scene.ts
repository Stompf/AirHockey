import Phaser from 'phaser';
import { connect } from 'socket.io-client';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';

export class MultiplayerScene extends Phaser.Scene {
    private cursors!: Phaser.Input.Keyboard.CursorKeys;
    private player: Phaser.Physics.Arcade.Image | undefined;

    private socket: SocketIOClient.Socket | undefined;

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

        this.queue();
    }

    private queue() {
        const socket = connect(
            window.location.href,
            { port: '3000' }
        );

        socket.on('connect', () => {
            // tslint:disable-next-line: no-console
            console.log('connected');

            const matchmakerEvent: Shared.IMatchmakerEvent = {
                game: 'AirHockey',
            };
            socket.emit('matchmaker', matchmakerEvent);
        });

        socket.on('serverEvent', this.onServerEvent);

        this.socket = socket;
    }

    private emitEvent = (event: AirHockey.ClientToServerGameEvent) => {
        if (!this.socket) {
            return;
        }
        this.socket.emit('gameEvent', event);
    };

    private onServerEvent = (event: AirHockey.ServerToClientGameEvent) => {
        switch (event.type) {
            case 'gameStarting':
                this.handleOnGameStart(event);
                break;
            case 'gameStopped':
                this.handleOnGameStopped(event);
                break;
            case 'networkUpdate':
                this.handleOnNetworkUpdate(event);
                break;
            default:
                throw new UnreachableCaseError(event);
        }
    };

    private handleOnGameStart = (event: AirHockey.IGameStartingEvent) => {
        // tslint:disable-next-line: no-console
        console.log('handleOnGameStart', event);
    };

    private handleOnGameStopped = (event: AirHockey.IGameStoppedEvent) => {
        // tslint:disable-next-line: no-console
        console.log('handleOnGameStopped', event);
    };

    private handleOnNetworkUpdate = (event: AirHockey.INetworkUpdateEvent) => {
        // tslint:disable-next-line: no-console
        console.log('handleOnNetworkUpdate', event);
    };
}
