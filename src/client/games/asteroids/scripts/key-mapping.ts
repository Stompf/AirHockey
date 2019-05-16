import Phaser from 'phaser';

export type IMapping = typeof PlayerMapping;

export const PlayerMapping = {
    up: Phaser.Input.Keyboard.KeyCodes.UP,
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
};
