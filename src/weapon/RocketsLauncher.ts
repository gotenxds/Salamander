import Group = Phaser.Group;
import Weapon from "./Weapon";
import Sprite = Phaser.Sprite;
import Rocket from "./rocket";

export default class RocketsLauncher extends Weapon{
    private level :number = 0;
    private maxLevel:number = 2;
    private projectileAngle:number = 45;
    
    constructor(game:Phaser.Game) {
        super(game, 'rocketsLauncher', () => new Rocket(game, this.level), 'ship.rocket', 10);
        this.projectileSpeed = 600;
        this.fireRate = 1500;
    }
    
    upgrade(){
        if (this.level !== this.maxLevel){
            this.level++;
            
            this.forEach(rocket => rocket.setDamagePoints(this.level), this);
        }
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

    private isActive() {
        return this.level > 0;
    }
}