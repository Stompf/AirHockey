import { Socket } from 'socket.io';
import { AirHockey, Shared } from 'src/shared';
import { IPlayerOptions } from './models/player.options';

export class Player {
    public get Id() {
        return this.socket.id;
    }

    private currentPosition: Shared.Vector2D;
    private name: string;
    private team: AirHockey.Team;
    private socket: Socket;

    constructor(options: IPlayerOptions) {
        this.currentPosition = options.position;
        this.name = options.name;
        this.team = options.team;
        this.socket = options.socket;
    }
}
