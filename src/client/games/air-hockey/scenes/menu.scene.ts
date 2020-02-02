import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    private startKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: 'MenuScene',
        });
    }

    public preload(): void {
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    }

    public init(): void {
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.startKey.isDown = false;
    }

    public create(): void {
        const startText = this.add.bitmapText(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            'font',
            'Press ENTER to search for match',
            18,
        );

        startText.setX(startText.x - startText.width / 2);
    }

    public update(): void {
        if (this.startKey.isDown) {
            this.scene.start('MultiplayerScene');
        }
    }
}
