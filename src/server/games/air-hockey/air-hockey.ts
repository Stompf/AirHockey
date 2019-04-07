import { Bodies, Engine, World } from 'matter-js';
import logger from 'src/server/logger';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { IAirHockeyGameOptions } from './models';
import { Ball, Player } from './scripts';

export class AirHockeyServer {
    private readonly physicsDelta = 1000 / 60;
    private readonly networkUpdateDelta = 1000 / 60;
    private readonly pauseTime = 0;
    private readonly worldBounds = {
        width: 800,
        height: 600,
    };

    private currentTick: number = 0;
    private players: Record<Shared.Id, Player>;
    private ball: Ball;

    private engine: Engine;
    private physicsInterval: NodeJS.Timer | undefined;
    private networkUpdateInterval: NodeJS.Timeout | undefined;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.ServerToClientGameEvent) => void
    ) {
        if (options.playerIds.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        }
        this.players = {};
        this.ball = new Ball({
            position: {
                x: this.worldBounds.width / 2,
                y: this.worldBounds.height / 2,
            },
        });
        this.addPlayer('left', options.playerIds[0]);
        this.addPlayer('right', options.playerIds[1]);
        logger.info(this.players);

        this.engine = Engine.create();
        this.engine.world.gravity.y = 0;
        const allBodies = this.getPlayers()
            .map(p => p.body)
            .concat([this.ball.body])
            .concat(this.addBounds());
        World.add(this.engine.world, allBodies);
    }

    public onEventReceived = ({ data, id }: AirHockey.IServerReceivedEvent) => {
        switch (data.type) {
            case 'playerReady':
                this.onPlayerReady(id);
                break;
            case 'directionUpdate':
                this.onPlayerDirectionUpdate(id, data);
                break;
            case 'disconnected':
                this.stopGame();
                break;
            default:
                throw new UnreachableCaseError(data);
        }
    };

    public emitLoaded = () => {
        this.postEvent({
            type: 'gameLoading',
            players: this.getPlayers().map(p => p.toNetworkPlayer()),
            ball: this.ball.toNetworkBall(),
        });
    };

    private addPlayer(team: AirHockey.Team, id: Shared.Id) {
        this.players[id] = new Player({
            name: team === 'left' ? 'left' : 'right',
            position: { x: team === 'left' ? 50 : 150, y: 100 },
            id,
            team,
        });
    }

    private addBounds() {
        const boundsOptions: Matter.IChamferableBodyDefinition = {
            isStatic: true,
            mass: 1000,
            restitution: 1,
        };

        const top = Bodies.rectangle(
            this.worldBounds.width / 2,
            0,
            this.worldBounds.width,
            10,
            boundsOptions
        );
        const right = Bodies.rectangle(
            this.worldBounds.width / 2,
            this.worldBounds.height,
            this.worldBounds.width,
            10,
            boundsOptions
        );
        const bottom = Bodies.rectangle(
            this.worldBounds.width,
            this.worldBounds.height / 2,
            10,
            this.worldBounds.height,
            boundsOptions
        );
        const left = Bodies.rectangle(
            0,
            this.worldBounds.height / 2,
            10,
            this.worldBounds.height,
            boundsOptions
        );
        return [top, right, bottom, left];
    }

    private onPlayerDirectionUpdate = (
        id: Shared.Id,
        eventData: AirHockey.IPlayerDirectionUpdate
    ) => {
        this.getPlayer(id).updateDirection(
            eventData.direction.directionX,
            eventData.direction.directionY
        );
    };

    private onPlayerReady = (id: Shared.Id) => {
        this.getPlayer(id).isReady = true;
        if (this.getPlayers().every(p => p.isReady)) {
            this.startGame();
        }
    };

    private updatePhysics = () => {
        Engine.update(this.engine, this.physicsDelta);
    };

    private startGame() {
        this.currentTick = 0;
        const startTime = new Date();
        startTime.setMilliseconds(startTime.getMilliseconds() + this.pauseTime);

        setTimeout(() => {
            this.getPlayers().forEach(p => p.setPauseBody(false));
            this.ball.setPauseBody(false);
            this.physicsInterval = setInterval(this.updatePhysics, this.physicsDelta);
        }, this.pauseTime);

        this.postEvent({
            type: 'gameStarting',
            startTime: startTime.toISOString(),
        });

        this.networkUpdateInterval = setInterval(this.onSendNetworkUpdate, this.networkUpdateDelta);

        logger.info('Started air-hockey game');
    }

    private stopGame = () => {
        if (this.physicsInterval) {
            clearInterval(this.physicsInterval);
        }

        if (this.networkUpdateInterval) {
            clearInterval(this.networkUpdateInterval);
        }

        this.postEvent({
            type: 'gameStopped',
            reason: 'player_disconnected',
        });

        // setTimeout(() => {
        //     process.exit();
        // }, 2000);
    };

    private onSendNetworkUpdate = () => {
        this.currentTick++;

        this.postEvent({
            type: 'networkUpdate',
            players: this.getPlayers().map(p => p.toNetworkUpdate()),
            tick: this.currentTick,
            ball: this.ball.toNetworkUpdate(),
        });
    };

    private getPlayer(id: Shared.Id) {
        const player = this.players[id];
        if (!player) {
            throw Error(`Can not find player with id ${id}`);
        }
        return player;
    }

    private getPlayers() {
        return Object.values(this.players);
    }
}
