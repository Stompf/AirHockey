import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AirHockey } from '../games/air-hockey';
import { Asteroids } from '../games/asteroids-matter';
import { Snake } from '../games/snake';
import { Unity } from '../games/unity';
import { AboutMe } from './about-me';
import { MainAppBar } from './components';
import { Games } from './games';

export class Start extends React.Component<{}> {
    public render() {
        return (
            <React.Fragment>
                <MainAppBar />
                <Switch>
                    <Route path="/asteroids" component={Asteroids} />
                    <Route path="/air-hockey" component={AirHockey} />
                    <Route path="/games" component={Games} />
                    <Route path="/about-me" component={AboutMe} />
                    <Route path="/snake" component={Snake} />
                    <Route path="/unity" component={Unity} />
                    <Redirect to="/games" />
                </Switch>
            </React.Fragment>
        );
    }
}
