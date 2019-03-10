import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, metadata } = format;

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
});

function isEmpty(obj: {}) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export default logger;
