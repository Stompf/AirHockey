// import Phaser from 'phaser';
// import { Shared } from 'src/shared';
// import { MAZE_CONSTS } from './constants';
// import { GameMap } from './gameMap';

// export class Player {
//     public score: number = 0;
//     private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
//     private currentDirection: Shared.Direction;

//     constructor(
//         scene: Phaser.Scene,
//         private playerId: string,
//         color: number,
//         cursors: Phaser.Types.Input.Keyboard.CursorKeys
//     ) {
//         this.createPlayerTexture(scene, playerId, color);
//         this.cursors = cursors;
//         this.currentDirection = 'left';
//     }

//     public get DisplayName() {
//         return this.playerId;
//     }

//     public setPosition(
//         startPosition: Shared.Vector2D,
//         direction: Shared.Direction,
//         gameMap: GameMap,
//         scene: Phaser.Scene
//     ) {
//         this.currentDirection = direction;
//         gameMap.setPosition(this.playerId, startPosition, scene);
//     }

//     public onUpdate(paused: boolean) {
//         if (paused) {
//             return;
//         }

//         if (this.cursors.up!.isDown && (paused || this.currentDirection !== 'down')) {
//             this.currentDirection = 'up';
//         } else if (this.cursors.down!.isDown && (paused || this.currentDirection !== 'up')) {
//             this.currentDirection = 'down';
//         } else if (this.cursors.left!.isDown && (paused || this.currentDirection !== 'right')) {
//             this.currentDirection = 'left';
//         } else if (this.cursors.right!.isDown && (paused || this.currentDirection !== 'left')) {
//             this.currentDirection = 'right';
//         }
//     }

//     private createPlayerTexture(scene: Phaser.Scene, playerId: string, color: number) {
//         const graphics = scene.add.graphics();
//         graphics.fillStyle(color);
//         graphics.fillRect(
//             MAZE_CONSTS.playerSize / 2,
//             MAZE_CONSTS.playerSize / 2,
//             MAZE_CONSTS.playerSize,
//             MAZE_CONSTS.playerSize
//         );
//         graphics.setVisible(false);
//         const textureName = `player-${playerId}`;
//         graphics.generateTexture(
//             textureName,
//             MAZE_CONSTS.playerSize * 2,
//             MAZE_CONSTS.playerSize * 2
//         );
//         return textureName;
//     }
// }
