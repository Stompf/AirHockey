import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MazeGame } from './scripts';

export class Maze extends React.Component<RouteComponentProps<any>, {}> {
    private game: MazeGame | undefined;

    public render() {
        return <div id="MazeGame" />;
    }

    public componentDidMount() {
        this.game = new MazeGame('MazeGame');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}
