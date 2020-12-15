import Phaser from 'phaser';
import { flags } from '../debug';
import {
    Asteroid,
    BasePowerUp,
    Bullet,
    createPhysicsCategories,
    PhysicsCategories,
    Player,
    PowerUpShield,
    PowerUpShootSpeed,
} from '../scripts';

export class AsteroidGameScene extends Phaser.Scene {
    private pointsText!: Phaser.GameObjects.Text;

    private livesText!: Phaser.GameObjects.Text;

    private readonly PLAYER_RESPAWN_TIME = 2000;

    private readonly asteroidSpawnDelay = 14000;

    private readonly powerUpShieldPercent = 1;

    private readonly maxPowerUpsOnScreen = 2;

    private currentLevel = 1;

    private player!: Player;

    private physicsCategories!: PhysicsCategories;

    private powerUps: BasePowerUp[] = [];

    private asteroidTimer!: Phaser.Time.TimerEvent;

    constructor() {
        super({
            key: 'AsteroidGameScene',
            active: true,
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

        PowerUpShield.createShieldTexture(this);

        this.handleCollisions();
    }

    protected create() {
        this.addBackground();
        this.addHUD();

        this.startNewGame();
    }

    private updatePhysics() {
        this.player.onUpdate(this.time.now);

        this.children.list.forEach((gameObject) => {
            if (gameObject.type === 'Image' && !(gameObject.getData('type') instanceof Bullet)) {
                this.warp(gameObject as Phaser.GameObjects.Image);
            }
        });

        this.powerUps.forEach((powerUp) => powerUp.onUpdate());
    }

    private handleCollisions() {
        this.matter.world.on(
            'collisionstart',
            (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
                event.pairs.forEach((pair) => {
                    const asteroid = AsteroidGameScene.getType<Asteroid>(pair, Asteroid);
                    const bullet = AsteroidGameScene.getType<Bullet>(pair, Bullet);
                    const player = AsteroidGameScene.getType<Player>(pair, Player);
                    const powerUp = AsteroidGameScene.getType<BasePowerUp>(pair, BasePowerUp);

                    if (asteroid && bullet) {
                        this.player.points += 10;

                        bullet.destroy();

                        if (
                            Math.random() <= this.powerUpShieldPercent &&
                            this.powerUps.length < this.maxPowerUpsOnScreen
                        ) {
                            this.spawnRandomPowerUp(asteroid.sprite.body.position);
                        }

                        asteroid.explode();
                        asteroid.destroy();
                    }

                    if (asteroid && player && player.allowCollision()) {
                        const remainingLives = player.kill();
                        if (remainingLives > 0) {
                            this.time.delayedCall(
                                this.PLAYER_RESPAWN_TIME,
                                this.respawnPlayer,
                                [],
                                this
                            );
                        } else {
                            this.asteroidTimer.paused = true;
                            this.sys.registry.set('points', this.player.points);
                            this.scene.launch('GameOverScene');
                        }
                    }

                    if (player && player.isAlive() && powerUp) {
                        const index = this.powerUps.indexOf(powerUp);
                        if (index >= 0) {
                            this.powerUps.splice(index, 1);
                        }

                        powerUp.activate(player);
                    }
                });
            }
        );
    }

    private spawnRandomPowerUp(position: WebKitPoint) {
        const randomRoll = Math.random();
        let powerUp: BasePowerUp;
        if (randomRoll >= 0.5) {
            powerUp = new PowerUpShield(this, position, { x: 0, y: 0 }, 1, this.physicsCategories);
        } else {
            powerUp = new PowerUpShootSpeed(
                this,
                position,
                { x: 0, y: 0 },
                1,
                this.physicsCategories
            );
        }
        this.powerUps.push(powerUp);
    }

    private respawnPlayer() {
        this.player.respawn();

        const shield = new PowerUpShield(
            this,
            { x: this.player.sprite.x, y: this.player.sprite.y },
            this.player.sprite.body.velocity,
            this.player.sprite.body.angularVelocity,
            this.physicsCategories
        );
        shield.activate(this.player);
    }

    private static getType<T extends any>(
        pair: Phaser.Types.Physics.Matter.MatterCollisionData,
        obj: any
    ): T | null {
        if (pair.bodyA.gameObject == null || pair.bodyB.gameObject == null) {
            return null;
        }

        const bodyA = pair.bodyA.gameObject.getData('type');
        const bodyB = pair.bodyB.gameObject.getData('type');

        if (bodyA instanceof obj) {
            return bodyA as T;
        }
        if (bodyB instanceof obj) {
            return bodyB as T;
        }
        return null;
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
        this.physicsCategories = createPhysicsCategories(this);
        this.player = new Player(this, this.physicsCategories);
        this.powerUps = [];

        if (this.asteroidTimer) {
            this.asteroidTimer.destroy();
        }

        this.asteroidTimer = this.time.addEvent({
            callback: this.asteroidTick,
            callbackScope: this,
            loop: true,
            delay: this.asteroidSpawnDelay,
            args: [],
        });

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
        pointsText.setDepth(10);
        pointsText.setOrigin(0, 0);

        const livesText = this.add.text(0, pointsText.height, 'Lives: ', {
            fill: '#FFFFFF',
            fontSize: 12,
        });
        livesText.setDepth(10);
        livesText.setOrigin(0, 0);

        this.pointsText = pointsText;
        this.livesText = livesText;
    }

    private updateHUD() {
        this.pointsText.setText(`Points: ${this.player.points}`);
        this.livesText.setText(`Lives: ${this.player.lives}`);
    }

    private addAsteroids() {
        if (!flags.SPAWN_ASTEROIDS) {
            return;
        }

        for (let i = 0; i < this.currentLevel; i += 1) {
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
        const asteroid = new Asteroid(
            this,
            position,
            velocity,
            va,
            0,
            index,
            this.physicsCategories
        );
        return asteroid;
    }

    private asteroidTick = () => {
        this.addAsteroids();
    };
}
