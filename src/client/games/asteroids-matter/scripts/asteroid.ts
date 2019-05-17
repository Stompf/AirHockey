import Phaser from 'phaser';
import { IMatterSprite } from '../../common';

export class Asteroid {
    public static MaxAsteroidSpeed = 2;
    public static NumAsteroidLevels = 4;
    public static NumAsteroidVerticals = 10;
    public static AsteroidRadius = 50;
    public static InitSpace = Asteroid.AsteroidRadius * 2;
    public static MaxLevel = 3;
    public static Splits = 4;

    public level: number;
    public sprite: IMatterSprite;

    private fillColor = 0xbfbfbf;
    private strokeColor = 0x6d6d6d;
    private strokeWidth = 4;

    constructor(
        private scene: Phaser.Scene,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        level: number,
        index: number
    ) {
        this.level = level;

        const verticals = this.addAsteroidVerticals();

        const graphics = scene.add.graphics();
        this.createBodyGraphics(graphics, verticals);
        const textureName = `Asteroid-${index}-${level}`;
        graphics.generateTexture(textureName, 100, 100);

        // const sprite = scene.add.sprite(position.x, position.y, textureName) as IArcadeSprite;
        // sprite.body..addPolygon({}, verticals);
        const sprite = scene.matter.add.image(position.x, position.y, textureName) as IMatterSprite;

        // sprite.body.setCollisionGroup(MASKS.ASTEROID);
        // sprite.body.collides([
        //     game.physics.p2.everythingCollisionGroup,
        //     MASKS.ASTEROID,
        //     MASKS.BULLET,
        //     MASKS.PLAYER,
        //     MASKS.POWER_UP,
        // ]);

        sprite.setOrigin(0, 0);
        sprite.setMass(10 / (level + 1));
        sprite.setFrictionAir(0);
        sprite.setVelocity(velocity.x, velocity.y);
        sprite.setAngularVelocity(angularVelocity);
        // sprite.body.damping = 0;
        // sprite.body.angularDamping = 0;

        // sprite.body.createGroupCallback(
        //     MASKS.BULLET,
        //     (asteroidBody: Phaser.Physics.P2.Body, impactedBody: Phaser.Physics.P2.Body) => {
        //         eventEmitter.emit(Events.AsteroidDestroyed, asteroidBody, impactedBody);
        //     },
        //     this
        // );

        // sprite.body.createGroupCallback(
        //     MASKS.PLAYER,
        //     () => {
        //         eventEmitter.emit(Events.AsteroidPlayerHit);
        //     },
        //     this
        // );

        // sprite.data = this;
        this.sprite = sprite;
    }

    public explode = () => {
        if (this.level < Asteroid.MaxLevel) {
            const angleDisturb = (Math.PI / 2) * (Math.random() - 0.5);
            for (let i = 0; i < this.level + 2; i++) {
                const angle = (Math.PI / 2) * i + angleDisturb;
                const position = this.getSubAstroidPosition(
                    [this.sprite.body.position.x, this.sprite.body.position.y],
                    this.getRadius(),
                    i,
                    Asteroid.Splits
                );
                this.createSubAsteroid(position[0], position[1], angle, i);
            }
        }
    };

    private createBodyGraphics(graphics: Phaser.GameObjects.Graphics, concavePath: number[][]) {
        graphics.lineStyle(this.strokeWidth, this.strokeColor);
        graphics.fillStyle(this.fillColor);
        graphics.beginPath();
        for (let j = 0; j < concavePath.length; j++) {
            const xv = concavePath[j][0];
            const yv = concavePath[j][1];
            if (j === 0) {
                graphics.moveTo(xv, yv);
            } else {
                graphics.lineTo(xv, yv);
            }
        }
        if (concavePath.length > 2) {
            graphics.moveTo(
                concavePath[concavePath.length - 1][0],
                concavePath[concavePath.length - 1][1]
            );
            graphics.lineTo(concavePath[0][0], concavePath[0][1]);
        }
        graphics.fill();
    }

    private getSubAstroidPosition = (
        bodyPosition: number[],
        radius: number,
        index: number,
        totalSplits: number
    ) => {
        if (totalSplits === 1) {
            return bodyPosition.splice(0);
        }
        return [
            this.sprite.x + (radius / 1.25) * (index <= totalSplits / 2 ? 1 : -1),
            this.sprite.y + (radius / 1.25) * (index % 2 === 0 ? 1 : -1),
        ];
    };

    private createSubAsteroid = (x: number, y: number, angle: number, index: number) => {
        const r = this.getRadius() / 2;
        const position = {
            x: x + r * Math.cos(angle),
            y: y + r * Math.sin(angle),
        };

        const velocity = { x: Math.random() - 0.5, y: Math.random() - 0.5 };

        const subAsteroid = new Asteroid(
            this.scene,
            position,
            velocity,
            this.sprite.body.angularVelocity,
            this.level + 1,
            index
        );
        return subAsteroid;
    };

    // Adds random to an asteroid body
    private addAsteroidVerticals() {
        const verticals = [];
        const radius = this.getRadius();
        for (let j = 0; j < Asteroid.NumAsteroidVerticals; j++) {
            const angle = (j * 2 * Math.PI) / Asteroid.NumAsteroidVerticals;
            const xv = Number(
                (radius * Math.cos(angle) + (Math.random() - 0.5) * radius * 0.4).toFixed(2)
            );
            const yv = Number(
                (radius * Math.sin(angle) + (Math.random() - 0.5) * radius * 0.4).toFixed(2)
            );
            verticals.push([xv, yv]);
        }
        return verticals;
    }

    private getRadius() {
        return (
            (Asteroid.AsteroidRadius * (Asteroid.NumAsteroidLevels - this.level)) /
            Asteroid.NumAsteroidLevels
        );
    }
}
