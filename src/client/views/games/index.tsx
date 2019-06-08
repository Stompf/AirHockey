import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from './game-card';

export class Games extends React.Component {
    public render() {
        return (
            <Grid container spacing={6}>
                <Grid item xs={12} />

                <Grid item xs={12}>
                    <Typography align="center" variant="h2" component="h2">
                        Games
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center" alignItems="center">
                        <Link to="/air-hockey">
                            <GameCard
                                title="Air hockey"
                                text="Play air hockey either online or locally"
                                image="assets/games/air-hockey/air-hockey.png"
                            />
                        </Link>

                        <Link to="/asteroids">
                            <GameCard
                                title="Asteroids"
                                text="Classic asteroids game"
                                image="assets/games/asteroids/asteroids.png"
                            />
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
