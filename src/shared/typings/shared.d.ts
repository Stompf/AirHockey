export namespace Shared {
    export type Game = 'AirHockey';

    export type Vector2D = { x: number; y: number };

    export type Id = string;

    export interface IMatchmakerEvent {
        game: Game;
    }
}
