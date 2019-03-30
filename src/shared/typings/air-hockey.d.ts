import { Shared } from './shared';

export namespace AirHockey {
    export type Team = 'left' | 'right';

    export interface IPlayerReadyEvent {
        type: 'playerReady';
    }

    export interface IPlayerDisconnected {
        type: 'disconnected';
    }

    export interface IPlayerDirectionUpdate {
        type: 'directionUpdate';
        directionX: number;
        directionY: number;
    }

    export interface IGameStartingEvent {
        type: 'gameStarting';
        startTime: string;
        players: IPlayer[];
    }

    export interface INetworkUpdateEvent {
        type: 'networkUpdate';
        players: IPlayerUpdate[];
    }

    export interface IPlayer {
        id: Shared.Id;
        team: Team;
        position: Shared.Vector2D;
        color: string;
    }

    export interface IPlayerUpdate {
        id: Shared.Id;
        position: Shared.Vector2D;
    }

    export interface IServerReceivedEvent {
        id: Shared.Id;
        data: ClientToServerGameEvent;
    }

    export type ClientToServerGameEvent =
        | IPlayerReadyEvent
        | IPlayerDirectionUpdate
        | IPlayerDisconnected;

    export type ServerToClientGameEvent = IGameStartingEvent | INetworkUpdateEvent;
}
