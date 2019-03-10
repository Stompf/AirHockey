import { Shared } from './shared';

export namespace AirHockey {
    export type Team = 'left' | 'right';

    export type GameEvents = 'playerReady' | 'test2';

    export interface IBaseGameEvent {
        event: GameEvents;
    }

    export interface IPlayerReadyEvent extends IBaseGameEvent {
        event: 'playerReady';
        id: Shared.Id;
    }
}
