import 'module-alias/register';
import logger from 'src/server/logger';
import { parentPort, workerData } from 'worker_threads';
import { AirHockeyServer } from './air-hockey';
import { IAirHockeyGameOptions } from './models';

// import moduleAlias from 'module-alias';
// moduleAlias(__dirname + '/../../../package.json');

// export * from './air-hockey';

setTimeout(() => {
    parentPort!.postMessage({ a: 'b' });
}, 500);

parentPort!.on('message', obj => logger.info('worker', obj));

// tslint:disable-next-line: no-unused-expression
// new AirHockeyServer(workerData as IAirHockeyOptions);
