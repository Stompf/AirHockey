import Phaser from 'phaser';

export function createPlayerKeyboard(scene: Phaser.Scene) {
    return {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        fire: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
}

export type PlayerKeyboard = ReturnType<typeof createPlayerKeyboard>;
