import { Socket } from 'socket.io';
import logger from 'src/server/logger';
import { Shared, UnreachableCaseError } from 'src/shared';
import { Worker } from 'worker_threads';

const currentThreads: Record<number, Worker | undefined> = {};

export function startWorker(game: Shared.Game, sockets: Socket[], workerData: any): boolean {
    try {
        const path = getGamePath(game);

        const worker = new Worker(path, {
            workerData,
        });
        const id = worker.threadId;

        if (currentThreads[id]) {
            logger.info(
                `Tried to start worker with id ${id} but a worker with that id already exist`
            );
            return false;
        }

        currentThreads[id] = worker;
        logger.info(
            `Worker with id: ${id} started for game: ${game}. Total workers: ${
                Object.keys(currentThreads).length
            }`
        );

        worker.on('message', message => logger.info('message', message));
        worker.on('error', error => onWorkerError(id, error));
        worker.on('exit', () => onWorkerExited(id));

        setTimeout(() => {
            worker.terminate();
        }, 5000);

        sockets.forEach(socket => bindSocketGameEvents(socket, worker));

        return true;
    } catch (e) {
        logger.error(`Start worker error: ${e.message}`, e);
        return false;
    }
}

export function terminateWorker(id: number) {
    const worker = currentThreads[id];
    if (!worker) {
        logger.info(`Tried to terminate worker with id: ${id} but no such worker was found`);
        return;
    }

    worker.terminate();
}

function onWorkerError(id: number, error: Error) {
    logger.error(`Worker with id: ${id} error`, error);
}

function onWorkerExited(id: number) {
    delete currentThreads[id];
    logger.info(`Worker with id: ${id} removed`);
}

function getGamePath(game: Shared.Game) {
    switch (game) {
        case 'AirHockey':
            return __dirname + '/../games/air-hockey/index.js';
        default:
            throw new UnreachableCaseError(game);
    }
}

function bindSocketGameEvents(socket: Socket, worker: Worker) {
    removeAllListeners(socket);

    socket.on('gameEvent', gameEvent => worker.postMessage(gameEvent));
}

function removeAllListeners(socket: Socket) {
    socket.removeAllListeners('gameEvent');
}
