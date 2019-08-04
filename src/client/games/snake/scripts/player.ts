import Phaser from 'phaser';
import { Direction, GameMap } from './gameMap';

export class Player {
    public static WIDTH = 10;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private sprite: Phaser.GameObjects.Image;
    private currentDirection: Direction;

    constructor(scene: Phaser.Scene, private playerId: string, color: number, gameMap: GameMap) {
        const textureName = this.createPlayerTexture(scene, playerId, color);
        this.cursors = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.sprite = scene.add.image(50, 50, textureName);
        this.currentDirection = 'right';

        gameMap.setPosition(playerId, { x: this.sprite.x, y: this.sprite.y });
    }

    public onUpdate(gameMap: GameMap) {
        if (this.cursors.up!.isDown && this.currentDirection !== 'down') {
            this.currentDirection = 'up';
        } else if (this.cursors.down!.isDown && this.currentDirection !== 'up') {
            this.currentDirection = 'down';
        } else if (this.cursors.left!.isDown && this.currentDirection !== 'right') {
            this.currentDirection = 'left';
        } else if (this.cursors.right!.isDown && this.currentDirection !== 'left') {
            this.currentDirection = 'right';
        }

        gameMap.setGrid(this.playerId, this.currentDirection);
    }

    private createPlayerTexture(scene: Phaser.Scene, playerId: string, color: number) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillRect(Player.WIDTH / 2, Player.WIDTH / 2, Player.WIDTH, Player.WIDTH);
        graphics.setVisible(false);
        const textureName = `player-${playerId}`;
        graphics.generateTexture(textureName, Player.WIDTH, Player.WIDTH);
        return textureName;
    }
}
