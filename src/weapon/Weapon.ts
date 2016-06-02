import Group = Phaser.Group;
import projectile from "./projectile";
import Projectile from "./projectile";
import Sprite = Phaser.Sprite;
import Sound = Phaser.Sound;
import Signal = Phaser.Signal;

export default class Weapon extends Group {
    private nextFire:number = 0;
    private projectileSpeed:number = 1200;
    private fireRate:number = 300;
    private sound:Sound;
    onEnemyKilled:Signal;

    constructor(game:Phaser.Game, name:string, key:string, maxBullets: number = 30) {
        super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
        this.onEnemyKilled = new Signal();

        this.sound = game.add.sound('ship.zidan');

        for (var i = 0; i < maxBullets; i++) {
            let projectile = new Projectile(game, key);

            projectile.onEnemyKilled.add((args) => this.onEnemyKilled.dispatch(args));
            this.add(projectile, true);
        }
    }

    fire(source:{x:number, y:number}){

        if (this.game.time.time < this.nextFire) {
            return;
        }

        this.sound.play();
        var x = source.x;
        var y = source.y;

        this.getFirstExists(false).fire(x, y, 0, this.projectileSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}