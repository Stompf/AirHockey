import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { GameCard } from './game-card';

export class Games extends React.Component {
    public render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography align="center" variant="h5" component="h2">
                        Games
                    </Typography>
                </Grid>
                <GameCard
                    title={'Air hockey'}
                    text={'Play air hockey either online or locally'}
                    image={'assets/games/air-hockey.png'}
                />
            </Grid>
        );
    }
}
