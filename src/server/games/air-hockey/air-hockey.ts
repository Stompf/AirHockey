import { Engine, Runner, World } from 'matter-js';
import logger from 'src/server/logger';
import { AirHockey, Shared } from 'src/shared';
import { IAirHockeyGameOptions } from './models';
import { Player } from './player';

export class AirHockeyServer {
    private players: Player[];
    private engine: Engine;
    private runner: Runner;

    private readonly delta = 1000 / 60;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.IBaseGameEvent) => void
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

    public onEventReceived = (event: AirHockey.IBaseGameEvent) => {};

    private createPlayer(team: AirHockey.Team, id: Shared.Id) {
        return new Player({
            name: team === 'left' ? 'left' : 'right',
            position: { x: team === 'left' ? 10 : 50, y: 10 },
            id,
            team,
        });
    }

    private startEngine() {
        Runner.start(this.runner, this.engine);
    }
}
