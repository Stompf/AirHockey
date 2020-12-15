import Phaser from 'phaser';
import { IMatterSprite } from '../../common';
import { PhysicsCategories } from './utils';

export class Asteroid {
    public static MaxAsteroidSpeed = 5;

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
        index: number,
        private physicsCategories: PhysicsCategories
    ) {
        this.level = level;

        const verticals = this.addAsteroidVerticals();

        const graphics = scene.add.graphics();

        graphics.setVisible(false);
        this.createBodyGraphics(graphics, verticals);
        const textureName = `Asteroid-${index}-${level}`;
        graphics.generateTexture(textureName, this.getRadius() * 2, this.getRadius() * 2);

        const sprite = scene.matter.add.image(position.x, position.y, textureName) as IMatterSprite;

        sprite.setBody(
            {
                type: 'fromVerts',
                x: position.x,
                y: position.y,
                verts: verticals,
            },
            {}
        );

        sprite.setMass(10 / (level + 1));
        sprite.setFrictionAir(0);
        sprite.setVelocity(velocity.x, velocity.y);
        sprite.setAngularVelocity(angularVelocity);

        sprite.setCollisionCategory(physicsCategories.asteroids);

        sprite.setCollidesWith([
            physicsCategories.asteroids,
            physicsCategories.player,
            physicsCategories.bullet,
            physicsCategories.shield,
            physicsCategories.powerUps,
        ]);

        sprite.setData('type', this);
        this.sprite = sprite;
    }

    public explode = () => {
        if (this.level < Asteroid.MaxLevel) {
            const angleDisturb = (Math.PI / 2) * (Math.random() - 0.5);
            for (let i = 0; i < this.level + 2; i += 1) {
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

    public destroy() {
        if (this.sprite.visible) {
            this.sprite.destroy();
        }
    }

    private createBodyGraphics(graphics: Phaser.GameObjects.Graphics, concavePath: WebKitPoint[]) {
        graphics.lineStyle(this.strokeWidth, this.strokeColor);
        graphics.fillStyle(this.fillColor);
        graphics.beginPath();
        for (let j = 0; j < concavePath.length; j += 1) {
            const xv = concavePath[j].x;
            const yv = concavePath[j].y;
            if (j === 0) {
                graphics.moveTo(xv, yv);
            } else {
                graphics.lineTo(xv, yv);
            }
        }
        if (concavePath.length > 2) {
            graphics.moveTo(
                concavePath[concavePath.length - 1].x,
                concavePath[concavePath.length - 1].y
            );
            graphics.lineTo(concavePath[0].x, concavePath[0].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }

    private getSubAstroidPosition = (
        bodyPosition: number[],
        radius: number,
        index: number,
        totalSplits: number
    ) =>
        totalSplits === 1
            ? bodyPosition.splice(0)
            : [
                  this.sprite.x + (radius / 1.25) * (index <= totalSplits / 2 ? 1 : -1),
                  this.sprite.y + (radius / 1.25) * (index % 2 === 0 ? 1 : -1),
              ];

    private createSubAsteroid = (x: number, y: number, angle: number, index: number) => {
        const r = this.getRadius() / 2;
        const position = {
            x: x + r * Math.cos(angle),
            y: y + r * Math.sin(angle),
        };

        const velocity = {
            x: (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed,
            y: (Math.random() - 0.5) * Asteroid.MaxAsteroidSpeed,
        };

        const subAsteroid = new Asteroid(
            this.scene,
            position,
            velocity,
            this.sprite.body.angularVelocity,
            this.level + 1,
            index,
            this.physicsCategories
        );
        return subAsteroid;
    };

    // Adds random to an asteroid body
    private addAsteroidVerticals() {
        const verticals = [];
        const radius = this.getRadius();
        for (let j = 0; j < Asteroid.NumAsteroidVerticals; j += 1) {
            const angle = (j * 2 * Math.PI) / Asteroid.NumAsteroidVerticals;
            const xv = Number(
                (radius * Math.cos(angle) + (Math.random() + 2) * radius * 0.4).toFixed(2)
            );
            const yv = Number(
                (radius * Math.sin(angle) + (Math.random() + 2) * radius * 0.4).toFixed(2)
            );
            verticals.push({ x: xv, y: yv });
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
