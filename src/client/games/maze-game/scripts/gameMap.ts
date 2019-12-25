export class GameMap {
    constructor(private width: number, private height: number) {}

    public reset() {
        // tslint:disable-next-line: no-console
        console.log(this.width, this.height);
    }
}
