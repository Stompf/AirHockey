import logger from 'src/server/logger';
import { AirHockey, Shared, UnreachableCaseError } from 'src/shared';
import { IAirHockeyGameOptions, IGoalEvent } from './models';
import { World } from './world';

export class AirHockeyServer {
    public static MAX_PLAYERS = 2;
    public static MIN_PLAYERS = 2;

    public readonly GAME_NAME = 'AirHockey';

    private readonly NETWORK_INTERVAL = 1 / 20;
    private readonly FIXED_TIME_STEP = 1 / 60;
    private readonly MAX_SUB_STEPS = 10;
    private readonly SCORE_DELAY_MS = 2000;
    private networkIntervalReference: NodeJS.Timer | undefined;
    private physicsIntervalReference: NodeJS.Timer | undefined;

    private timeLimitReference: NodeJS.Timer | undefined;
    private tick = 0;
    private gameStated: boolean;
    private paused = false;
    private world: World;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.ServerToClientGameEvent) => void,
        private requestTermination: (event: AirHockey.ITerminateRequestEvent) => void
    ) {
        if (options.playerIds.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        }

        this.gameStated = false;

        this.world = new World(options.playerIds[0], options.playerIds[1]);
        this.world.goalEmitter.on(this.onGoal);
    }

    public onEventReceived = ({ data, id }: AirHockey.IServerReceivedEvent) => {
        logger.debug('EventReceived', data);
        switch (data.type) {
            case 'playerReady':
                this.onPlayerReady(id);
                break;
            case 'directionUpdate':
                this.onPlayerMove(id, data);
                break;
            case 'disconnected':
                this.stopGame();
                break;
            default:
                throw new UnreachableCaseError(data);
        }
    };

    public emitLoaded = () => {
        this.postEvent({
            type: 'gameLoading',
            ...this.world.getInit(),
        });
    };

    public stopGame = (forced?: boolean) => {
        logger.info(`${this.GAME_NAME} - stopping game.${forced === true ? ' forced' : ''}`);

        this.gameStated = false;

        if (this.physicsIntervalReference) {
            clearInterval(this.physicsIntervalReference);
        }

        if (this.timeLimitReference) {
            clearTimeout(this.timeLimitReference);
        }

        if (this.networkIntervalReference) {
            clearTimeout(this.networkIntervalReference);
        }

        this.postEvent({
            type: 'gameStopped',
            reason: 'player_disconnected',
        });

        this.world.clear();

        this.requestTermination({
            type: 'terminateRequest',
            reason: 'gameStopped',
        });
    };

    private onPlayerReady(id: Shared.Id) {
        const allReady = this.world.setPlayerReady(id);

        if (allReady) {
            this.startGame();
        }
    }

    private onPlayerMove(id: Shared.Id, data: AirHockey.IPlayerDirectionUpdate) {
        if (!this.gameStated) {
            return;
        }

        this.world.movePlayer(id, data);
    }

    private startGame() {
        const gameStarting: AirHockey.IGameStartingEvent = {
            type: 'gameStarting',
            startTime: new Date().toISOString(),
        };

        logger.info(`${this.GAME_NAME} - starting game`);

        this.postEvent(gameStarting);

        this.physicsIntervalReference = setInterval(this.heartbeat, this.FIXED_TIME_STEP);
        this.networkIntervalReference = setInterval(this.networkUpdate, this.NETWORK_INTERVAL);

        this.gameStated = true;
    }

    private onGoal = (goalEvent: IGoalEvent) => {
        this.paused = true;

        goalEvent.teamThatScored.addScore();

        const newGoal: AirHockey.IGoalEvent = {
            type: 'goal',
            teamLeftScore: goalEvent.allTeams.teamLeft.Score,
            teamRightScore: goalEvent.allTeams.teamRight.Score,
            teamThatScored: goalEvent.teamThatScored.TeamSide,
            timeout: this.SCORE_DELAY_MS,
        };

        this.postEvent(newGoal);

        setTimeout(() => {
            this.world.reset(goalEvent.teamThatScored);
            this.paused = false;
        }, this.SCORE_DELAY_MS);
    };

    private heartbeat = () => {
        if (!this.paused) {
            this.world.onHeartbeat(this.FIXED_TIME_STEP, this.MAX_SUB_STEPS);
        }
    };

    private networkUpdate = () => {
        this.tick++;

        const serverTick: AirHockey.INetworkUpdateEvent = {
            type: 'networkUpdate',
            ...this.world.getTick(),
            tick: this.tick,
        };

        this.postEvent(serverTick);
    };
}
