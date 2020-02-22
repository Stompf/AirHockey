import * as React from 'react';
import { AirHockeyGame } from './scripts';

export class AirHockeyLocalGameComponent extends React.Component<{}, {}> {
    private game: AirHockeyGame | undefined;

    public componentDidMount() {
        this.game = new AirHockeyGame('AirHockeyCanvas', 'local');
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
