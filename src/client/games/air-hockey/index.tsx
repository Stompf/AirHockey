import * as React from 'react';
import { Button, Grid, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { AirHockeyGame } from './scripts';

const styles = createStyles({
    button: {
        width: 300,
    },
});

type IAirHockeyProps = WithStyles<typeof styles>;

export class AirHockeyComponent extends React.Component<IAirHockeyProps, {}> {
    private game: AirHockeyGame | undefined;

    public componentDidMount() {
        // this.game = new AirHockeyGame('AirHockeyCanvas');
    }

    public componentWillUnmount() {
        if (this.game) {
            this.game.destroy(true);
        }
    }

    public render() {
        const { classes } = this.props;

        return (
            <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <h1>Air Hockey</h1>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button}>
                        Local play
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.button}>
                        Online play
                    </Button>
                </Grid>
            </Grid>
        );

        //  return <div id="AirHockeyCanvas" />;
    }
}

export const AirHockey = withStyles(styles)(AirHockeyComponent);
