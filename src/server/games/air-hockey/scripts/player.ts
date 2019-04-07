import { Bodies, Body } from 'matter-js';
import { AirHockey, Shared } from 'src/shared';

interface IPlayerOptions {
    position: Shared.Vector2D;
    name: string;
    id: Shared.Id;
    team: AirHockey.Team;
}

export class Player {
    public readonly name: string;
    public readonly team: AirHockey.Team;
    public readonly id: Shared.Id;
    public readonly body: Matter.Body;
    public isReady = false;
    private readonly playerRadius = 25;

    constructor(options: IPlayerOptions) {
        this.name = options.name;
        this.team = options.team;
        this.id = options.id;
        this.body = Bodies.circle(options.position.x, options.position.y, this.playerRadius, {
            isStatic: true,
            mass: 10,
        });
    }

    public setPauseBody(pause: boolean) {
        this.body.isStatic = pause;
    }

    public reset(position: Shared.Vector2D) {
        Body.setAngularVelocity(this.body, 0);
        Body.setVelocity(this.body, { x: 0, y: 0 });

        this.body.position = {
            x: position.x,
            y: position.y,
        };
    }

    public toNetworkPlayer(): AirHockey.IPlayer {
        return {
            color: this.team === 'left' ? 0xff0000 : 0x0000ff,
            id: this.id,
            position: this.getPosition(),
            team: this.team,
            radius: this.playerRadius,
        };
    }

    public toNetworkUpdate(): AirHockey.IPlayerUpdate {
        return {
            id: this.id,
            position: this.getPosition(),
        };
    }

    public updateDirection(directionX: number, directionY: number) {
        const direction: Matter.Vector = {
            x: this.getDirection(directionX),
            y: this.getDirection(directionY),
        };
        Body.setVelocity(this.body, direction);
    }

    private getDirection(direction: number) {
        if (direction === 0) {
            return 0;
        }

        if (direction > 0) {
            return 5;
        } else {
            return -5;
        }
    }

    private getPosition(): Shared.Vector2D {
        const { position } = this.body;
        return { x: position.x, y: position.y };
    }
}
