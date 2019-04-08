import { AirHockey } from 'src/shared';
import { IAirHockeyGameOptions, IGoalEvent } from './models';
import { World } from './world';

export class AirHockeyServer {
    public static MAX_PLAYERS = 2;
    public static MIN_PLAYERS = 2;

    public readonly GAME_NAME = 'AirHockey';

    private readonly TIME_LIMIT = 10 * 60 * 1000;
    private readonly FIXED_TIME_STEP = 1 / 20;
    private readonly MAX_SUB_STEPS = 5;
    private readonly SCORE_DELAY_MS = 2000;

    private intervalReference: NodeJS.Timer | undefined;
    private timeLimitReference: NodeJS.Timer | undefined;
    private tick = 0;
    private gameStated: boolean;
    private paused = false;
    private world: World;

    constructor(
        options: IAirHockeyGameOptions,
        private postEvent: (event: AirHockey.ServerToClientGameEvent) => void
    ) {
        if (options.playerIds.length !== 2) {
            throw Error(`Invalid number of players expected 2 got: ${options.playerIds.length}`);
        }

        this.gameStated = false;

        this.listenToEvents(player1Socket);
        this.listenToEvents(player2Socket);

        this.world = new World(player1Socket, player2Socket);
        this.world.goalEmitter.on(this.onGoal);
    }

    public initGame() {
        const gameFound: AirHockey.GameFound = {
            ...this.world.getInit(),
        };

        Logger.log(`${this.GAME_NAME} - starting game id: ${this.gameId}.`);

        this.emitToPlayers('GameFound', gameFound);

        this.intervalReference = setInterval(this.heartbeat, this.FIXED_TIME_STEP);
        this.gameStated = true;

        this.setTimeLimit();
    }

    public stopGame = (forced?: boolean) => {
        Logger.log(
            `${this.GAME_NAME} - stopping game with id: ${this.gameId}.${
                forced === true ? ' forced' : ''
            }`
        );

        this.gameStated = false;

        if (this.intervalReference) {
            clearInterval(this.intervalReference);
        }

        if (this.timeLimitReference) {
            clearTimeout(this.timeLimitReference);
        }

        this.emitToPlayers('GameOver');

        this.world.clear();
        this.removeAllEmitters();
    };

    private setTimeLimit() {
        this.timeLimitReference = setTimeout(() => {
            this.stopGame(true);
        }, this.TIME_LIMIT);
    }

    private onGoal = (goalEvent: IGoalEvent) => {
        this.paused = true;

        goalEvent.teamThatScored.addScore();

        const newGoal: AirHockey.NewGoal = {
            teamLeftScore: goalEvent.allTeams.teamLeft.Score,
            teamRightScore: goalEvent.allTeams.teamRight.Score,
            teamThatScored: goalEvent.teamThatScored.TeamSide,
            timeout: this.SCORE_DELAY_MS,
        };

        this.emitToPlayers('NewGoal', newGoal);

        setTimeout(() => {
            this.world.reset(goalEvent.teamThatScored);
            this.paused = false;
        }, this.SCORE_DELAY_MS);
    };

    private heartbeat = () => {
        this.tick++;

        if (!this.paused) {
            this.world.onHeartbeat(this.FIXED_TIME_STEP, this.MAX_SUB_STEPS);
        }

        const serverTick: AirHockey.ServerTick = {
            ...this.world.getTick(),
            tick: this.tick,
        };

        // winston.info(`heartbeat: ${serverTick.players[0].velocity}`);

        this.emitToPlayers('ServerTick', serverTick);
    };

    private listenToEvents(socket: Socket) {
        this.registerEvent(socket, 'UpdateFromClient', data =>
            this.handleOnPlayerUpdate(socket.id, data)
        );
        this.registerEvent(socket, 'disconnect', this.stopGame);

        // socket.on('UpdateFromClient', (data: AirHockey.UpdateFromClient) => {
        //     this.handleOnPlayerUpdate(socket.id, data);
        // });
        // socket.on('disconnect', this.stopGame);
    }

    private handleOnPlayerUpdate = (id: string, data: AirHockey.UpdateFromClient) => {
        if (!this.gameStated) {
            return;
        }

        this.world.movePlayer(id, data);

        // winston.info(`handleOnPlayerUpdate: ${player.socket.id} : ${data.velocityHorizontal}`);
    };
}
