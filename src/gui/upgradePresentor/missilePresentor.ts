import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import Text = Phaser.Text;
import Ship from "../../ship/ship";
import UpgradePresentor from "./upgradePresentor";
export default class MissilePresentor extends UpgradePresentor {
   constructor(game:Game, x:number, y:number){
       super(game, x, y, 'MISSILE', 2);
   }

    upgrade(ship:Ship){
        if (!this.maxedOut()){
            ship.upgradeRockets();
        }
        
        super.upgrade(ship);
    }
}