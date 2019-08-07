import Phaser from 'phaser';
import { Shared } from 'src/shared';
import { GameMap } from './gameMap';

export class Player {
    public static SIZE = 10;
    public score: number = 0;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentDirection: Shared.Direction;

    constructor(
        scene: Phaser.Scene,
        private playerId: string,
        color: number,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys
    ) {
        this.createPlayerTexture(scene, playerId, color);
        this.cursors = cursors;
        this.currentDirection = 'left';
    }

    public setPosition(
        startPosition: Shared.Vector2D,
        direction: Shared.Direction,
        gameMap: GameMap,
        scene: Phaser.Scene
    ) {
        this.currentDirection = direction;
        gameMap.setPosition(this.playerId, startPosition, Player.SIZE, scene);
    }

    public onUpdate(gameMap: GameMap, scene: Phaser.Scene) {
        if (this.cursors.up!.isDown && this.currentDirection !== 'down') {
            this.currentDirection = 'up';
        } else if (this.cursors.down!.isDown && this.currentDirection !== 'up') {
            this.currentDirection = 'down';
        } else if (this.cursors.left!.isDown && this.currentDirection !== 'right') {
            this.currentDirection = 'left';
        } else if (this.cursors.right!.isDown && this.currentDirection !== 'left') {
            this.currentDirection = 'right';
        }

        gameMap.setGrid(this.playerId, this.currentDirection, scene, Player.SIZE);
    }

    private createPlayerTexture(scene: Phaser.Scene, playerId: string, color: number) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillRect(Player.SIZE / 2, Player.SIZE / 2, Player.SIZE, Player.SIZE);
        graphics.setVisible(false);
        const textureName = `player-${playerId}`;
        graphics.generateTexture(textureName, Player.SIZE * 2, Player.SIZE * 2);
        return textureName;
    }
}
