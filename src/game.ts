import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
import Weapon from "./weapon/Weapon";
import DoubleBullet from "./weapon/DoubleBullet";
export default class GameLoop extends Phaser.State {
    ship:Ship;
    keys = {Key};
    weapons: Weapon[];

    public create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.weapons = [new Weapon(this.game, 'simpleBullet', 'simpleBullet'), new DoubleBullet(this.game)];
        this.ship = new Ship(this.game);
        this.ship.setWeapon(this.weapons[0]);
    };

    public update() {
        this.ship.update();

        if (this.game.input.keyboard.isDown(Keyboard.ENTER)){
            this.ship.setWeapon(this.weapons[1]);
        }
    };

    public onInputDown() {

    };
}