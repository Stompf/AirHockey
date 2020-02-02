import * as React from 'react';
// import { RouteComponentProps } from 'react-router-dom';
import { AsteroidsGame } from './asteroid.game';

export class Asteroids extends React.Component<{}, {}> {
    private game: AsteroidsGame | undefined;

    public componentDidMount() {
        this.game = new AsteroidsGame('AsteroidsMatterCanvas');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy(true);
        }
    }

    public render() {
        return <div id="AsteroidsMatterCanvas" />;
    }
}
