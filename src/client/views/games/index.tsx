import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from './game-card';

export const Games: React.FunctionComponent = () => (
    <Grid container spacing={6}>
        <Grid item xs={12} />

        <Grid item xs={12}>
            <Typography align="center" variant="h2" component="h2">
                Games
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Grid container justify="center" alignItems="center">
                <Link style={{ textDecoration: 'none' }} to="/air-hockey">
                    <GameCard
                        title="Air hockey"
                        text="Play air hockey either online or locally"
                        image="assets/games/air-hockey/air-hockey.png"
                    />
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/asteroids">
                    <GameCard
                        title="Asteroids"
                        text="Classic asteroids game"
                        image="assets/games/asteroids/asteroids.png"
                    />
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/snake">
                    <GameCard
                        title="Snake"
                        text="Snake game"
                        image="assets/games/snake/snake.png"
                    />
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/unity-fps">
                    <GameCard
                        title="Unity Fps"
                        text="Fps game made with Unity WebGL"
                        image="assets/games/unity-fps/unity-fps.png"
                    />
                </Link>
            </Grid>
        </Grid>
    </Grid>
);
