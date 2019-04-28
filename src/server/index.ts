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
app.use(helmet());

app.use(morgan('combined'));
app.use(express.static('public'));

app.get('/', (_req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

const matchMaking = new Matchmaking();

const server = http.createServer(app);
server.listen(port, listening);

const io = socketIO();
io.serveClient(false);
io.attach(server);

io.on('connection', socket => {
    logger.info('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        logger.info('a user disconnected: ' + socket.id);

        matchMaking.removeFromQueue(socket.id);
    });

    socket.on('matchmaker', (event: Shared.IMatchmakerEvent) => {
        matchMaking.addToQueue(socket, event.game);
    });
});

function listening() {
    logger.info(`Server available on http://localhost:${port}`);
}
