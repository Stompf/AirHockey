import 'module-alias/register';
import { AirHockey } from 'src/shared';
import { parentPort, workerData } from 'worker_threads';
import logger from '../../logger';
import { AirHockeyServer } from './air-hockey';
import { IAirHockeyGameOptions } from './models';

if (!parentPort) {
    throw Error(`No parent port was found`);
}

const server = new AirHockeyServer(
    workerData as IAirHockeyGameOptions,
    postEvent,
    onTerminationRequested
);

// Listen on events
parentPort.on('message', server.onEventReceived);

// Emit loaded
server.emitLoaded();

function postEvent(event: AirHockey.ServerToClientGameEvent) {
    if (!parentPort) {
        throw Error(`No parent port was found`);
    }

    parentPort.postMessage(event);
}

function onTerminationRequested(event: AirHockey.ITerminateRequestEvent) {
    logger.info(`AirHockey - Termination requested`, event);

    setTimeout(() => process.exit(), 0);
}
