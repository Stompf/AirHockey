import { History } from 'history';
import React from 'react';
import { Route, Router } from 'react-router';
import { AirHockey } from '../games/air-hockey';
import { Asteroids } from '../games/asteroids-matter';
import { MainAppBar } from './components';
import { Games } from './games';

interface IStartProps {
    history: History;
}

export class Start extends React.Component<IStartProps> {
    public render() {
        return (
            <Router history={this.props.history}>
                <MainAppBar />
                <Route exact path="/" component={Games} />
                <Route path="/asteroids" component={Asteroids} />
                <Route path="/air-hockey" component={AirHockey} />
            </Router>
        );
    }
}
