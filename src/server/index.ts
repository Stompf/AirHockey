import express from 'express';
import 'module-alias/register';
import path from 'path';
import logger from './logger';

const port = 3000;

const app = express();

app.use(express.static('public'));

app.get('/', (_req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(port, listening);

function listening() {
    logger.info(`Server available on http://localhost:${port}`);
}
