import { Bodies, Body } from 'matter-js';
import { AirHockey, Shared } from 'src/shared';

interface IBallOptions {
    position: Shared.Vector2D;
}

export class Ball {
    public readonly body: Body;
    private readonly radius = 10;
    private readonly color = 0x000000;

    constructor(options: IBallOptions) {
        // this.body = Bodies.circle(options.position.x, options.position.y, this.radius, {
        //     isStatic: true,
        //     frictionAir: 0,
        //     friction: 0,
        //     frictionStatic: 0,
        //     restitution: 5,
        //     mass: 0.1,
        // });

        this.body = Bodies.rectangle(options.position.x, options.position.y, 10, 10, {
            isStatic: true,
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 1,
            mass: 1,
        });
    }

    public toNetworkBall(): AirHockey.INetworkBall {
        return {
            radius: this.radius,
            color: this.color,
            position: this.getPosition(),
        };
    }

    public toNetworkUpdate(): AirHockey.IBallUpdate {
        return {
            position: this.getPosition(),
        };
    }

    public reset(position: Shared.Vector2D) {
        Body.setAngularVelocity(this.body, 0);
        Body.setVelocity(this.body, { x: 0, y: 0 });

        this.body.position = {
            x: position.x,
            y: position.y,
        };
    }

    public setPauseBody(pause: boolean): void {
        this.body.isStatic = pause;
    }

    private getPosition(): Shared.Vector2D {
        const { position } = this.body;
        return { x: position.x, y: position.y };
    }
}
