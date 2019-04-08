import * as p2 from 'p2';
import { AirHockey } from 'shared/interfaces';
import { Socket } from 'socket.io';
import { Team } from './team';

export class Player {
    public static readonly DIAMETER = 60;
    public static readonly MASS = 10;
    public static readonly SPEED = 500;
    public socket: Socket;
    public body: p2.Body;
    public team: Team;

    public readonly COLOR: number;

    constructor(world: p2.World, socket: Socket, color: number, team: Team) {
        this.body = new p2.Body({
            mass: Player.MASS,
        });
        this.body.addShape(new p2.Circle({ radius: Player.DIAMETER / 2 }));
        world.addBody(this.body);
        this.socket = socket;
        this.COLOR = color;
        this.team = team;
    }

    public setPosition(position: WebKitPoint) {
        this.body.velocity = [0, 0];
        this.body.position = [position.x, position.y];
        this.body.previousPosition = this.body.position;
    }

    public toNewNetworkPlayer(): AirHockey.NewNetworkPlayer {
        return {
            color: this.COLOR,
            id: this.socket.id,
            position: { x: this.body.position[0], y: this.body.position[1] },
            diameter: Player.DIAMETER,
            mass: Player.MASS,
            speed: Player.SPEED,
        };
    }

    public toUpdateNetworkPlayerPlayer(): AirHockey.UpdateNetworkPlayer {
        return {
            id: this.socket.id,
            position: {
                x: this.body.interpolatedPosition[0],
                y: this.body.interpolatedPosition[1],
            },
        };
    }

    public moveUp(input: number) {
        if (input === 0) {
            this.body.velocity[1] = 0;
        } else {
            this.body.velocity[1] = this.pxmi(input > 0 ? -Player.SPEED : Player.SPEED);
        }
    }

    public moveRight(input: number) {
        if (input === 0) {
            this.body.velocity[0] = 0;
        } else {
            this.body.velocity[0] = this.pxmi(input > 0 ? -Player.SPEED : Player.SPEED);
        }
    }

    private pxmi(v: number) {
        return v * -0.05;
    }
}
