import { Shared, AirHockey } from 'src/shared';

export class ArenaRender {
    private sprites: Phaser.GameObjects.GameObject[];

    constructor(private scene: Phaser.Scene) {
        this.sprites = [];
    }

    public renderArena(gameSize: Shared.Size) {
        const middleLine = this.scene.add.line(
            0,
            0,
            gameSize.width / 2,
            0,
            gameSize.width / 2,
            gameSize.height * 2,
            0x000000,
            0.1
        );

        middleLine.setLineWidth(0.5);

        this.sprites.push(middleLine);
    }

    public renderGoals = (goalOption: AirHockey.IGoalOptions) => {
        this.drawPositionWithBox(goalOption.top, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.back, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.bottom, 0xd7d7d7);
        this.drawPositionWithBox(goalOption.goal, 0x000000);
    };

    public destroyAll() {
        this.sprites.forEach(g => g.destroy());
        this.sprites = [];
    }

    private drawPositionWithBox(pBox: AirHockey.IPositionWithBox, color: Shared.Color) {
        this.sprites.push(this.scene.add.rectangle(pBox.x, pBox.y, pBox.width, pBox.height, color));
    }
}
