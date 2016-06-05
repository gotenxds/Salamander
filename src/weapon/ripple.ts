import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Projectile from "./projectile";
import Signal = Phaser.Signal;
import WeaponExplosion from "../monsters/death/weaponExplostion";
import Explosion from "../monsters/death/explostion";
import Tween = Phaser.Tween;
export default class Rocket extends Projectile {

    game:Game;
    onEnemyKilled:Signal;
    private explosion :WeaponExplosion;
    private growTween:Tween;

    constructor(game:Game, level:number) {
        super(game, 'ripple', level);
        this.scale.set(.1);

        this.explosion = new WeaponExplosion(game, 'ripple', 4);
        
        this.events.onKilled.add(() => this.explosion.explode(this));
    }

    fire(x, y, angle, speed, gx, gy) : void{
        super.fire(x, y, angle, speed, gx, gy);
        this.growTween = this.game.add.tween(this.scale).to({x:2,y:2}, 5000, Phaser.Easing.Linear.None, false, 0, 0, false).start();
    }
    
    kill(){
        super.kill();
        this.growTween.stop();
        this.scale.set(.1);
    }
}