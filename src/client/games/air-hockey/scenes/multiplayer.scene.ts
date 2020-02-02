import Phaser from 'phaser';
import { connect } from 'socket.io-client';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { NetworkPlayer } from '../scripts/network-player';
import { NetworkBall } from '../scripts/network-ball';
import { TextManager } from '../scripts/text-manager';

export class MultiplayerScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private players: Record<Shared.Id, NetworkPlayer>;

    private sprites: Phaser.GameObjects.GameObject[] = [];

    private ball: NetworkBall | undefined;

    private socket: SocketIOClient.Socket | undefined;

    private currentTick: number = 0;

    private textManager!: TextManager;

    private canReconnect = false;

    private isGameRunning = false;

    private reconnectKey!: Phaser.Input.Keyboard.Key;

    private networkTickInterval: number = 0;

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
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.load.image('player', 'assets/games/air-hockey/player.png');
        this.reconnectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.textManager = new TextManager(this);
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
        if (this.reconnectKey.isDown && this.canReconnect) {
            this.canReconnect = false;
            this.connect();
        }

        if (!this.isGameRunning) {
            return;
        }

        const oldDirection = { ...this.currentDirection };
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

        if (oldDirection.directionX !== directionX || oldDirection.directionY !== directionY) {
            this.sendNetworkUpdate();
        }
    }

    private sendNetworkUpdate = () => {
        this.emitEvent({ type: 'directionUpdate', direction: this.currentDirection });
    };

    private connect() {
        this.canReconnect = false;
        this.textManager.setInfoText('Connecting to LunneNet...');
        this.textManager.setInfoTextVisible(true);

        const socket = connect(window.location.origin, { port: '3000' });

        socket.on('connect', () => {
            this.textManager.setInfoText('Connected');

            this.queue(socket);
        });

        socket.on('disconnect', this.handleOnGameStopped);

        this.socket = socket;
    }

    private queue(socket: SocketIOClient.Socket) {
        this.textManager.setInfoText('Searching for match...');
        this.textManager.setInfoTextVisible(true);
        this.textManager.setScoreTextVisible(false);

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
                this.handleOnGoalEvent(event);
                break;
            default:
                throw new UnreachableCaseError(event);
        }
    };

    private handleOnGoalEvent = (event: AirHockey.IGoalEvent) => {
        this.textManager.setInfoText('Goal!');
        this.textManager.setInfoTextVisible(true);

        this.textManager.setScoreText(String(event.teamLeftScore), String(event.teamRightScore));

        window.setTimeout(() => {
            this.textManager.setInfoTextVisible(false);
        }, event.timeout);
    };

    private handleOnGameLoading = (event: AirHockey.IGameLoadingEvent) => {
        this.textManager.setInfoText('Found match! Loading...');

        this.renderArena(event.gameSize);

        event.players.forEach(p => {
            this.players[p.id] = new NetworkPlayer(p, this);
        });

        this.ball = new NetworkBall(event.ball, this);

        event.goals.forEach(this.renderGoals);

        this.emitEvent({ type: 'playerReady' });
    };

    private renderArena(gameSize: Shared.Size) {
        const middleLine = this.add.line(
            0,
            0,
            gameSize.width / 2,
            0,
            gameSize.width / 2,
            gameSize.height * 2,
            0x000000,
            0.1
        );

        middleLine.setLineWidth(0.5);

        this.sprites.push(middleLine);
    }

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
        this.isGameRunning = true;

        this.textManager.setScoreTextVisible(true);
        this.textManager.setInfoTextVisible(false);

        this.currentTick = 0;

        // eslint-disable-next-line no-console
        console.log('handleOnGameStart', event);
    };

    private handleOnGameStopped = (event: AirHockey.IGameStoppedEvent) => {
        this.isGameRunning = false;
        this.canReconnect = true;

        clearInterval(this.networkTickInterval);

        Object.values(this.players).forEach(p => p.destroy());
        this.players = {};

        if (this.ball) {
            this.ball.destroy();
            this.ball = undefined;
        }

        this.sprites.forEach(g => g.destroy());
        this.sprites = [];

        this.textManager.setScoreTextVisible(false);
        this.textManager.setScoreText('0', '0');

        this.textManager.setInfoText([
            `Game session ended. Reason: ${event.reason}`,
            'Press enter to search for new match.',
        ]);
        this.textManager.setInfoTextVisible(true);

        if (this.socket) {
            this.socket.off('serverEvent');
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
