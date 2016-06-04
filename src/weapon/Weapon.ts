import Group = Phaser.Group;
import Projectile from "./projectile";
import Sprite = Phaser.Sprite;
import Sound = Phaser.Sound;
import Signal = Phaser.Signal;

export default class Weapon extends Group {
    protected nextFire:number = 0;
    protected projectileSpeed:number = 1200;
    protected fireRate:number = 300;
    protected sound:Sound;
    onEnemyKilled:Signal;

    constructor(game:Phaser.Game, name:string, key:string|Function, maxBullets: number = 30) {
        super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
        this.onEnemyKilled = new Signal();

        this.sound = game.add.sound('ship.zidan');

        for (var i = 0; i < maxBullets; i++) {
            let projectile = typeof key == 'string' ? new Projectile(game, key) : key();

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