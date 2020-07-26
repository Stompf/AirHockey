import Peer from 'peerjs';

let peer: Peer;

const options: Peer.PeerJSOption = {
    host: 'peerjs.lunne.nu',
    port: 443,
    path: '/myapp',
    secure: true,
};

export function host() {
    peer = new Peer(options);

    peer.on('open', (id) => {
        // eslint-disable-next-line no-console
        console.log(`Listening on id: ${id}`);
    });

    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            // Will print 'hi!'
            // eslint-disable-next-line no-console
            console.log(data);
        });
        conn.on('open', () => {
            conn.send('hello! I am host');
        });
        conn.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.log('Error', err);
        });
        conn.on('close', () => {
            // eslint-disable-next-line no-console
            console.log('Close');
        });
    });
}

export function join(id: string) {
    const conn = peer.connect(id);

    conn.on('data', (data) => {
        // eslint-disable-next-line no-console
        console.log(data);
    });

    conn.on('open', () => {
        conn.send('hello! I am joiner');
    });

    conn.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log('Error', err);
    });

    conn.on('close', () => {
        // eslint-disable-next-line no-console
        console.log('Close');
    });
}
