import { Shared } from './shared';

export namespace AirHockey {
    export type Team = 'left' | 'right';

    export interface IPlayerReadyEvent {
        type: 'playerReady';
    }

    export interface IPositionUpdate {
        type: 'positionUpdate';
    }

    export interface IGameStartingEvent {
        type: 'gameStarting';
        startTime: string;
        players: IPlayer[];
    }

    export interface IPlayer {
        id: Shared.Id;
        team: Team;
        position: Shared.Vector2D;
        color: string;
    }

    export interface IServerReceivedEvent {
        id: Shared.Id;
        data: ClientToServerGameEvent;
    }

    export type ClientToServerGameEvent = IPlayerReadyEvent;
    export type ServerToClientGameEvent = IGameStartingEvent;
}
