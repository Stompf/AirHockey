import p2 from 'p2';
import logger from 'src/server/logger';
import { AirHockey, Omit, Shared } from 'src/shared';
import { TypedEvent } from '../common';
import { Ball } from './ball';
import { IGoal, IGoalEvent, ITeams } from './models';
import { Player } from './player';
import { Team } from './team';

export class World {
    public goalEmitter: TypedEvent<IGoalEvent>;
    private readonly BALL_INIT_VELOCITY = 10;
    private readonly GAME_SIZE: Readonly<Shared.Size> = { width: 1200, height: 600 };
    private goals: IGoal[] = [];
    private p2World: p2.World;

    private players: Player[];
    private ball: Ball;

    private teamLeft: Team;
    private teamRight: Team;

    constructor(player1Id: Shared.Id, player2Id: Shared.Id) {
        this.goalEmitter = new TypedEvent();

        this.p2World = new p2.World({ gravity: [0, 0] });
        this.p2World.defaultContactMaterial.restitution = 1;
        this.p2World.defaultContactMaterial.friction = 0;
        this.addWorldBounds(this.p2World);

        this.teamLeft = new Team('left');
        this.teamRight = new Team('right');
        const player1 = new Player(this.p2World, player1Id, 0xff0000, this.teamLeft);
        const player2 = new Player(this.p2World, player2Id, 0x0000ff, this.teamRight);
        this.players = [player1, player2];
        this.ball = new Ball(this.p2World);

        const goal1 = this.addGoals(this.teamLeft);
        const goal2 = this.addGoals(this.teamRight);
        this.goals = [goal1, goal2];

        this.resetPositions();

        this.onBeginContact(this.p2World);
    }

    public clear() {
        this.p2World.clear();
        this.goalEmitter.removeAllListeners();

        // this.players.forEach(p => {
        //     if (p.socket.connected) {
        //         p.socket.disconnect(true);
        //     }
        // });
    }

    public reset(teamThatScored?: Team) {
        this.resetPositions(teamThatScored);
    }

    public onHeartbeat(timeStep: number, maxSubSteps: number) {
        this.ball.onUpdate();
        this.p2World.step(timeStep, timeStep, maxSubSteps);
    }

    public getTick(): Omit<AirHockey.INetworkUpdateEvent, 'type' | 'tick'> {
        return {
            players: this.players.map(p => p.toUpdateNetworkPlayerPlayer()),
            ball: this.ball.toBallUpdate(),
        };
    }

    public getInit(): Omit<AirHockey.IGameLoadingEvent, 'type'> {
        return {
            physicsOptions: {
                gravity: this.p2World.gravity,
                restitution: this.p2World.defaultContactMaterial.restitution,
            },
            players: this.players.map(p => p.toNewNetworkPlayer()),
            gameSize: this.GAME_SIZE,
            ball: {
                color: Ball.COLOR,
                diameter: Ball.DIAMETER,
                mass: Ball.MASS,
                maxVelocity: Ball.MAX_VELOCITY,
                position: this.ball.getPosition(),
            },
            goals: this.goals.map(this.mapToGoalOptions),
        };
    }

    public movePlayer(id: Shared.Id, data: AirHockey.IPlayerDirectionUpdate) {
        const player = this.players.find(p => p.socketId === id);
        if (!player) {
            logger.info(`movePlayer - got info about player not in game.`);
            return;
        }

        player.moveRight(data.direction.directionX * Player.SPEED);
        player.moveUp(data.direction.directionY * Player.SPEED);
    }

    public setPlayerReady(id: Shared.Id): boolean {
        const player = this.players.find(p => p.socketId === id);
        if (!player) {
            logger.info(`setPlayerReady - got info about player not in game.`);
            return false;
        }

        player.isReady = true;

        return this.players.every(p => p.isReady);
    }

    private getTeams(): ITeams {
        return { teamLeft: this.teamLeft, teamRight: this.teamRight };
    }

    private addWorldBounds(world: p2.World) {
        const floor = new p2.Body({
            position: [0, 0],
        });
        floor.addShape(new p2.Plane());
        world.addBody(floor);

        const ceiling = new p2.Body({
            angle: Math.PI,
            position: [0, this.GAME_SIZE.height],
        });
        ceiling.addShape(new p2.Plane());
        world.addBody(ceiling);

        const right = new p2.Body({
            angle: Math.PI / 2,
            position: [this.GAME_SIZE.width, 0],
        });
        right.addShape(new p2.Plane());
        world.addBody(right);

        const left = new p2.Body({
            angle: (3 * Math.PI) / 2,
            position: [0, 0],
        });
        left.addShape(new p2.Plane());
        world.addBody(left);
    }

    private onBeginContact(world: p2.World) {
        world.on(
            'beginContact',
            (evt: typeof world.beginContactEvent) => {
                let team: Team | null = null;
                if (evt.bodyA === this.goals[0].goal || evt.bodyB === this.goals[0].goal) {
                    team = this.teamRight;
                } else if (evt.bodyA === this.goals[1].goal || evt.bodyB === this.goals[1].goal) {
                    team = this.teamLeft;
                }

                if (
                    team != null &&
                    (evt.bodyA === this.ball.body || evt.bodyB === this.ball.body)
                ) {
                    logger.info(`${team.TeamSide} GOAL!`);

                    const goalEvent: IGoalEvent = {
                        allTeams: this.getTeams(),
                        teamThatScored: team,
                    };
                    this.goalEmitter.emit(goalEvent);
                }
            },
            this
        );

        // this.world.on('impact', () => {
        //     winston.info(`impact: ${this.ball.body.velocity[0]} : ${this.ball.body.velocity[1]}`);
        // }, this);

        // this.world.on('endContact', () => {
        //     winston.info(`endContact: ${this.ball.body.velocity[0]} : ${this.ball.body.velocity[1]} : ${this.ball.body.angularVelocity} `);

        //     this.ballTick++;
        //     const ballUpdate = this.ball.toBallUpdate(this.ballTick);

        //     this.player1.socket.emit('BallUpdate', ballUpdate);
        //     this.player2.socket.emit('BallUpdate', ballUpdate);
        // }, this);
    }

    private resetPositions(scoreTeam?: Team) {
        this.players[0].setPosition({
            x: this.GAME_SIZE.width / 4,
            y: this.GAME_SIZE.height / 2,
        });

        this.players[1].setPosition({
            x: this.GAME_SIZE.width / 1.25 - Player.DIAMETER,
            y: this.GAME_SIZE.height / 2,
        });

        this.ball.setPosition({
            x: this.GAME_SIZE.width / 2,
            y: this.GAME_SIZE.height / 2,
        });

        if (scoreTeam) {
            this.ball.resetVelocity(
                scoreTeam === this.teamLeft ? this.BALL_INIT_VELOCITY : -this.BALL_INIT_VELOCITY
            );
        }
    }

    private addGoals(team: Team) {
        const goalWidth = 20;
        const goalHeight = 125;
        const goalNetSize = 30;

        let x = this.GAME_SIZE.width / 10;
        if (team.TeamSide === 'right') {
            x = this.GAME_SIZE.width - x;
        }

        const top = new p2.Body();
        top.addShape(
            new p2.Box({
                height: goalNetSize,
                width: goalWidth,
            })
        );
        top.position = [x, this.GAME_SIZE.height / 2 - goalHeight / 2 - goalNetSize / 2];

        const bottom = new p2.Body();
        bottom.addShape(
            new p2.Box({
                height: goalNetSize,
                width: goalWidth,
            })
        );
        bottom.position = [x, this.GAME_SIZE.height / 2 + goalHeight / 2 + goalNetSize / 2];

        const back = new p2.Body();
        back.addShape(
            new p2.Box({
                height: goalHeight + goalNetSize * 2,
                width: goalNetSize,
            })
        );
        const offset = goalWidth / 2 + goalNetSize / 2;
        back.position = [
            x - (team.TeamSide === 'left' ? offset : -offset),
            this.GAME_SIZE.height / 2,
        ];

        this.p2World.addBody(top);
        this.p2World.addBody(bottom);
        this.p2World.addBody(back);

        top.type = p2.Body.STATIC;
        bottom.type = p2.Body.STATIC;
        back.type = p2.Body.STATIC;

        const goal = new p2.Body();
        goal.addShape(
            new p2.Box({
                height: goalHeight,
                width: goalWidth,
            })
        );
        goal.position = [x, this.GAME_SIZE.height / 2];
        goal.type = p2.Body.STATIC;
        this.p2World.addBody(goal);

        return {
            back,
            bottom,
            top,
            goal,
        };
    }

    private mapToGoalOptions = (goal: IGoal): AirHockey.IGoalOptions => {
        return {
            back: this.mapToPositionWithBox(goal.back),
            bottom: this.mapToPositionWithBox(goal.bottom),
            goal: this.mapToPositionWithBox(goal.goal),
            top: this.mapToPositionWithBox(goal.top),
        };
    };

    private mapToPositionWithBox(body: p2.Body): AirHockey.IPositionWithBox {
        const box = body.shapes[0] as p2.Box;
        return {
            height: box.height,
            width: box.width,
            x: body.position[0],
            y: body.position[1],
        };
    }
}
