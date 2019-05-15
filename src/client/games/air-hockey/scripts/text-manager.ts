export class TextManager {
    private readonly infoText: Phaser.GameObjects.BitmapText;
    private readonly teamLeftScore: Phaser.GameObjects.BitmapText;
    private readonly teamRightScore: Phaser.GameObjects.BitmapText;

    private readonly scorePadding = 20;
    private readonly fontSize = 20;

    constructor(private scene: Phaser.Scene) {
        this.infoText = scene.add.bitmapText(
            scene.sys.canvas.width / 2,
            scene.sys.canvas.height / 2,
            'font',
            'Searching for game...',
            this.fontSize
        );
        this.infoText.setTintFill(0x000000);
        this.centerText(this.infoText);

        const startX = scene.sys.canvas.width / 2;

        this.teamLeftScore = scene.add.bitmapText(
            startX - this.scorePadding,
            10,
            'font',
            `0`,
            this.fontSize
        );
        this.teamLeftScore.setTintFill(0xff0000);
        this.teamLeftScore.setX(this.teamLeftScore.x - this.teamLeftScore.width);

        this.teamRightScore = scene.add.bitmapText(
            startX + this.scorePadding,
            10,
            'font',
            `0`,
            this.fontSize
        );
        this.teamRightScore.setTintFill(0x0000ff);

        this.setScoreTextVisible(false);
    }

    public setScoreTextVisible(visible: boolean) {
        this.teamLeftScore.setVisible(visible);
        this.teamRightScore.setVisible(visible);
    }

    public setScoreText(left: string, right: string) {
        this.teamLeftScore.setText(left);
        this.teamLeftScore.setX(this.scene.sys.canvas.width / 2 - this.scorePadding);
        this.teamLeftScore.setX(this.teamLeftScore.x - this.teamLeftScore.width);

        this.teamRightScore.setText(right);
    }

    public setInfoTextVisible(visible: boolean) {
        this.infoText.setVisible(visible);
    }

    public setInfoText(text: string | string[], fontSize: number = 20) {
        this.infoText.setText(text);
        this.infoText.setFontSize(fontSize);
        this.infoText.setX(this.scene.sys.canvas.width / 2);
        this.centerText(this.infoText);
    }

    private centerText(text: Phaser.GameObjects.BitmapText) {
        text.setX(text.x - text.width / 2);
    }
}
