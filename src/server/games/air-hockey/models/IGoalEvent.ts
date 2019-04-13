import { Team } from '../team';
import { ITeams } from './ITeams';

export interface IGoalEvent {
    teamThatScored: Team;
    allTeams: ITeams;
}
