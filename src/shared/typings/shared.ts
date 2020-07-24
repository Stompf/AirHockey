export namespace Shared {
    export type Game = 'AirHockey';
    export type Size = { height: number; width: number };
    export type Vector2D = { x: number; y: number };
    export type Id = string;
    export type Color = number;

    export interface IMatchmakerEvent {
        game: Game;
    }

    export type Direction = 'left' | 'right' | 'up' | 'down';
}
