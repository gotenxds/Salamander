import Group = Phaser.Group;
import Weapon from "./Weapon";
import Sprite = Phaser.Sprite;
import Ripple from "./ripple";
import Laser from "./laser";

export default class LaserGun extends Weapon{
    
    constructor(game:Phaser.Game) {
        super(game, 'laserGun', () => new Laser(game, this.level), 'ship.laser', 10);
        this.projectileSpeed = 2000;
        this.fireRate = 500;
        this.maxLevel = 2;
    }


    fire(source:{x:number, y:number, width:number, height:number}):undefined {
        source.x += source.width/2;
        source.y -= source.height/2;

        return super.fire(source);
    }
}