import express from 'express';
import http from 'http';
import 'module-alias/register';
import path from 'path';
import socketIO from 'socket.io';
import logger from './logger';
import { Matchmaking } from './matchmaking';

const port = 3000;

const app = express();

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
    matchMaking.addToQueue(socket, 'AirHockey');
});

function listening() {
    logger.info(`Server available on http://localhost:${port}`);
}
