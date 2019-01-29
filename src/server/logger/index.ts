import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(info => {
    return `${new Date(info.timestamp).toLocaleString('sv')} ${info.level}: ${info.message}`;
});

const logger = createLogger({
    format: combine(colorize(), timestamp(), myFormat),
    transports: [new transports.Console()],
});

export default logger;
