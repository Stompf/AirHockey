import { Socket } from 'socket.io';
import { AirHockey, Shared } from 'src/shared';

export interface IPlayerOptions {
    position: Shared.Vector2D;
    name: string;
    socket: Socket;
    team: AirHockey.Team;
}
