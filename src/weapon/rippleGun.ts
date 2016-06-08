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
    
    fire(source:{x:number, y:number, width:number, height:number}){
        if (this.isActive()){
            if (this.game.time.time < this.nextFire) {
                return;
            }
            
            this.sound.play();
            
            var x = source.x;
            var y = source.y - source.height/2;
            
            this.getFirstExists(false).fire(x, y, this.projectileAngle, this.projectileSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, -this.projectileAngle, this.projectileSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;
        }
    }
}