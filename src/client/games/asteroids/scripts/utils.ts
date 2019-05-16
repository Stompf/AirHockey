import { IArcadeSprite } from '../../common';

export function constrainVelocity(sprite: IArcadeSprite, maxVelocity: number) {
    let vx = sprite.body.velocity.x;
    let vy = sprite.body.velocity.y;

    const currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
        const angle = Math.atan2(vy, vx);

        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;

        sprite.body.velocity.set(vx, vy);
    }
}
