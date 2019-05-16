import Phaser from 'phaser';
import { IArcadeSprite } from '../../../common';
import { Player } from '../player';

export class BasePowerUp {
    public sprite: IArcadeSprite;
    public isActive: boolean = false;

    constructor(
        protected scene: Phaser.Scene,
        spriteName: string,
        position: WebKitPoint,
        velocity: WebKitPoint,
        angularVelocity: number,
        protected group: Phaser.GameObjects.Group
    ) {
        const sprite = group.create(position.x, position.y, spriteName) as IArcadeSprite;
        // sprite.anchor.x = 0.5;
        // sprite.anchor.y = 0.5;

        sprite.body.mass = 0.01;
        sprite.body.x = position.x;
        sprite.body.y = position.y;
        sprite.body.velocity.x = velocity.x;
        sprite.body.velocity.y = velocity.y;
        sprite.body.angularVelocity = angularVelocity;
        // sprite.body.damping = 0;
        // sprite.body.angularDamping = 0;
        // sprite.previousPosition = sprite.position;

        // sprite.body.setRectangle(sprite.width, sprite.height);
        // sprite.body.setCollisionGroup(MASKS.POWER_UP);
        // sprite.body.collides([
        //     game.physics.p2.everythingCollisionGroup,
        //     MASKS.PLAYER,
        //     MASKS.POWER_UP,
        //     MASKS.BULLET,
        //     MASKS.ASTEROID,
        // ]);

        // sprite.body.createGroupCallback(
        //     MASKS.PLAYER,
        //     (_thisBody: Phaser.Physics.P2.Body, playerBody: Phaser.Physics.P2.Body) => {
        //         if ((playerBody.sprite.data as Player).hasShield) {
        //             return;
        //         }

        //         this.activate(playerBody.sprite.data);
        //         eventEmitter.emit(Events.PowerUpActivated, this);
        //     },
        //     this
        // );

        // sprite.data = this;

        this.sprite = sprite;
    }

    public activate(_player: Player) {
        // Override what happens when activating
        this.sprite.destroy();
        this.isActive = true;
    }

    public deactivate(_player: Player) {
        // Override what happens when deactivating
        this.isActive = false;
    }
}
