import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SnakeGame } from './scripts';

export class Snake extends React.Component<RouteComponentProps<any>, {}> {
    private game: SnakeGame | undefined;

    public componentDidMount() {
        this.game = new SnakeGame('SnakeGame');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy(true);
        }
    }

    public render() {
        return <div id="SnakeGame" />;
    }
}
