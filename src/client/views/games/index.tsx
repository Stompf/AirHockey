import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { GameCard } from './game-card';

export class Games extends React.Component {
    public render() {
        return (
            <Grid container spacing={40}>
                <Grid item xs={12} />

                <Grid item xs={12}>
                    <Typography align="center" variant="h5" component="h2">
                        Games
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container xs={12} justify="center" alignItems="center">
                        <GameCard
                            title="Air hockey"
                            text="Play air hockey either online or locally"
                            image="assets/games/air-hockey/air-hockey.png"
                        />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
