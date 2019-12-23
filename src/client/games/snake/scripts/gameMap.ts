import { Shared, utils } from 'src/shared';
import { snakeUtils } from './utils';

export class GameMap {
    private grid: Array<Array<string | undefined>> = [];
    private positions: Record<string, Shared.Vector2D> = {};
    private sprites: Phaser.GameObjects.GameObject[] = [];

    constructor(private width: number, private height: number, private readonly offsetY: number) {}

    public reset() {
        this.grid = [];
        this.positions = {};
        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = [];
    }

    public getPlayerPosition(id: string) {
        const { x, y } = this.positions[id];
        return {
            x: x * snakeUtils.playerSize,
            y: y * snakeUtils.playerSize + this.offsetY,
        };
    }

    public setPosition(id: string, position: Shared.Vector2D, scene: Phaser.Scene) {
        this.positions[id] = position;
        const sprite = scene.add.image(
            position.x * snakeUtils.playerSize + snakeUtils.playerSize / 2,
            position.y * snakeUtils.playerSize + snakeUtils.playerSize / 2 + this.offsetY,
            `player-${id}`
        );
        this.sprites.push(sprite);
    }

    public getRandomStartPosition(): Shared.Vector2D {
        const positions = Object.values(this.positions);
        while (true) {
            const margin = 10;
            const randX = utils.generateRandomInteger(
                margin,
                this.width - snakeUtils.playerSize - margin
            );
            const randY = utils.generateRandomInteger(
                margin + this.offsetY,
                this.height - snakeUtils.playerSize - margin
            );

            if (
                !positions.some(
                    position =>
                        Math.abs(position.x - randX) <= margin * 2 &&
                        Math.abs(position.y - randY) <= margin * 2
                )
            ) {
                return {
                    x: randX,
                    y: randY,
                };
            }
        }
    }

    public setGrid(id: string, direction: Shared.Direction, scene: Phaser.Scene) {
        let { x, y } = this.positions[id];
        switch (direction) {
            case 'down':
                y += 1;
                break;
            case 'left':
                x -= 1;
                break;
            case 'up':
                y -= 1;
                break;
            case 'right':
                x += 1;
                break;
        }

        if (
            x < 0 ||
            x >= this.width ||
            y < this.offsetY ||
            y >= this.height ||
            (this.grid[x] && this.grid[x][y])
        ) {
            return false;
        }
        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = id;
        this.positions[id] = { x, y };
        const sprite = scene.add.image(
            x * snakeUtils.playerSize + snakeUtils.playerSize / 2,
            y * snakeUtils.playerSize + snakeUtils.playerSize / 2 + this.offsetY,
            `player-${id}`
        );
        this.sprites.push(sprite);

        return true;
    }
}
