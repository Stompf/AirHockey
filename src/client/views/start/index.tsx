import { AppBar, Button, Toolbar, Typography, withStyles, WithStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles';
import React from 'react';

const styles: StyleRules = {
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
};

type IStartProps = WithStyles;

class Start extends React.Component<IStartProps> {
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
                        <Button className={classes.menuButton} color="inherit">
                            About Me
                        </Button>
                        <Button className={classes.menuButton} color="inherit">
                            Games
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    private onIconClick = () => {
        window.location.replace(window.location.origin);
    };
}

export default withStyles(styles)(Start);
