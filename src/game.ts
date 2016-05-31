import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
import Weapon from "./weapon/Weapon";
import DoubleBullet from "./weapon/DoubleBullet";
import Dayanguai from "./monsters/dayanguai";
import Haimian from "./monsters/haimian";
export default class GameLoop extends Phaser.State {
    ship:Ship;
    keys = {Key};
    weapons: Weapon[];
    dayanguai:Dayanguai;
    public create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var y = 700;
        for (let yy = 0; yy < 3; yy++, y -=300){
            var pathPoints = Dayanguai.generatePathPoints(700, y);
            for(var i = 1; i< 5 ; i++){
                var x = i*100 + 700;
                pathPoints.x.unshift(x);
                pathPoints.y.unshift(y);

                new Dayanguai(this.game, x, y, pathPoints);

            }

            new Haimian(this.game, y);
        }

        this.weapons = [new Weapon(this.game, 'simpleBullet', 'simpleBullet'), new DoubleBullet(this.game)];
        this.ship = new Ship(this.game);
        this.ship.setWeapon(this.weapons[0]);
        let loop = this.game.add.sound('mission_1_loop');
        this.game.add.sound('mission_1_intro').play().onStop.addOnce(() =>{
           loop.loopFull();
        });
    };

    public update() {
        this.game.debug.pointer(this.game.input.activePointer);

        if (this.game.input.keyboard.isDown(Keyboard.ENTER)){
            this.ship.setWeapon(this.weapons[1]);
        }
    };
}