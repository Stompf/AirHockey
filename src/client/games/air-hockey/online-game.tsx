import * as React from 'react';
import { AirHockeyGame } from './scripts';

export class AirHockeyOnlineGameComponent extends React.Component<{}, {}> {
    private game: AirHockeyGame | undefined;

    public componentDidMount() {
        this.game = new AirHockeyGame('AirHockeyCanvas', 'online');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy(true);
        }
    }

    public render() {
        return <div id="AirHockeyCanvas" />;
    }
}
