import { Engine, Runner, World } from 'matter-js';
import logger from 'src/server/logger';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { IAirHockeyGameOptions } from './models';
import { Player } from './player';

export class AirHockeyServer {
    private readonly delta = 1000 / 60;
    private readonly networkUpdateDelta = 1000 / 20;
    private readonly pauseTime = 5000;

    private players: Record<Shared.Id, Player>;
    private engine: Engine;
    private runner: Runner;

    private networkUpdateInterval: NodeJS.Timeout | undefined;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.ServerToClientGameEvent) => void
    ) {
        if (options.playerIds.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        }
        this.players = {};
        this.addPlayer('left', options.playerIds[0]);
        this.addPlayer('right', options.playerIds[1]);
        logger.info(this.players);

        this.runner = Runner.create({ isFixed: true, delta: this.delta });
        this.engine = Engine.create();
        this.engine.world.gravity.y = 0;
        const allBodies = this.getPlayers().map(p => p.body);
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

    private addPlayer(team: AirHockey.Team, id: Shared.Id) {
        this.players[id] = new Player({
            name: team === 'left' ? 'left' : 'right',
            position: { x: team === 'left' ? 10 : 50, y: 10 },
            id,
            team,
        });
    }

    private onPlayerDirectionUpdate = (
        id: Shared.Id,
        eventData: AirHockey.IPlayerDirectionUpdate
    ) => {
        this.getPlayer(id).updateDirection(eventData.directionX, eventData.directionY);
    };

    private onPlayerReady = (id: Shared.Id) => {
        this.getPlayer(id).isReady = true;
        if (this.getPlayers().every(p => p.isReady)) {
            this.startGame();
        }
    };

    private startGame() {
        const startTime = new Date();
        startTime.setMilliseconds(startTime.getMilliseconds() + this.pauseTime);

        setTimeout(() => {
            this.getPlayers().forEach(p => p.setPauseBody(false));
            Runner.start(this.runner, this.engine);
        }, this.pauseTime);

        this.postEvent({
            type: 'gameStarting',
            startTime: startTime.toISOString(),
            players: this.getPlayers().map(p => p.toNetworkPlayer()),
        });

        this.networkUpdateInterval = setInterval(this.onSendNetworkUpdate, this.networkUpdateDelta);
    }

    private stopGame = () => {
        Runner.stop(this.runner);

        if (this.networkUpdateInterval) {
            clearInterval(this.networkUpdateInterval);
        }

        this.postEvent({
            type: 'gameStopped',
            reason: 'player_disconnected',
        });
    };

    private onSendNetworkUpdate = () => {
        this.postEvent({
            type: 'networkUpdate',
            players: this.getPlayers().map(p => p.toNetworkUpdate()),
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
