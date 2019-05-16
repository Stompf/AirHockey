import Phaser from 'phaser';
import { Asteroid } from './asteroid';
import { Bullet } from './bullet';
import { createPlayerKeyboard, PlayerKeyboard } from './key-mapping';
import { Player } from './player';
import { BasePowerUp, PowerUpShield, PowerUpShootSpeed } from './power-ups';
import { createGroups, Groups } from './utils';

export class AsteroidGameScene extends Phaser.Scene {
    public readonly powerUpShieldPercent = 1;
    public readonly maxPowerUpsOnScreen = 2;
    public readonly MAX_PLAYER_VELOCITY = 40;
    public readonly MAX_PHYSICS_VELOCITY = 20;
    public readonly PLAYER_RESPAWN_TIME = 1000;

    private player!: Player;
    private INVULNERABLE = false;
    private SPAWN_ASTEROIDS = true;

    private currentLevel = 1;
    private powerUps: BasePowerUp[] = [];
    private readonly asteroidSpawnDelay = 14000;
    private asteroidSpawnTimer!: Phaser.Time.TimerEvent;
    private pointsText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;

    private gameOverGroup!: Phaser.GameObjects.Group;

    private playerKeyboard!: PlayerKeyboard;
    private gameGroups!: Groups;

    constructor() {
        super({
            key: 'AsteroidGameScene',
        });
    }

    public update() {
        this.updatePhysics();
        this.updateHUD();
    }

    // private listenToEvents() {
    //     eventEmitter.on(
    //         Events.AsteroidDestroyed,
    //         (asteroidBody: Phaser.Physics.P2.Body, bulletBody: Phaser.Physics.P2.Body) => {
    //             // Check if bullet or ship is already destroyed
    //             if (bulletBody.sprite == null || asteroidBody.sprite == null) {
    //                 return;
    //             }

    //             this.player.points += 10;

    //             // Remove bullet
    //             this.game.physics.p2.removeBodyNextStep(bulletBody);
    //             bulletBody.sprite.destroy();

    //             (asteroidBody.sprite.data as Asteroid).explode();

    //             if (
    //                 Math.random() <= this.powerUpShieldPercent &&
    //                 this.powerUps.length < this.maxPowerUpsOnScreen
    //             ) {
    //                 this.spawnRandomPowerUp(asteroidBody.sprite.position);
    //             }
    //             this.game.physics.p2.removeBodyNextStep(asteroidBody);
    //             asteroidBody.sprite.destroy();
    //         }
    //     );

    //     eventEmitter.on(Events.PowerUpActivated, (powerUp: BasePowerUp) => {
    //         const index = this.powerUps.indexOf(powerUp);
    //         if (index >= 0) {
    //             this.powerUps.splice(index, 1);
    //         }
    //     });

    //     eventEmitter.on(Events.AsteroidPlayerHit, () => {
    //         if (!this.player.sprite.visible || !this.player.allowCollision) {
    //             return;
    //         }

    //         this.player.lives--;
    //         this.player.sprite.visible = false;
    //         if (this.player.lives > 0) {
    //             const timer = this.game.time.create();
    //             timer.add(
    //                 this.PLAYER_RESPAWN_TIME,
    //                 () => {
    //                     this.respawnPlayer();
    //                 },
    //                 this
    //             );
    //             timer.start();
    //         } else {
    //             this.showGameOver();
    //         }
    //     });
    // }

    public showGameOver() {
        this.asteroidSpawnTimer.paused = true;

        const background = this.add.graphics();
        background.fillStyle(0x000000);
        background.fillRect(0, 0, this.sys.canvas.width / 2, this.sys.canvas.height / 2);
        background.generateTexture('gameOverBackground');

        const backgroundSprite = this.gameOverGroup.create(0, 0, 'gameOverBackground');

        // group.position.set(this.sys.canvas.width / 2, this.sys.canvas.height / 2);

        const gameOverText = this.add.text(0, -backgroundSprite.height / 2, 'GAME OVER', {
            fill: '#FFFFFF',
            fontSize: 30,
        });
        gameOverText.originY = 0;
        this.gameOverGroup.add(gameOverText);

        const scoreText = this.add.text(0, 0, 'Final score: ' + this.player.points, {
            fill: '#FFFFFF',
            fontSize: 20,
        });
        this.gameOverGroup.add(scoreText);

        // const buttonGraphics = this.add.graphics();
        // buttonGraphics.lineStyle(5, 0xffffff);
        // buttonGraphics.strokeRect(0, 0, 125, 40);

        const playAgainText = this.add.text(0, 10, 'Click to play again', {
            fill: '#FFFFFF',
            fontSize: 20,
        });
        playAgainText.setInteractive();
        playAgainText.input.cursor = 'pointer';
        // playAgainText.once.onInputDown.add(this.removeAllObjects, this);
        this.gameOverGroup.add(playAgainText);

        this.input.once('pointerdown', this.removeAllObjects, this);

        // this.game.world.bringToTop(group);
    }

    public spawnRandomPowerUp(position: WebKitPoint) {
        const randomRoll = Math.random();
        let powerUp: BasePowerUp;
        if (randomRoll >= 0.5) {
            powerUp = new PowerUpShield(
                this,
                position,
                { x: 0, y: 0 },
                1,
                this.gameGroups.powerUps
            );
        } else {
            powerUp = new PowerUpShootSpeed(
                this,
                position,
                { x: 0, y: 0 },
                1,
                this.gameGroups.powerUps
            );
        }
        this.powerUps.push(powerUp);
    }

    public respawnPlayer() {
        // Add ship again
        // this.player.sprite.body.force[0] = 0;
        // this.player.sprite.body.force[1] = 0;
        this.player.sprite.body.velocity[0] = 0;
        this.player.sprite.body.velocity[1] = 0;
        this.player.sprite.body.angularVelocity = 0;
        this.player.sprite.body.angle = 0;
        this.player.sprite.visible = true;

        // Spawn with shield
        const shield = new PowerUpShield(
            this,
            { x: this.player.sprite.body.x, y: this.player.sprite.body.y },
            this.player.sprite.body.velocity,
            this.player.sprite.body.angularVelocity,
            this.gameGroups.powerUps
        );
        shield.activate(this.player);
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

        this.playerKeyboard = createPlayerKeyboard(this);
        this.gameGroups = createGroups(this);
        this.gameOverGroup = this.add.group();
    }

    protected create() {
        this.addBackground();
        this.addHUD();
        // this.listenToEvents();
        this.createTimers();

        this.startNewGame();
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

    private createTimers = () => {
        this.asteroidSpawnTimer = this.time.addEvent({
            loop: true,
            callback: this.asteroidTick,
            delay: this.asteroidSpawnDelay,
            callbackScope: this,
            paused: true,
        });
    };

    private startNewGame() {
        this.gameOverGroup.clear();

        this.player = new Player(this, this.gameGroups.player);
        this.addAsteroids();

        this.asteroidSpawnTimer.paused = false;
    }

    private removeAllObjects() {
        this.removeAllObjects();
        this.create();
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

    private updatePhysics() {
        this.player.allowCollision =
            this.player.sprite.visible && !this.INVULNERABLE && !this.player.hasShield;

        // Thrust: add some force in the ship direction
        // this.player.sprite.body.applyImpulseLocal([0, this.keyUp / 2], 0, 0);
        if (this.playerKeyboard.up.isDown) {
            this.physics.velocityFromRotation(
                this.player.sprite.rotation - 1.570796,
                200,
                this.player.sprite.body.acceleration
            );
        } else {
            this.player.sprite.body.setAcceleration(0, 0);
        }

        if (this.playerKeyboard.left.isDown) {
            this.player.sprite.body.setAngularVelocity(-300);
        } else if (this.playerKeyboard.right.isDown) {
            this.player.sprite.body.setAngularVelocity(300);
        } else {
            this.player.sprite.body.setAngularVelocity(0);
        }

        // // Set turn velocity of ship
        // this.player.sprite.body.angularVelocity =
        //     (this.playerKeyboard - this.keyLeft) * this.player.turnSpeed;

        if (
            this.playerKeyboard.fire.isDown &&
            this.player.sprite.visible &&
            this.time.now - this.player.lastShootTime > this.player.reloadTime
        ) {
            this.shoot();
        }

        // Warp all bodies
        // this.game.world.children.forEach(child => {
        //     const sprite = child as P2Sprite;
        //     if (sprite.body != null && !(sprite.data instanceof Bullet)) {
        //         Utils.constrainVelocity(
        //             sprite,
        //             sprite === this.player.sprite
        //                 ? this.MAX_PLAYER_VELOCITY
        //                 : this.MAX_PHYSICS_VELOCITY
        //         );
        //         this.warp(sprite);
        //     }
        // });
    }

    private shoot() {
        const angle = this.player.sprite.rotation - Math.PI / 2;

        const bullet = new Bullet(
            this,
            angle,
            { x: this.player.sprite.body.x, y: this.player.sprite.body.y },
            this.player.sprite.body.velocity,
            this.gameGroups.bullets
        );

        // Keep track of the last time we shot
        // this.player.lastShootTime = this.game.physics.p2.world.time;

        return bullet;
    }

    // private warp(sprite: P2Sprite) {
    //     const p = { x: sprite.x, y: sprite.y };
    //     if (p.x > this.game.width) {
    //         p.x = 0;
    //     }
    //     if (p.y > this.game.height) {
    //         p.y = 0;
    //     }
    //     if (p.x < 0) {
    //         p.x = this.game.width;
    //     }
    //     if (p.y < 0) {
    //         p.y = this.game.height;
    //     }

    //     // Set the previous position too, to not mess up the p2 body interpolation
    //     sprite.body.x = p.x;
    //     sprite.body.y = p.y;
    // }

    // Adds some asteroids to the scene.
    private addAsteroids() {
        if (!this.SPAWN_ASTEROIDS) {
            return;
        }

        for (let i = 0; i < this.currentLevel; i++) {
            const x = Math.random() * this.sys.canvas.width;
            let y = Math.random() * this.sys.canvas.height;
            const vx = (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed;
            const vy = (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed;
            const va = (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed;

            // Avoid the ship!
            if (Math.abs(x - this.player.sprite.body.x) < Asteroid.InitSpace) {
                if (y - this.player.sprite.body.y > 0) {
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
            this.gameGroups.asteroids
        );
        return asteroid;
    }

    private asteroidTick = () => {
        this.addAsteroids();
    };
}
