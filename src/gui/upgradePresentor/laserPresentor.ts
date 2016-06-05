import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import Text = Phaser.Text;
import UpgradePresentor from "./upgradePresentor";
import Ship from "../../ship/ship";
export default class LaserPresentor extends UpgradePresentor {
    constructor(game:Game, x:number, y:number) {
        super(game, x, y, 'LASER', 2, 'laser');
    }
    
    upgrade(ship:Ship) {
        super.upgrade(ship);
        ship.upgradeLaser();
    }
}