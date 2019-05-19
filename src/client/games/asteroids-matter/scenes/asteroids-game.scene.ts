import Phaser from 'phaser';
import { flags } from '../debug';
import { Asteroid, Bullet, Player } from '../scripts';

export class AsteroidGameScene extends Phaser.Scene {
    private pointsText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;

    private currentLevel = 1;
    private player!: Player;

    constructor() {
        super({
            key: 'AsteroidGameScene',
        });
    }

    public update() {
        this.updatePhysics();
        this.updateHUD();
    }

    protected preload() {
        this.load.image('player', '/assets/games/asteroids/PNG/playerShip1_blue.png');
        this.load.image('ufo', '/assets/games/asteroids/PNG/ufoRed.png');
        this.load.image(
            'powerUp_shootSpeed',
            '/assets/games/asteroids/PNG/Power-ups/powerUpBlue_bolt.png'
        );
        this.load.image(
            'powerUp_shield',
            '/assets/games/asteroids/PNG/Power-ups/powerUpBlue_shield.png'
        );
        this.load.image('background', '/assets/games/asteroids/Backgrounds/space.jpg');
        Bullet.createBulletTexture(this);

        // this.gameGroups = createGroups(this);
        // this.gameOverGroup = this.add.group();
    }

    protected create() {
        this.addBackground();
        this.addHUD();
        // // this.listenToEvents();
        // this.createTimers();

        this.startNewGame();
    }

    private updatePhysics() {
        this.player.onUpdate(this.time.now);

        this.children.list.forEach(gameObject => {
            if (gameObject.type === 'Image') {
                this.warp(gameObject as Phaser.GameObjects.Image);
            }
        });
    }

    private warp(sprite: Phaser.GameObjects.Image) {
        const p = { x: sprite.x, y: sprite.y };
        if (p.x > this.sys.canvas.width) {
            p.x = 0;
        }
        if (p.y > this.sys.canvas.height) {
            p.y = 0;
        }
        if (p.x < 0) {
            p.x = this.sys.canvas.width;
        }
        if (p.y < 0) {
            p.y = this.sys.canvas.height;
        }

        sprite.setPosition(p.x, p.y);
    }

    private startNewGame() {
        this.player = new Player(this);

        this.addAsteroids();
    }

    private addBackground() {
        const background = this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'background'
        );
        background.setOrigin(0, 0);
    }

    private addHUD() {
        const pointsText = this.add.text(0, 0, 'Points: ', {
            fill: '#FFFFFF',
            fontSize: 12,
        });
        pointsText.setOrigin(0, 0);

        const livesText = this.add.text(0, pointsText.height, 'Lives: ', {
            fill: '#FFFFFF',
            fontSize: 12,
        });
        livesText.setOrigin(0, 0);

        this.pointsText = pointsText;
        this.livesText = livesText;
    }

    private updateHUD() {
        this.pointsText.setText('Points: ' + this.player.points);
        this.livesText.setText('Lives: ' + this.player.lives);
    }

    private addAsteroids() {
        if (!flags.SPAWN_ASTEROIDS) {
            return;
        }

        for (let i = 0; i < this.currentLevel; i++) {
            const x = Math.random() * this.sys.canvas.width;
            let y = Math.random() * this.sys.canvas.height;
            const vx = (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed;
            const vy = (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed;
            const va = (Math.random() - 0.5) / 30;

            // Avoid the ship!
            if (Math.abs(x - this.player.sprite.x) < Asteroid.InitSpace) {
                if (y - this.player.sprite.y > 0) {
                    y += Asteroid.InitSpace;
                } else {
                    y -= Asteroid.InitSpace;
                }
            }

            this.createAstroid({ x, y }, { x: vx, y: vy }, va, i);
        }
    }

    private createAstroid(position: WebKitPoint, velocity: WebKitPoint, va: number, index: number) {
        const asteroid = new Asteroid(this, position, velocity, va, 0, index);
        return asteroid;
    }
}
