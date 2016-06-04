import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Projectile from "./projectile";
import Signal = Phaser.Signal;
import WeaponExplosion from "../monsters/death/weaponExplostion";
import Explosion from "../monsters/death/explostion";
export default class Rocket extends Projectile {

    game:Game;
    onEnemyKilled:Signal;
    private explosion :WeaponExplosion;

    constructor(game:Game, level:number) {
        super(game, 'rocket', level);

        this.explosion = new WeaponExplosion(game, 'rocket', 5);

        this.scale.set(.8);
        
        this.events.onKilled.add(() => this.explosion.explode(this));
    }
}