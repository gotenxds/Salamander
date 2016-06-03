import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import Text = Phaser.Text;
export default class UpgradePresentor extends Sprite {
    static WIDTH:number = 131;

    text:Text;
    
    constructor(game:Game, x:number, y:number, name:string) {
        super(game, x, y, 'upgradePresentor', 'unselected');
        game.world.add(this);
        
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
}