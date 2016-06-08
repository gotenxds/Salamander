import Group = Phaser.Group;
import Weapon from "./Weapon";
import Sprite = Phaser.Sprite;
import Rocket from "./rocket";

export default class RocketsLauncher extends Weapon{
    
    constructor(game:Phaser.Game) {
        super(game, 'rocketsLauncher', () => new Rocket(game, this.level), 'ship.rocket', 10);
        this.projectileSpeed = 600;
        this.fireRate = 1500;
        this.projectileAngle = 45;
        this.maxLevel = 2;
    }
    
    fire(source:{x:number, y:number, width:number, height:number}){
        if (this.isActive()){
            if (this.game.time.time < this.nextFire) {
                return;
            }
            
            this.sound.play();
            
            var x = source.x - source.width/2;
            var y = source.y;
            
            this.getFirstExists(false).fire(x, y, this.projectileAngle, this.projectileSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, -this.projectileAngle, this.projectileSpeed, 0, 0);

            this.nextFire = this.game.time.time + this.fireRate;
        }
    }
}