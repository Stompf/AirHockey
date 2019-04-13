export type TeamSide = 'left' | 'right';

export class Team {
    private score: number = 0;
    private color: number;

    get TeamSide() {
        return this.teamSide;
    }

    get Color() {
        return this.color;
    }

    get Score() {
        return this.score;
    }

    constructor(private teamSide: TeamSide) {
        this.resetScore();
        this.color = this.teamSide === 'left' ? 0xff0000 : 0x0000ff;
    }

    public resetScore() {
        this.score = 0;
    }

    public addScore() {
        this.score++;
    }
}
