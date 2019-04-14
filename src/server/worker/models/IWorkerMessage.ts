import { Shared } from 'src/shared';

export interface IWorkerMessage {
    id: Shared.Id;
    data: any;
}
