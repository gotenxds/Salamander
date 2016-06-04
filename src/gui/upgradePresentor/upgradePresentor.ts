import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import Text = Phaser.Text;
import Ship from "../../ship/ship";
abstract class UpgradePresentor extends Sprite {
    static WIDTH:number = 131;

    text:Text;
    level:number = 0;
    maxLevel:number;
    
    constructor(game:Game, x:number, y:number, name:string, maxLevel:number) {
        super(game, x, y, 'upgradePresentor', 'unselected');
        game.world.add(this);
        
        this.maxLevel = maxLevel;
        this.text = this.game.add.text(this.width/2, this.height/2 + 3, name, {font: 'good_timesregular', fontSize :15, fill:'#FFFFFF', stroke:'#1391eb', strokeThickness:2});
        this.text.anchor.set(.5,.5);
        
        this.addChild(this.text);
    }

    select(){
        this.frameName = 'selected';
    }

    deSelect(){
        this.frameName = 'unselected';
    }

    upgrade(ship:Ship){
        this.level++;
        this.disableIfMaxedOut();
    }
    
    protected maxedOut(){
        return this.level === this.maxLevel;
    }
    
    private disableIfMaxedOut(){
        if (this.maxedOut()){
            this.text.visible = false;
        }
    }
}
export default UpgradePresentor;