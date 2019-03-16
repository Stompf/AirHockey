import { Engine, Runner, World } from 'matter-js';
import logger from 'src/server/logger';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { IAirHockeyGameOptions } from './models';
import { Player } from './player';

export class AirHockeyServer {
    private players: Player[];
    private engine: Engine;
    private runner: Runner;

    private readonly delta = 1000 / 60;
    private readonly pauseTime = 5000;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.ServerToClientGameEvent) => void
    ) {
        if (options.playerIds.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        }
        const player1 = this.createPlayer('left', options.playerIds[0]);
        const player2 = this.createPlayer('right', options.playerIds[1]);
        this.players = [player1, player2];
        logger.info(this.players);

        this.runner = Runner.create({ isFixed: true, delta: this.delta });
        this.engine = Engine.create();
        this.engine.world.gravity.y = 0;
        const allBodies = this.players.map(p => p.body);
        World.add(this.engine.world, allBodies);
    }

    public onEventReceived = ({ data, id }: AirHockey.IServerReceivedEvent) => {
        switch (data.type) {
            case 'playerReady':
                this.onPlayerReady(id);
                break;
            default:
                throw new UnreachableCaseError(data.type);
        }
    };

    private createPlayer(team: AirHockey.Team, id: Shared.Id) {
        return new Player({
            name: team === 'left' ? 'left' : 'right',
            position: { x: team === 'left' ? 10 : 50, y: 10 },
            id,
            team,
        });
    }

    private onPlayerReady = (id: Shared.Id) => {
        this.getPlayer(id).isReady = true;
        if (this.players.every(p => p.isReady)) {
            this.startGame();
        }
    };

    private startGame() {
        const startTime = new Date();
        startTime.setMilliseconds(startTime.getMilliseconds() + this.pauseTime);

        setTimeout(() => {
            Runner.start(this.runner, this.engine);
        }, this.pauseTime);

        this.postEvent({
            type: 'gameStarting',
            startTime: startTime.toISOString(),
            players: this.players.map(p => p.toNetworkPlayer()),
        });
    }

    private getPlayer(id: Shared.Id) {
        const player = this.players.find(p => id === p.id);
        if (!player) {
            throw Error(`Can not find player with id ${id}`);
        }
        return player;
    }
}
