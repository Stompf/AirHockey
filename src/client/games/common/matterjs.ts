export interface IMatterSprite extends Phaser.Physics.Matter.Image {
    body: Matter.Body;
}

export const CollisionStartEvent = 'collisionstart';

export interface ICollisionStartEvent extends Phaser.Physics.Matter.Events.CollisionActiveEvent {
    /**
     * A list of all affected pairs in the collision.
     */
    pairs: IPairCollision[];
}

export interface IPairCollision {
    bodyA: ICollisionBody;
    bodyB: ICollisionBody;
}

interface ICollisionBody {
    gameObject: Phaser.GameObjects.GameObject;
}
