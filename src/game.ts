import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
export default class GameLoop extends Phaser.State {
    ship:Ship;
    keys = {Key};

    public create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.ship = new Ship(this.game);
    };

    public update() {
        this.ship.update();
    };

    public onInputDown() {

    };
}