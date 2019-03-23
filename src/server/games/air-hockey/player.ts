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
    private readonly playerRadius = 10;

    constructor(options: IPlayerOptions) {
        this.name = options.name;
        this.team = options.team;
        this.id = options.id;
        this.body = Bodies.circle(options.position.x, options.position.y, this.playerRadius, {
            isStatic: true,
        });
    }

    public setPauseBody(pause: boolean) {
        this.body.isStatic = pause;
    }

    public toNetworkPlayer(): AirHockey.IPlayer {
        return {
            color: this.team === 'left' ? 'red' : 'blue',
            id: this.id,
            position: this.getPosition(),
            team: this.team,
        };
    }

    public updateDirection(directionX: number, directionY: number) {
        const direction: Matter.Vector = {
            x: this.getDirection(directionX),
            y: this.getDirection(directionY),
        };

        Body.applyForce(this.body, direction, direction);
    }

    private getDirection(direction: number) {
        if (direction === 0) {
            return 0;
        }

        if (direction > 0) {
            return 10;
        } else {
            return -10;
        }
    }

    private getPosition(): Shared.Vector2D {
        const { position } = this.body;
        return { x: position.x, y: position.y };
    }
}
