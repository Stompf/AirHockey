import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AirHockeyGame } from './scripts';

class AirHockey extends React.Component<RouteComponentProps<any>, {}> {
    private game: AirHockeyGame | undefined;

    public render() {
        return <div id="AirHockeyCanvas" />;
    }

    public componentDidMount() {
        this.game = new AirHockeyGame('AirHockeyCanvas');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy();
        }
    }
}

export default AirHockey;
