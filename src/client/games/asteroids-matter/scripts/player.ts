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
    private hasShield: boolean = false;
    private reloadTime = 200;
    private lastShootTime = 0;
    private thrustSpeed = 0.02;
    private turnSpeed = 0.05;

    private playerKeyboard: PlayerKeyboard;

    constructor(private scene: Phaser.Scene, private physicsCategories: PhysicsCategories) {
        const sprite = scene.matter.add.image(
            scene.sys.canvas.width / 2,
            scene.sys.canvas.height / 2,
            'player'
        ) as IMatterSprite;

        sprite.setDisplaySize(40, 30);
        sprite.setFrictionAir(0.0001);
        sprite.setMass(30);
        sprite.setFixedRotation();
        sprite.setCollisionCategory(physicsCategories.player);

        sprite.setCollidesWith([physicsCategories.asteroids, physicsCategories.powerUps]);

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
    }

    public allowCollision() {
        return this.sprite.visible && !flags.INVULNERABLE && !this.hasShield;
    }

    private shoot() {
        const angle = this.sprite.rotation - Math.PI / 2;

        const bullet = new Bullet(
            this.scene,
            angle,
            { x: this.sprite.x, y: this.sprite.y },
            this.sprite.body.velocity,
            this.physicsCategories
        );

        // Keep track of the last time we shot
        // this.player.lastShootTime = this.game.physics.p2.world.time;

        return bullet;
    }
}
