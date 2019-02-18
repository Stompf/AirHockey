export class MenuScene extends Phaser.Scene {
    private startKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: 'MenuScene',
        });
    }

    public preload(): void {
        this.load.bitmapFont(
            'font',
            'assets/fonts/font.png',
            'assets/fonts/font.fnt'
            // './src/games/snake/assets/font/snakeFont.fnt'
        );
    }

    public init(): void {
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.startKey.isDown = false;
        this.initGlobalDataManager();
    }

    public create(): void {
        const startText = this.add.bitmapText(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            'font',
            'Press ENTER to start',
            18
        );

        startText.setX(startText.x - startText.width / 2);
    }

    public update(): void {
        if (this.startKey.isDown) {
            this.scene.start('GameScene');
        }
    }

    private initGlobalDataManager(): void {
        this.registry.set('time', 400);
        this.registry.set('level', 'level1');
        this.registry.set('world', '1-1');
        this.registry.set('worldTime', 'WORLD TIME');
        this.registry.set('score', 0);
        this.registry.set('coins', 0);
        this.registry.set('lives', 2);
        this.registry.set('spawn', { x: 12, y: 44, dir: 'down' });
        this.registry.set('marioSize', 'small');
    }
}
