import { Shared } from 'src/shared';

export class GameMap {
    private grid: Array<Array<string | undefined>>;
    private positions: Record<string, Shared.Vector2D>;

    constructor(private width: number, private height: number) {
        this.grid = [];
        this.positions = {};
    }

    public setPosition(id: string, position: Shared.Vector2D) {
        this.positions[id] = position;
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
        scene.add.image(x * size + size / 2, y * size + size / 2, `player-${id}`);

        return true;
    }
}
