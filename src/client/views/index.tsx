import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AirHockey } from '../games/air-hockey';
import { Asteroids } from '../games/asteroids-matter';
import { Snake } from '../games/snake';
import { UnityFps } from '../games/unity-fps';
import { AboutMe } from './about-me';
import { MainAppBar } from './components';
import { Games } from './games';

export const Start: React.FunctionComponent = () => (
    <>
        <MainAppBar />
        <Switch>
            <Route path="/asteroids" component={Asteroids} />
            <Route path="/air-hockey" component={AirHockey} />
            <Route path="/games" component={Games} />
            <Route path="/about-me" component={AboutMe} />
            <Route path="/snake" component={Snake} />
            <Route path="/unity-fps" component={UnityFps} />
            <Redirect to="/games" />
        </Switch>
    </>
);
