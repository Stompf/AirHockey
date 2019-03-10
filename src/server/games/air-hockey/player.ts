import { Bodies } from 'matter-js';
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
}
