import Phaser from 'phaser';
import { Shared } from 'src/shared';
import { GameMap } from './gameMap';
import { snakeUtils } from './utils';

export class Player {
    public score: number = 0;
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private currentDirection: Shared.Direction;
    private startArrow: Phaser.GameObjects.Image;
    private alive: boolean = true;

    constructor(
        scene: Phaser.Scene,
        private playerId: string,
        color: number,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys
    ) {
        this.createPlayerTexture(scene, playerId, color);
        this.cursors = cursors;
        this.currentDirection = 'left';
        this.startArrow = scene.add.image(0, 0, 'arrow');
        this.startArrow.setVisible(false);
        this.startArrow.setDisplaySize(20, 20);
    }

    public get IsAlive() {
        return this.alive;
    }

    public get DisplayName() {
        return this.playerId;
    }

    public reset() {
        this.alive = true;
    }

    public showStartArrow = (show: boolean) => {
        this.startArrow.setVisible(show);
    };

    public setPosition(
        startPosition: Shared.Vector2D,
        direction: Shared.Direction,
        gameMap: GameMap,
        scene: Phaser.Scene
    ) {
        this.currentDirection = direction;
        gameMap.setPosition(this.playerId, startPosition, scene);
        this.updateStartArrow(gameMap);
    }

    public onUpdate(gameMap: GameMap, scene: Phaser.Scene, paused: boolean) {
        if (!this.alive) {
            return;
        }

        if (this.cursors.up!.isDown && (paused || this.currentDirection !== 'down')) {
            this.currentDirection = 'up';
        } else if (this.cursors.down!.isDown && (paused || this.currentDirection !== 'up')) {
            this.currentDirection = 'down';
        } else if (this.cursors.left!.isDown && (paused || this.currentDirection !== 'right')) {
            this.currentDirection = 'left';
        } else if (this.cursors.right!.isDown && (paused || this.currentDirection !== 'left')) {
            this.currentDirection = 'right';
        }

        if (paused) {
            this.updateStartArrow(gameMap);
        } else {
            if (!gameMap.setGrid(this.playerId, this.currentDirection, scene)) {
                this.alive = false;
            }
        }
    }

    private updateStartArrow(gameMap: GameMap) {
        const playerPosition = gameMap.getPlayerPosition(this.playerId);
        this.startArrow.setPosition(
            playerPosition.x + snakeUtils.playerSize / 2,
            playerPosition.y + snakeUtils.playerSize / 2
        );
        this.startArrow.setRotation(snakeUtils.getDirectionInRadians(this.currentDirection));
        const offset = snakeUtils.playerSize * 1.25;

        switch (this.currentDirection) {
            case 'down':
                this.startArrow.setY(playerPosition.y + offset + snakeUtils.playerSize);
                break;
            case 'up':
                this.startArrow.setY(playerPosition.y - offset);
                break;
            case 'right':
                this.startArrow.setX(playerPosition.x + offset + snakeUtils.playerSize);
                break;
            case 'left':
                this.startArrow.setX(playerPosition.x - offset);
                break;
        }
    }

    private createPlayerTexture(scene: Phaser.Scene, playerId: string, color: number) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(color);
        graphics.fillRect(
            snakeUtils.playerSize / 2,
            snakeUtils.playerSize / 2,
            snakeUtils.playerSize,
            snakeUtils.playerSize
        );
        graphics.setVisible(false);
        const textureName = `player-${playerId}`;
        graphics.generateTexture(textureName, snakeUtils.playerSize * 2, snakeUtils.playerSize * 2);
        return textureName;
    }
}
