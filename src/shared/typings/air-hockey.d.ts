import { Shared } from './shared';

export namespace AirHockey {
    export type Team = 'left' | 'right';

    export interface IGameLoadingEvent {
        type: 'gameLoading';
        gameSize: Shared.Size;
        physicsOptions: PhysicOptions;
        goals: IGoalOptions[];
        players: IPlayer[];
        ball: BallOptions;
    }

    interface BallOptions {
        position: Shared.Vector2D;
        diameter: number;
        mass: number;
        color: number;
        maxVelocity: number;
    }

    interface PhysicOptions {
        gravity: number[];
        restitution: number;
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
        teamSide: Team;
        position: Shared.Vector2D;
        color: Shared.Color;
        diameter: number;
        mass: number;
        speed: number;
    }

    export interface IPlayerUpdate {
        id: Shared.Id;
        position: Shared.Vector2D;
    }

    export interface IBallUpdate {
        position: Shared.Vector2D;
        angularVelocity: number;
        velocity: [number, number];
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

    export interface IGoalOptions {
        back: IPositionWithBox;
        bottom: IPositionWithBox;
        goal: IPositionWithBox;
        top: IPositionWithBox;
    }

    export interface IPositionWithBox {
        height: number;
        width: number;
        x: number;
        y: number;
    }

    export interface IGoalEvent {
        type: 'goal';
        teamThatScored: Team;
        teamLeftScore: number;
        teamRightScore: number;
        timeout: number;
    }

    export interface ITerminateRequestEvent {
        type: 'terminateRequest';
        reason: 'gameStopped';
    }

    export type ClientToServerGameEvent =
        | IPlayerReadyEvent
        | IPlayerDirectionUpdate
        | IPlayerDisconnected;

    export type ServerToClientGameEvent =
        | IGameStartingEvent
        | INetworkUpdateEvent
        | IGameStoppedEvent
        | IGameLoadingEvent
        | IGoalEvent;
}
