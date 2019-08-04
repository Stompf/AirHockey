export type Direction = 'left' | 'right' | 'up' | 'down';
export interface Position {
    x: number;
    y: number;
}

export class GameMap {
    private grid: Array<Array<string | undefined>>;
    private positions: Record<string, Position>;

    constructor(private width: number, private height: number) {
        this.grid = [];
        this.positions = {};
    }

    public setPosition(id: string, position: Position) {
        this.positions[id] = position;
    }

    public setGrid(id: string, direction: Direction) {
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

        if (x < 0 || x > this.width || y < 0 || y > this.height || this.grid[x][y]) {
            return false;
        }

        this.grid[x][y] = id;
        this.positions[id] = { x, y };

        return true;
    }
}
