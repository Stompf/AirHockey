import express from 'express';
import 'module-alias/register';
import path from 'path';

const port = 3000;

const app = express();

app.use(express.static('public'));

app.get('/', (_req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`App listening on port ${port}`));
