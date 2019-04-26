import * as p2 from 'p2';
import { AirHockey, Shared } from 'src/shared';

export class Ball {
    public static readonly DIAMETER = 30;
    public static readonly MASS = 0.1;
    public static readonly COLOR = 0x000000;
    public static readonly MAX_VELOCITY = 150;
    public body: p2.Body;

    constructor(world: p2.World) {
        this.body = new p2.Body({
            mass: Ball.MASS,
        });
        const circle = new p2.Circle({ radius: Ball.DIAMETER / 2 });
        this.body.addShape(circle);

        this.body.damping = 0;
        world.addBody(this.body);
    }

    public onUpdate() {
        this.constrainVelocity(this.body, Ball.MAX_VELOCITY);
    }

    public setPosition(position: Shared.Vector2D) {
        this.body.position = [position.x, position.y];
        this.body.previousPosition = this.body.position;
    }

    public getPosition(): Shared.Vector2D {
        const { position } = this.body;
        return {
            x: position[0],
            y: position[1],
        };
    }

    public toBallUpdate(): AirHockey.IBallUpdate {
        return {
            angularVelocity: this.body.angularVelocity,
            position: {
                x: this.body.interpolatedPosition[0],
                y: this.body.interpolatedPosition[1],
            },
            velocity: this.body.velocity,
        };
    }

    public resetVelocity(velocityX?: number) {
        this.body.velocity = [velocityX ? velocityX : 0, 0];
    }

    private constrainVelocity(body: p2.Body, maxVelocity: number) {
        let vx = body.velocity[0];
        let vy = body.velocity[1];

        const currVelocitySqr = vx * vx + vy * vy;

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            const angle = Math.atan2(vy, vx);

            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;

            body.velocity[0] = vx;
            body.velocity[1] = vy;
        }
    }
}
