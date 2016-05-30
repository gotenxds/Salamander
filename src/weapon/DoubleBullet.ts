import Group = Phaser.Group;
import projectile from "./projectile";
import Projectile from "./projectile";
import Sprite = Phaser.Sprite;
import Weapon from "./Weapon";

export default class DoubleBullet extends Weapon{
    constructor(game:Phaser.Game) {
        super(game, 'doubleBullet', 'simpleBullet', 30);
    }

    fire(source:Sprite){
        if (this.game.time.time < this.nextFire) {
            return;
        }

        var x = source.body.x + 140;
        var y = source.body.y + 35;

        this.sound.play();
        this.getFirstExists(false).fire(x, y, 0, this.projectileSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y-15, 0, this.projectileSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}