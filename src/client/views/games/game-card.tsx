import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import React from 'react';

const styles = createStyles({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

type IGameCardProps = WithStyles<typeof styles> & {
    image: string;
    title: string;
    text: string;
};

class GameCardComponent extends React.Component<IGameCardProps> {
    public render() {
        const { classes, image, title, text } = this.props;
        return (
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia className={classes.media} image={image} title={title} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {title}
                        </Typography>
                        <Typography component="p">{text}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

export const GameCard = withStyles(styles)(GameCardComponent);
