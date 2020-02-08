import { Socket } from 'socket.io';
import logger from 'src/server/logger';
import { Shared, UnreachableCaseError } from 'src/shared';
import { Worker } from 'worker_threads';
import { WorkerId } from './models';

const maxThreadLifeTimeMs = 60 * 60 * 1000;
const maxCurrentThreads = 5;

const currentThreads: Record<WorkerId, Worker | undefined> = {};
const currentThreadTimeouts: Record<WorkerId, NodeJS.Timeout | undefined> = {};

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

        worker.on('message', event => onWorkerMessage(sockets, event));
        worker.on('error', error => onWorkerError(id, error));
        worker.on('exit', () => onWorkerExited(id));

        currentThreadTimeouts[id] = setTimeout(() => {
            logger.info(
                `Force quitting worker with id: ${id} after: ${maxThreadLifeTimeMs} milliseconds`
            );
            terminateWorker(id);
        }, maxThreadLifeTimeMs);

        sockets.forEach(socket => bindSocketGameEvents(socket, worker));

        return true;
    } catch (e) {
        logger.error(`Start worker error: ${e.message}`, e);
        return false;
    }
}

export function isThreadAvailable() {
    return Object.keys(currentThreads).length <= maxCurrentThreads;
}

export function terminateWorker(id: WorkerId) {
    const worker = currentThreads[id];
    if (!worker) {
        logger.info(`Tried to terminate worker with id: ${id} but no such worker was found`);
        return;
    }

    delete currentThreads[id];
    worker.terminate();
}

function onWorkerMessage(sockets: Socket[], event: unknown) {
    // logger.debug('message', event);

    sockets.filter(s => s.connected).forEach(socket => socket.emit('serverEvent', event));
}

function onWorkerError(id: WorkerId, error: Error) {
    logger.error(`Worker with id: ${id} error`, error);
}

function onWorkerExited(id: WorkerId) {
    delete currentThreads[id];

    const timeout = currentThreadTimeouts[id];
    if (timeout) {
        clearTimeout(timeout);
    }
    delete currentThreadTimeouts[id];

    logger.info(`Worker with id: ${id} removed`);
}

function getGamePath(game: Shared.Game) {
    switch (game) {
        case 'AirHockey':
            return `${__dirname}/../games/air-hockey/index.js`;
        default:
            throw new UnreachableCaseError(game);
    }
}

function bindSocketGameEvents(socket: Socket, worker: Worker) {
    removeAllListeners(socket);

    socket.on('gameEvent', gameEvent => {
        postMessageToWorker(worker, socket, gameEvent);
    });

    socket.on('disconnect', () => {
        logger.info(`Socket with id: ${socket.id} disconnected`);
        removeAllListeners(socket);

        postMessageToWorker(worker, socket, { type: 'disconnected' });
    });
}

function removeAllListeners(socket: Socket) {
    socket.removeAllListeners('gameEvent');
}

function postMessageToWorker(worker: Worker, socket: Socket, message: any) {
    if (isWorkerActive(worker)) {
        worker.postMessage({ id: socket.id, data: message });
    } else {
        logger.warn(
            `Tried to post to worker ${worker.threadId} but the worker is terminated`,
            message
        );

        socket.disconnect(true);
    }
}

function isWorkerActive(worker: Worker) {
    return !!currentThreads[worker.threadId];
}
