import { AppBar, Button, Toolbar, Typography, withStyles, WithStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import React from 'react';

const styles = createStyles({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    img: {
        display: 'flex',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
    },
});

type IStartProps = WithStyles<typeof styles>;

class MainAppBarComponent extends React.Component<IStartProps> {
    public render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <img
                                src="favicon.ico"
                                className={classes.img}
                                onClick={this.onIconClick}
                            />
                        </Typography>
                        <Button color="inherit">Games</Button>
                        <Button color="inherit">About Me</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    private onIconClick = () => {
        window.location.replace(window.location.origin);
    };
}

export const MainAppBar = withStyles(styles)(MainAppBarComponent);
