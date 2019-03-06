import { Socket } from 'socket.io';
import { AirHockey } from 'src/shared';
import { IAirHockeyOptions } from './models';
import { Player } from './player';

export class AirHockeyServer {
    private players: Player[];

    constructor(options: IAirHockeyOptions) {
        if (options.players.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.players.length}`);
        }

        const player1 = this.createPlayer('left', options.players[0]);
        const player2 = this.createPlayer('right', options.players[1]);

        this.players = [player1, player2];
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
