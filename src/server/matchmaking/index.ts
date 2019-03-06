import { Socket } from 'socket.io';
import { Shared, UnreachableCaseError } from 'src/shared';
import { Worker } from 'worker_threads';

export class Matchmaking {
    private games: Shared.Game[] = ['AirHockey'];

    private currentQueue: Record<Shared.Game, Socket[]>;

    constructor() {
        this.currentQueue = {
            AirHockey: [],
        };
    }

    public addToQueue(socket: Socket, game: Shared.Game) {
        this.removeFromQueue(socket.id);

        this.currentQueue[game].push(socket);

        this.tryFindMatch(game);
    }

    private removeFromQueue(socketId: string) {
        this.games.forEach(game => {
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
            const player1 = this.currentQueue.AirHockey.shift();
            const player2 = this.currentQueue.AirHockey.shift();

            const worker = new Worker('');
            worker.
        }
    }
}
