import Phaser from 'phaser';
import { IMatterSprite } from '../../common';
import { flags } from '../debug';
import { Bullet } from './bullet';
import { createPlayerKeyboard, PlayerKeyboard } from './key-mapping';
import { PhysicsCategories } from './utils';

export class Player {
    public lives = 3;
    public points = 0;
    public sprite: IMatterSprite;
    public reloadTime = 200;
    private shieldSprite: IMatterSprite | undefined;
    private lastShootTime = 0;
    private thrustSpeed = 0.02;
    private turnSpeed = 0.05;
    private startSpeed = 0.5;
    private maxSpeed = 7;
    private playerKeyboard: PlayerKeyboard;

    constructor(private scene: Phaser.Scene, private physicsCategories: PhysicsCategories) {
        const sprite = scene.matter.add.image(
            scene.sys.canvas.width / 2,
            scene.sys.canvas.height / 2,
            'player'
        ) as IMatterSprite;

        sprite.setDisplaySize(40, 30);
        sprite.setFrictionAir(0.0001);
        sprite.setVelocity(-this.startSpeed, this.startSpeed);
        sprite.setMass(30);
        sprite.setFixedRotation();

        this.setCollisions(sprite);

        this.playerKeyboard = createPlayerKeyboard(scene);

        sprite.setData('type', this);

        this.sprite = sprite;
    }

    public onUpdate(time: number) {
        if (this.playerKeyboard.left.isDown) {
            this.sprite.setAngularVelocity(-this.turnSpeed);
        } else if (this.playerKeyboard.right.isDown) {
            this.sprite.setAngularVelocity(this.turnSpeed);
        } else {
            this.sprite.setAngularVelocity(0);
        }

        if (this.playerKeyboard.up.isDown) {
            this.sprite.thrustLeft(this.thrustSpeed);
        }

        if (this.playerKeyboard.fire.isDown && time - this.lastShootTime > this.reloadTime) {
            this.shoot();
            this.lastShootTime = time;
        }

        if (this.shieldSprite) {
            this.shieldSprite.setPosition(this.sprite.body.position.x, this.sprite.body.position.y);
        }

        this.sprite.setVelocity(
            Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.sprite.body.velocity.x)),
            Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.sprite.body.velocity.y))
        );
    }

    public kill() {
        this.lives--;
        this.sprite.setVisible(false);
        this.sprite.setCollisionCategory(this.physicsCategories.nothing);
        this.sprite.setCollidesWith([]);
        return this.lives;
    }

    public hasShield() {
        return !!this.shieldSprite;
    }

    public setShield(shieldSprite: IMatterSprite) {
        this.shieldSprite = shieldSprite;
    }

    public removeShield() {
        this.shieldSprite = undefined;
    }

    public respawn() {
        this.sprite.setPosition(this.scene.sys.canvas.width / 2, this.scene.sys.canvas.height / 2);
        this.sprite.body.force.x = 0;
        this.sprite.body.force.y = 0;
        this.sprite.setVelocity(-this.startSpeed, this.startSpeed);
        this.sprite.setAngularVelocity(0);
        this.sprite.setAngle(0);
        this.setCollisions(this.sprite);
        this.sprite.setVisible(true);
    }

    public allowCollision() {
        return this.isAlive() && !flags.INVULNERABLE && !this.hasShield();
    }

    public isAlive() {
        return !!this.sprite.visible;
    }

    private setCollisions(sprite: IMatterSprite) {
        sprite.setCollisionCategory(this.physicsCategories.player);
        sprite.setCollidesWith([this.physicsCategories.asteroids, this.physicsCategories.powerUps]);
    }

    private shoot() {
        if (!this.isAlive()) {
            return;
        }

        const angle = this.sprite.rotation - Math.PI / 2;

        const bullet = new Bullet(
            this.scene,
            angle,
            { x: this.sprite.x, y: this.sprite.y },
            this.sprite.body.velocity,
            this.physicsCategories
        );

        return bullet;
    }
}
