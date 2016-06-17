import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Weapon from "./weapon/Weapon";
import Dayanguai from "./monsters/dayanguai";
import SinglePlayerGUI from "./gui/singlePLayerGUI";
import Upgrade from "./upgrades/upgrade";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
import Haimian from "./monsters/haimian";
import UpgradeCoutner from "./gui/upgradeCounter";
import Option from "./ship/option/option";
import Point = Phaser.Point;
import ObjectLayer from "./stage/objectLayer";
import PlayerGUI from "./gui/PlayerGUI";
import EnvironmentObstacle from "./stage/enviromentObstacle";

export default class GameLoop extends Phaser.State {
    ship:Ship;
    keys = {Key};
    gui:SinglePlayerGUI;
    upgradeCounter:UpgradeCoutner;
    weapons:Weapon[];
    dayanguai:Dayanguai;
    objectLayers:{[key:string]:ObjectLayer} = {};

    public create() {
        
        var map = this.game.add.tilemap('map1');
        var map1Json = this.cache.getJSON('map1Data');

        this.game.add.group(this.game.world, 'monsters');
        var upgrades = this.game.add.group(this.game.world, 'upgrades');

        var x =5;
        map1Json.layers
            .filter(layer => layer.type === 'objectgroup')
            .forEach(layer => {
                this.objectLayers[layer.name] = new ObjectLayer(this.game, layer.name, layer.objects, map);
                this.objectLayers[layer.name].xVelocity = -x;
            });

        this.objectLayers['foreground'].createFromObjects('redAllgy1', allgy =>
           new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi1_', 15));

        this.objectLayers['foreground'].createFromObjects('redAllgy2', allgy =>
           new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi2_', 15));


        upgrades.classType = Upgrade;
        // upgrades.createMultiple(5, '');
        //
        // this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //
        // let monsters = this.game.world.getByName('monsters');
        // var y = 700;
        // for (let yy = 0; yy < 3; yy++, y -= 300) {
        //     var pathPoints = Dayanguai.generatePathPoints(700, y);
        //     for (var i = 1; i < 5; i++) {
        //         var x = i * 100 + 700;
        //         pathPoints.x.unshift(x);
        //         pathPoints.y.unshift(y);
        //
        //         monsters.add(new Dayanguai(this.game, x, y, pathPoints), false);
        //     }
        //
        //     monsters.add(new Haimian(this.game, y), false);
        // }

        //let loop = this.game.add.sound('mission_1_loop', .5);
        //this.game.add.sound('mission_1_intro', .5).play().onStop.addOnce(() => {
        //    loop.loopFull();
        //});

        this.ship = new Ship(this.game);
        new PlayerGUI(this.game, this.ship);
        this.ship.spawn();
            this.ship.addOption();
            this.ship.addOption();
            this.ship.addOption();

        this.gui = new SinglePlayerGUI(this.game);
        this.upgradeCounter = new UpgradeCoutner(this.game, this.ship);
    };

    public update() {
    };
}