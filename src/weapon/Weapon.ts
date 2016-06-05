import Group = Phaser.Group;
import Projectile from "./projectile";
import Sprite = Phaser.Sprite;
import Sound = Phaser.Sound;
import Signal = Phaser.Signal;

export default class Weapon extends Group {

    protected level :number = 0;
    protected maxLevel:number = 2;

    protected nextFire:number = 0;
    protected projectileSpeed:number = 1200;
    protected fireRate:number = 300;
    protected projectileAngle:number = 0;
    protected sound:Sound;

    onEnemyKilled:Signal;

    constructor(game:Phaser.Game, name:string, key:string|Function, soundKey:string, maxBullets: number = 30) {
        super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
        this.onEnemyKilled = new Signal();

        this.sound = game.add.sound(soundKey);

        for (var i = 0; i < maxBullets; i++) {
            let projectile = typeof key == 'string' ? new Projectile(game, key) : key();

            projectile.onEnemyKilled.add((args) => this.onEnemyKilled.dispatch(args));
            this.add(projectile, true);
        }
    }

    upgrade(){
        if (this.level !== this.maxLevel){
            this.level++;

            this.forEach(rocket => rocket.setDamagePoints(this.level), this);
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

    protected isActive() {
        return this.level > 0;
    }
}