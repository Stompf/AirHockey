import express from 'express';
import helmet from 'helmet';
import http from 'http';
import 'module-alias/register';
import morgan from 'morgan';
import path from 'path';
import socketIO from 'socket.io';
import { Shared } from 'src/shared';
import logger from './logger';
import { Matchmaking } from './matchmaking';

const port = 3000;

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "example.com", "'unsafe-inline'", "'unsafe-eval'"],
            objectSrc: ["'self'", "blob:"],
            imgSrc: ["'self'", "data:", "blob:"],
            styleSrc: ["'unsafe-inline'"],
            styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            workerSrc: ["'self'","blob:"],
            scriptSrcElem: ["'self'","blob:", "'unsafe-inline'"],
            connectSrc: ["'self'","blob:", "https://config.uca.cloud.unity3d.com", "https://cdp.cloud.unity3d.com"],
            upgradeInsecureRequests: [],
        }
    }
}));

app.use(morgan('combined'));
app.use(express.static('public'));

app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/index.html'));
});

const matchMaking = new Matchmaking();

const server = http.createServer(app);
server.listen(port, listening);

const io = new socketIO.Server(server);

io.on('connection', socket => {
    logger.info(`a user connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`a user disconnected: ${socket.id}`);

        matchMaking.removeFromQueue(socket.id);
    });

    socket.on('matchmaker', (event: Shared.IMatchmakerEvent) => {
        matchMaking.addToQueue(socket, event.game);
    });
});

function listening() {
    logger.info(`Server available on http://localhost:${port}`);
}
