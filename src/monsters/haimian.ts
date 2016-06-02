import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Image = Phaser.Image;
import Math = Phaser.Math;
import Monster from "./monster";
import Explosion from "./death/explostion";

export default class Haimian extends Monster {
    
    constructor(game:Game, y:number) {
        super(game, 9999, y, 'monsters.haimian', 120);
        this.health = 1;
        this.maxHealth = 1;

        var width = this.game.width + 100;
        let sine = Phaser.Math.sinCosGenerator(width, 30, 1, 15).cos;
        for (let i = 0;  i < width; i++) {
            this.path.push({x: i, y: y + sine[i]});
        }

        this.initializeSprites(game);

        this.animations.add('move', Phaser.Animation.generateFrameNames('haimian_', 1, 5, ".png"), 7, true);
    }

    update(){
        super.update();

        if (!this.animations.currentAnim.isPlaying){
            this.animations.play('move');
        }
    }

    private initializeSprites(game:Game):void {
        game.world.addChild(this);
        game.physics.arcade.enable(this);
        this.scale.set(.9, .9);
    }
}