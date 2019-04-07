import { Shared } from './shared';

export namespace AirHockey {
    export type Team = 'left' | 'right';

    export interface IGameLoadingEvent {
        type: 'gameLoading';
        players: IPlayer[];
        ball: INetworkBall;
    }

    export interface IPlayerReadyEvent {
        type: 'playerReady';
    }

    export interface IPlayerDisconnected {
        type: 'disconnected';
    }

    export interface IPlayerDirectionUpdate {
        type: 'directionUpdate';
        direction: IDirection;
    }

    export interface IGameStartingEvent {
        type: 'gameStarting';
        startTime: string;
    }

    export interface INetworkUpdateEvent {
        type: 'networkUpdate';
        tick: number;
        players: IPlayerUpdate[];
        ball: IBallUpdate;
    }

    export interface IPlayer {
        id: Shared.Id;
        team: Team;
        position: Shared.Vector2D;
        color: Shared.Color;
        radius: number;
    }

    export interface IPlayerUpdate {
        id: Shared.Id;
        position: Shared.Vector2D;
    }

    export interface IBallUpdate {
        position: Shared.Vector2D;
    }

    export interface INetworkBall {
        color: Shared.Color;
        radius: number;
        position: Shared.Vector2D;
    }

    export interface IServerReceivedEvent {
        id: Shared.Id;
        data: ClientToServerGameEvent;
    }

    export interface IGameStoppedEvent {
        type: 'gameStopped';
        reason: 'player_disconnected';
    }

    export interface IDirection {
        directionX: number;
        directionY: number;
    }

    export type ClientToServerGameEvent =
        | IPlayerReadyEvent
        | IPlayerDirectionUpdate
        | IPlayerDisconnected;

    export type ServerToClientGameEvent =
        | IGameStartingEvent
        | INetworkUpdateEvent
        | IGameStoppedEvent
        | IGameLoadingEvent;
}
