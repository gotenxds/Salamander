import Group = Phaser.Group;
import Sprite = Phaser.Sprite;
import Weapon from "./Weapon";

export default class DoubleBullet extends Weapon{
    constructor(game:Phaser.Game) {
        super(game, 'doubleBullet', 'simpleBullet', 'ship.zidan');
    }

    fire(source:{x:number, y:number}){
        if (this.game.time.time < this.nextFire) {
            return;
        }

        var x = source.x + 140;
        var y = source.y + 35;

        this.sound.play();
        this.getFirstExists(false).fire(x, y, 0, this.projectileSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y-15, 0, this.projectileSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}