import Group = Phaser.Group;
import projectile from "./projectile";
import Projectile from "./projectile";
import Sprite = Phaser.Sprite;
import Sound = Phaser.Sound;

export default class Weapon extends Group {
    nextFire:number = 0;
    projectileSpeed:number = 800;
    fireRate:number = 300;
    sound:Sound;

    constructor(game:Phaser.Game, name:string, projectile:string, maxBullets: number = 30) {
        super(game, game.world, name, false, true, Phaser.Physics.ARCADE);

        this.sound = game.add.sound('ship.zidan');

        for (var i = 0; i < maxBullets; i++) {
            this.add(new Projectile(game, projectile), true);
        }
    }

    fire(source:Sprite){

        if (this.game.time.time < this.nextFire) {
            return;
        }

        this.sound.play();
        var x = source.body.x + 140;
        var y = source.body.y + 35;

        this.getFirstExists(false).fire(x, y, 0, this.projectileSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}