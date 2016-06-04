
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Sound = Phaser.Sound;
import Projectile from "../../weapon/projectile";
export default class WeaponExplosion extends Sprite{
    constructor(game:Game, tagPrefix:string, frameAmount:number) {
        super(game, -999, -999, 'ship.weapons.explosions');
        this.game.world.add(this);
        
        this.anchor.set(.5,.5);

        this.animations.add('boom', Phaser.Animation.generateFrameNames(`${tagPrefix}_explosion_`, 1, frameAmount), 20);
    }

    explode(source:Projectile, callback:Function = () => {}):void{
        if (!this.animations.currentAnim.isPlaying){
            this.visible = true;
            this.x = source.world.x;
            this.y = source.world.y;
            this.animations.play('boom').onComplete.addOnce(() => {
                callback();
                this.visible = false;
            });
        }
    }
}