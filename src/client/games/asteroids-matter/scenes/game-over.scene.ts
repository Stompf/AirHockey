import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverScene',
        });
    }

    protected preload() {
        this.generateTextures();
    }

    protected create() {
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'gameOverBg');

        const gameOverText = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height - this.sys.canvas.height / 1.25 - 34,
            'Game Over',
            {
                fill: '#000000',
                fontSize: 34,
            },
        );
        gameOverText.setDepth(10);
        GameOverScene.centerText(gameOverText);

        const scoreText = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            `Score: ${this.sys.registry.get('points')}`,
            {
                fill: '#000000',
                fontSize: 34,
            },
        );
        scoreText.setDepth(10);
        GameOverScene.centerText(scoreText);

        const clickToResetText = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 1.25,
            'Click to play again',
            {
                fill: '#000000',
                fontSize: 34,
            },
        );
        clickToResetText.setDepth(10);
        GameOverScene.centerText(clickToResetText);

        this.input.once(
            'pointerup',
            () => {
                this.scene.start('AsteroidGameScene');
            },
            this,
        );
    }

    private generateTextures() {
        const width = this.sys.canvas.width / 1.5;
        const height = this.sys.canvas.height / 1.25;

        const graphics = this.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0xcccccc);
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture('gameOverBg', width, height);
    }

    private static centerText(text: Phaser.GameObjects.Text) {
        text.setX(text.x - text.width / 2);
    }
}
