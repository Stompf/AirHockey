import * as React from 'react';
// import { RouteComponentProps } from 'react-router-dom';
import { AsteroidsGame } from './scripts/game';

class Asteroids extends React.Component<any, {}> {
    private game: AsteroidsGame | undefined;

    public render() {
        return <div id="AsteroidsCanvas" />;
    }

    public componentDidMount() {
        this.game = new AsteroidsGame('AsteroidsCanvas');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy();
        }
    }
}

export default Asteroids;
