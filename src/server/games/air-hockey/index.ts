import 'module-alias/register';
import { AirHockey } from 'src/shared';
import { parentPort, workerData } from 'worker_threads';
import { AirHockeyServer } from './air-hockey';
import { IAirHockeyGameOptions } from './models';

if (!parentPort) {
    throw Error(`No parent port was found`);
}

const server = new AirHockeyServer(workerData as IAirHockeyGameOptions, postEvent);

// Listen on events
parentPort.on('message', server.onEventReceived);

function postEvent(event: AirHockey.IBaseGameEvent) {
    if (!parentPort) {
        throw Error(`No parent port was found`);
    }

    parentPort.postMessage(event);
}
