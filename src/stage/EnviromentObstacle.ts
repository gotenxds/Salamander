import Sprite = Phaser.Sprite;
import Game = Phaser.Game;

export default class EnvironmentObstacle extends Sprite{
    constructor(game:Game, objectData, key:string, frame:string, numberOfFrames:number){
        super(game, objectData.x, objectData.y, key);
        this.game.physics.arcade.enable(this);

        this.animations.add('default', Phaser.Animation.generateFrameNames(frame, 1, numberOfFrames), 10, true).play();

    }
}