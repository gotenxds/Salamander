import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Projectile from "./projectile";
import Signal = Phaser.Signal;
import WeaponExplosion from "../monsters/death/weaponExplostion";
import Explosion from "../monsters/death/explostion";
import Tween = Phaser.Tween;
export default class Laser extends Projectile {

    game:Game;
    onEnemyKilled:Signal;
    private explosion :WeaponExplosion;

    constructor(game:Game, level:number) {
        super(game, 'laser_middle', level);
        let rightEnd = this.game.add.sprite(18, 0, 'ship.weapons', 'laser_ends');
        let leftEnd = this.game.add.sprite(-22, 0, 'ship.weapons', 'laser_ends');

        var laserLength = 4;

        this.scale.set(laserLength, 1);
        leftEnd.scale.set(-1/ laserLength, 1);
        rightEnd.scale.set(1/laserLength, 1);
        leftEnd.anchor.set(.5);
        rightEnd.anchor.set(.5);

        this.addChild(rightEnd);
        this.addChild(leftEnd);

        //this.explosion = new WeaponExplosion(game, 'laser', 4);
        //
        //this.events.onKilled.add(() => this.explosion.explode(this));
    }
}