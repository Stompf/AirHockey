import { Shared } from 'src/shared';

export const snakeUtils = {
    playerSize: 10,
    getRandomStartDirection(): Shared.Direction {
        const rand = Math.random();
        if (rand <= 1 / 4) {
            return 'left';
        }
        if (rand <= 2 / 4) {
            return 'up';
        }
        if (rand <= 3 / 4) {
            return 'down';
        }
        return 'right';
    },
    getDirectionInRadians(direction: Shared.Direction): number {
        switch (direction) {
            case 'left':
                return 0;
            case 'up':
                return Math.PI / 2;
            case 'right':
                return Math.PI;
            default:
                return Math.PI + Math.PI / 2;
        }
    },
};

export const Colors = {
    blue: 0x0000ff,
    red: 0xff0000,
};
