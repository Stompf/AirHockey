import Phaser from 'phaser';
import { connect } from 'socket.io-client';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { NetworkBall, NetworkPlayer } from '../scripts';

export class MultiplayerScene extends Phaser.Scene {
    private cursors!: Phaser.Input.Keyboard.CursorKeys;
    private players: Record<Shared.Id, NetworkPlayer>;
    private sprites: Phaser.GameObjects.GameObject[] = [];

    private ball: NetworkBall | undefined;

    private socket: SocketIOClient.Socket | undefined;
    private currentTick: number = 0;

    private networkTickInterval: number = 0;
    private networkTickDelta = 1000 / 20;
    private currentDirection: AirHockey.IDirection = {
        directionX: 0,
        directionY: 0,
    };

    constructor() {
        super({
            key: 'MultiplayerScene',
        });
        this.players = {};
    }

    public update() {
        this.updateInput();
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

        this.connect();
    }

    private updateInput() {
        let directionX = 0;
        let directionY = 0;

        if (this.cursors.left!.isDown) {
            directionX -= 1;
        } else if (this.cursors.right!.isDown) {
            directionX += 1;
        }

        if (this.cursors.up!.isDown) {
            directionY -= 1;
        } else if (this.cursors.down!.isDown) {
            directionY += 1;
        }

        this.currentDirection = {
            directionX,
            directionY,
        };
    }

    private sendNetworkUpdate = () => {
        this.emitEvent({ type: 'directionUpdate', direction: this.currentDirection });
    };

    private connect() {
        const socket = connect(
            window.location.href,
            { port: '3000' }
        );

        socket.on('connect', () => {
            // tslint:disable-next-line: no-console
            console.log('connected');

            this.queue(socket);
        });

        socket.on('disconnect', this.handleOnGameStopped);

        this.socket = socket;
    }

    private queue(socket: SocketIOClient.Socket) {
        socket.on('serverEvent', this.onServerEvent);

        const matchmakerEvent: Shared.IMatchmakerEvent = {
            game: 'AirHockey',
        };
        socket.emit('matchmaker', matchmakerEvent);
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
            case 'gameLoading':
                this.handleOnGameLoading(event);
                break;
            case 'goal':
                // tslint:disable-next-line: no-console
                console.log('GOAL!');
                break;
            default:
                throw new UnreachableCaseError(event);
        }
    };

    private handleOnGameLoading = (event: AirHockey.IGameLoadingEvent) => {
        event.players.forEach(p => {
            this.players[p.id] = new NetworkPlayer(p, this);
        });

        this.ball = new NetworkBall(event.ball, this);

        event.goals.forEach(this.renderGoals);

        this.emitEvent({ type: 'playerReady' });
    };

    private renderGoals = (goalOption: AirHockey.IGoalOptions) => {
        this.drawPositionWithBox(goalOption.top, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.back, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.bottom, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.goal, 0x000000);
    };

    private drawPositionWithBox(pBox: AirHockey.IPositionWithBox, color: Shared.Color) {
        this.sprites.push(this.add.rectangle(pBox.x, pBox.y, pBox.width, pBox.height, color));
    }

    private handleOnGameStart = (event: AirHockey.IGameStartingEvent) => {
        this.currentTick = 0;
        this.networkTickInterval = window.setInterval(
            this.sendNetworkUpdate,
            this.networkTickDelta
        );

        // tslint:disable-next-line: no-console
        console.log('handleOnGameStart', event);
    };

    private handleOnGameStopped = (_event: AirHockey.IGameStoppedEvent) => {
        clearInterval(this.networkTickInterval);

        Object.values(this.players).forEach(p => p.destroy());
        this.players = {};

        if (this.ball) {
            this.ball.destroy();
            this.ball = undefined;
        }

        this.sprites.forEach(g => g.destroy());

        this.sprites = [];

        if (this.socket) {
            this.socket.off('serverEvent');
            this.queue(this.socket);
        }
    };

    private handleOnNetworkUpdate = (event: AirHockey.INetworkUpdateEvent) => {
        if (this.currentTick > event.tick) {
            return;
        }

        event.players.forEach(p => {
            this.players[p.id].updatePlayer(p);
        });

        if (this.ball) {
            this.ball.update(event.ball);
        }

        this.currentTick = event.tick;
    };
}
