import * as Phaser from 'phaser';

export const utils = {
    generateRandomInteger(min: number, max: number) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    centerText(text: Phaser.GameObjects.Text) {
        text.setX(text.x - text.width / 2);
    },
};
