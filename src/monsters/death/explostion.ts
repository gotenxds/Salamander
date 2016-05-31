
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Sound = Phaser.Sound;
export default class Explosion{
    aperture:Sprite;
    smoke:Sprite;
    sound:Sound;
    constructor(game:Game, spritePrefix:string, tagPrefix:string, apertureAmount:number, smokeAmount:number) {
        let spriteName = `${spritePrefix}Explosion`;
        this.aperture = game.add.sprite(-999, -999, spriteName);
        this.smoke = game.add.sprite(-999, -999, spriteName);

        this.aperture.anchor.set(.5,.5);
        this.smoke.anchor.set(.5,.5);

        this.aperture.animations.add('boom', Phaser.Animation.generateFrameNames(`${tagPrefix}_aperture_`, 1, apertureAmount, '.png'), 20);
        this.smoke.animations.add('boom', Phaser.Animation.generateFrameNames(`${tagPrefix}_smoke_`, 1, smokeAmount, '.png'), 15);

        this.sound = game.add.sound(spriteName);
    }

    play(source:{x:number,y:number}, callback:Function = () => {}):void{
        if (!this.smoke.animations.currentAnim.isPlaying){
            if (this.sound && !this.sound.isPlaying){
                this.sound.play();
            }
            this.aperture.x = source.x;
            this.aperture.y = source.y;
            this.smoke.x = source.x;
            this.smoke.y = source.y;
            this.aperture.animations.play('boom').onComplete.addOnce(() => this.aperture.visible = false);
            this.smoke.animations.play('boom').onComplete.addOnce(() => {
                callback();
                this.destroy();
            });
        }
    }

    protected reset() :void{
        this.aperture.position.set(-999, -999);
        this.smoke.position.set(-999, -999);
    }

    destroy():void{
        this.aperture.destroy();
        this.smoke.destroy();
    }
}