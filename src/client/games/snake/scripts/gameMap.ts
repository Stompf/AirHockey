import { Shared, utils } from 'src/shared';

export class GameMap {
    private grid: Array<Array<string | undefined>> = [];
    private positions: Record<string, Shared.Vector2D> = {};
    private sprites: Phaser.GameObjects.GameObject[] = [];

    constructor(private width: number, private height: number) {}

    public reset() {
        this.grid = [];
        this.positions = {};
        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = [];
    }

    public setPosition(id: string, position: Shared.Vector2D, size: number, scene: Phaser.Scene) {
        this.positions[id] = position;
        const sprite = scene.add.image(
            position.x * size + size / 2,
            position.y * size + size / 2,
            `player-${id}`
        );
        this.sprites.push(sprite);
    }

    public getRandomStartPosition(playerSize: number): Shared.Vector2D {
        const positions = Object.values(this.positions);
        while (true) {
            const margin = 10;
            const randX = utils.generateRandomInteger(margin, this.width - playerSize - margin);
            const randY = utils.generateRandomInteger(margin, this.height - playerSize - margin);

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

    public getRandomStartDirection(): Shared.Direction {
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
    }

    public getDirectionInRadians(direction: Shared.Direction): number {
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
    }

    public setGrid(id: string, direction: Shared.Direction, scene: Phaser.Scene, size: number) {
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
            y < 0 ||
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
        const sprite = scene.add.image(x * size + size / 2, y * size + size / 2, `player-${id}`);
        this.sprites.push(sprite);

        return true;
    }
}
