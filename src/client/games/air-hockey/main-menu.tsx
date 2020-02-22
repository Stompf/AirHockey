import * as React from 'react';
import { Button, Grid, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = createStyles({
    button: {
        width: 300,
    },
});

type IAirHockeyMainMenuProps = WithStyles<typeof styles>;

const AirHockeyMainMenuComponent = ({ classes }: IAirHockeyMainMenuProps) => (
    <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
        <Grid item xs={12}>
            <h1>Air Hockey</h1>
        </Grid>
        <Grid item xs={12}>
            <Link to="/air-hockey/local">
                <Button variant="contained" color="primary" className={classes.button}>
                    Local play
                </Button>
            </Link>
        </Grid>
        <Grid item xs={12}>
            <Link to="/air-hockey/online">
                <Button variant="contained" color="primary" className={classes.button}>
                    Online play
                </Button>
            </Link>
        </Grid>
    </Grid>
);

export const AirHockeyMainMenu = withStyles(styles)(AirHockeyMainMenuComponent);
