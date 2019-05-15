import React from 'react';
import { MainAppBar } from './components';
import { Games } from './games';

export class Start extends React.Component {
    public render() {
        return (
            <React.Fragment>
                <MainAppBar />
                <Games />
            </React.Fragment>
        );
    }
}
