import { Socket } from 'socket.io';
import logger from 'src/server/logger';
import { Shared, UnreachableCaseError } from 'src/shared';
import { IAirHockeyGameOptions } from '../games/air-hockey/models';
import * as workerHandler from '../worker';

export class Matchmaking {
    private supportedGames: Shared.Game[] = ['AirHockey'];

    private currentQueue: Record<Shared.Game, Socket[]>;

    constructor() {
        this.currentQueue = {
            AirHockey: [],
        };
    }

    public addToQueue(socket: Socket, game: Shared.Game) {
        if (!this.supportedGames.includes(game)) {
            logger.info(`Tried to queue to game: ${game} but it is not supported`);
            return;
        }

        logger.info(`New socket added to queue`, socket.id);

        this.removeFromQueue(socket.id);

        this.currentQueue[game].push(socket);

        this.tryFindMatch(game);
    }

    public removeFromQueue(socketId: string) {
        this.supportedGames.forEach(game => {
            this.currentQueue[game] = this.currentQueue[game].filter(s => s.id !== socketId);
        });
    }

    private tryFindMatch(game: Shared.Game) {
        switch (game) {
            case 'AirHockey':
                return this.handleAirHockeyQueue();
            default:
                throw new UnreachableCaseError(game);
        }
    }

    private handleAirHockeyQueue() {
        if (this.currentQueue.AirHockey.length >= 2) {
            const player1 = this.currentQueue.AirHockey.shift()!;
            const player2 = this.currentQueue.AirHockey.shift()!;

            const airHockeyOptions: IAirHockeyGameOptions = {
                playerIds: [player1.id, player2.id],
            };

            const worker = workerHandler.startWorker(
                'AirHockey',
                [player1, player2],
                airHockeyOptions
            );

            if (!worker) {
                this.currentQueue.AirHockey.unshift(player1, player2);
            }
        }
    }
}
