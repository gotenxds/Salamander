import Group = Phaser.Group;
import Weapon from "./Weapon";
import Sprite = Phaser.Sprite;
import Ripple from "./ripple";

export default class RippleGun extends Weapon{
    
    constructor(game:Phaser.Game) {
        super(game, 'rippleGun', () => new Ripple(game, this.level), 'ship.ripple', 10);
        this.projectileSpeed = 600;
        this.fireRate = 1000;
        this.maxLevel = 2;
    }
    
    fire(source:{x:number, y:number}){
        if (this.isActive()){
            if (this.game.time.time < this.nextFire) {
                return;
            }
            
            this.sound.play();
            
            var x = source.x + 40;
            var y = source.y + 30;
            
            this.getFirstExists(false).fire(x, y, this.projectileAngle, this.projectileSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, -this.projectileAngle, this.projectileSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;
        }
    }
}