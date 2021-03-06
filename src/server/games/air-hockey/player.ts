import * as p2 from 'p2';
import { AirHockey, Shared } from 'src/shared';
import { Team } from './team';

export class Player {
    public static readonly DIAMETER = 60;

    public static readonly MASS = 10;

    public static readonly SPEED = 1100;

    public socketId: Shared.Id;

    public body: p2.Body;

    public team: Team;

    public isReady: boolean = false;

    public readonly COLOR: number;

    private currentDirection: AirHockey.IDirection;

    constructor(world: p2.World, socketId: Shared.Id, color: number, team: Team) {
        this.currentDirection = { directionX: 0, directionY: 0 };
        this.body = new p2.Body({
            mass: Player.MASS,
        });
        this.body.addShape(new p2.Circle({ radius: Player.DIAMETER / 2 }));
        world.addBody(this.body);
        this.socketId = socketId;
        this.COLOR = color;
        this.team = team;
    }

    public setPosition(position: Shared.Vector2D) {
        this.currentDirection = { directionX: 0, directionY: 0 };
        this.body.velocity = [0, 0];
        this.body.position = [position.x, position.y];
        this.body.previousPosition = this.body.position;
    }

    public toNewNetworkPlayer(): AirHockey.IPlayer {
        return {
            color: this.COLOR,
            id: this.socketId,
            position: { x: this.body.position[0], y: this.body.position[1] },
            diameter: Player.DIAMETER,
            mass: Player.MASS,
            speed: Player.SPEED,
            teamSide: this.team.TeamSide,
        };
    }

    public toUpdateNetworkPlayerPlayer(): AirHockey.IPlayerUpdate {
        return {
            id: this.socketId,
            position: {
                x: this.body.interpolatedPosition[0],
                y: this.body.interpolatedPosition[1],
            },
        };
    }

    public setDirection(newDirection: AirHockey.IDirection) {
        this.currentDirection = newDirection;
    }

    public onUpdate = () => {
        this.moveUp(this.currentDirection.directionY);
        this.moveRight(this.currentDirection.directionX);
    };

    private moveUp(input: number) {
        if (input === 0) {
            this.body.velocity[1] = 0;
        } else {
            this.body.velocity[1] = Player.pxmi(input > 0 ? -Player.SPEED : Player.SPEED);
        }
    }

    private moveRight(input: number) {
        if (input === 0) {
            this.body.velocity[0] = 0;
        } else {
            this.body.velocity[0] = Player.pxmi(input > 0 ? -Player.SPEED : Player.SPEED);
        }
    }

    private static pxmi(v: number) {
        return v * -0.05;
    }
}
