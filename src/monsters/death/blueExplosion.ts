
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Explosion from "./explostion";
export default class BlueExplosion extends Explosion{

    constructor(game:Game) {
        super(game, 'ship.blue', 'explosion_blue', 6, 35);
    }
    destroy():void{
        this.reset();
    }
}