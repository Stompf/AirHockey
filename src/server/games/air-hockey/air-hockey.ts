import { Socket } from 'socket.io';
import logger from 'src/server/logger';
import { AirHockey } from 'src/shared';
import { IAirHockeyGameOptions } from './models';
import { Player } from './player';

export class AirHockeyServer {
    private players: Player[];

    constructor(options: IAirHockeyGameOptions) {
        setInterval(() => logger.info('hej'), 500);

        // if (options.playerIds.length !== 2) {
        //     throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        // }

        // const player1 = this.createPlayer('left', options.playerIds[0]);
        // const player2 = this.createPlayer('right', options.playerIds[1]);

        // this.players = [player1, player2];
        // logger.info(this.players);
    }

    private createPlayer(team: AirHockey.Team, socket: Socket) {
        return new Player({
            name: team === 'left' ? 'left' : 'right',
            position: { x: team === 'left' ? 10 : 50, y: 10 },
            socket,
            team,
        });
    }
}
