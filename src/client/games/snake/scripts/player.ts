import Phaser from 'phaser';
import { Shared } from 'src/shared';
import { commonUtils } from '../../common';
import { SNAKE_CONSTS } from './constants';
import { GameMap } from './gameMap';

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
            playerPosition.x + SNAKE_CONSTS.playerSize / 2,
            playerPosition.y + SNAKE_CONSTS.playerSize / 2
        );
        this.startArrow.setRotation(commonUtils.getDirectionInRadians(this.currentDirection));
        const offset = SNAKE_CONSTS.playerSize * 1.25;

        switch (this.currentDirection) {
            case 'down':
                this.startArrow.setY(playerPosition.y + offset + SNAKE_CONSTS.playerSize);
                break;
            case 'up':
                this.startArrow.setY(playerPosition.y - offset);
                break;
            case 'right':
                this.startArrow.setX(playerPosition.x + offset + SNAKE_CONSTS.playerSize);
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
            SNAKE_CONSTS.playerSize / 2,
            SNAKE_CONSTS.playerSize / 2,
            SNAKE_CONSTS.playerSize,
            SNAKE_CONSTS.playerSize
        );
        graphics.setVisible(false);
        const textureName = `player-${playerId}`;
        graphics.generateTexture(
            textureName,
            SNAKE_CONSTS.playerSize * 2,
            SNAKE_CONSTS.playerSize * 2
        );
        return textureName;
    }
}
