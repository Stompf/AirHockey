import { Grid, Typography } from '@material-ui/core';
import React from 'react';

export const AboutMe: React.FunctionComponent = () => (
    <Grid container spacing={6} justify="center">
        <Grid item xs={12} />

        <Grid item xs={12}>
            <Typography align="center" variant="h2" component="h2">
                About Me
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography align="center" variant="body1">
                I&apos;m a full-stack developer from Lund, Sweden. I enjoy taking complex problems
                and turning them into something that makes sense. I also love the logic and
                structure of coding and always strive to write elegant and efficient code, whether
                it be C#, TypeScript or other (preferably) typed languages.
            </Typography>
        </Grid>
    </Grid>
);
