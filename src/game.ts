import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
import Weapon from "./weapon/Weapon";
import DoubleBullet from "./weapon/DoubleBullet";
import Dayanguai from "./monsters/dayanguai";
import Haimian from "./monsters/haimian";
import NineImage from "./utils/NineImage";
import SinglePLayerGUI from "./gui/singlePLayerGUI";
export default class GameLoop extends Phaser.State {
    ship:Ship;
    keys = {Key};
    gui:SinglePLayerGUI;
    weapons:Weapon[];
    dayanguai:Dayanguai;

    public create() {
        this.game.add.group(this.game.world, 'monsters');

        this.ship = new Ship(this.game);
        this.gui = new SinglePLayerGUI(this.game);

        this.ship.onEnemyKilled.add(args => this.gui.addToScore(90));

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        let monsters = this.game.world.getByName('monsters');
        var y = 700;
        for (let yy = 0; yy < 3; yy++, y -= 300) {
            var pathPoints = Dayanguai.generatePathPoints(700, y);
            for (var i = 1; i < 5; i++) {
                var x = i * 100 + 700;
                pathPoints.x.unshift(x);
                pathPoints.y.unshift(y);


                monsters.add(new Dayanguai(this.game, x, y, pathPoints), false);
            }

            monsters.add(new Haimian(this.game, y), false);
        }


  /*      let loop = this.game.add.sound('mission_1_loop', .5);
        this.game.add.sound('mission_1_intro', .5).play().onStop.addOnce(() => {
            loop.loopFull();
        });*/

        this.ship.spawn();
    };

    public update() {
        this.game.debug.pointer(this.game.input.activePointer);
    };
}