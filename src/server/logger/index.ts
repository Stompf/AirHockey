import { createLogger, format, transports } from 'winston';
import { isProduction } from '../utils';

const { combine, timestamp, printf, colorize, metadata } = format;

function isEmpty(obj: {}) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const myFormat = printf(info => {
    let message = `${new Date(info.timestamp).toLocaleString('sv')} ${info.level}: ${info.message}`;

    if (!isEmpty(info.metadata)) {
        message += ` ${JSON.stringify(info.metadata)}`;
    }

    return message;
});

const logger = createLogger({
    format: combine(colorize(), metadata(), timestamp(), myFormat),
    transports: [new transports.Console()],
    level: isProduction() ? 'info' : 'debug',
});

export default logger;
