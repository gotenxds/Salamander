
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
export default class GreenExplotion{
    apeture:Sprite;
    smoke:Sprite;
    constructor(game:Game) {
        this.apeture = game.add.sprite(-999, -999, 'greenExplosion');
        this.smoke = game.add.sprite(-999, -999, 'greenExplosion');

        this.apeture.anchor.set(.5,.5);
        this.smoke.anchor.set(.5,.5);

        this.apeture.animations.add('boom', Phaser.Animation.generateFrameNames('green_apature_', 1, 6, '.png'), 20);
        this.smoke.animations.add('boom', Phaser.Animation.generateFrameNames('green_smoke_', 1, 33, '.png'), 15);
    }

    play(source:{x:number,y:number}, callback:Function):void{
        if (!this.smoke.animations.currentAnim.isPlaying){
            this.apeture.x = source.x;
            this.apeture.y = source.y;
            this.smoke.x = source.x;
            this.smoke.y = source.y;
            this.apeture.animations.play('boom').onComplete.addOnce(() => this.apeture.visible = false);
            this.smoke.animations.play('boom').onComplete.addOnce(() => {
                callback();
                this.destroy();
            });
        }
    }

    destroy():void{
        this.apeture.destroy();
        this.smoke.destroy();
    }
}