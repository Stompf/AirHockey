import Phaser from 'phaser';
import { IArcadeSprite } from '../../common';

export class Player {
    public allowCollision: boolean = true;
    public hasShield: boolean = false;
    public reloadTime = 0.2;
    public turnSpeed = 4;
    public lives = 3;
    public points = 0;
    public lastShootTime = 0;
    public sprite: IArcadeSprite;

    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group) {
        const sprite = group.create(
            scene.scale.width / 2,
            scene.scale.height / 2,
            'player'
        ) as IArcadeSprite;
        scene.physics.add.existing(sprite);
        // sprite.anchor.x = 0.5;
        // sprite.anchor.y = 0.5;
        sprite.width = 40;
        sprite.height = 30;
        sprite.body.mass = 1;
        sprite.body.useDamping = true;
        sprite.body.setMaxVelocity(200);
        sprite.body.setDragX(0.99);
        // sprite.body.damping = 0;
        // sprite.body.angularDamping = 0;
        // sprite.body.setRectangle(sprite.width, sprite.height);
        // sprite.body.setCollisionGroup(MASKS.PLAYER);
        // sprite.body.collides([MASKS.ASTEROID, MASKS.POWER_UP]);

        this.sprite = sprite;
    }
}
