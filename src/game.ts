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
import Stage from "./stage/stage";

export default class GameLoop extends Stage {
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

        var upgrades = this.game.add.group(this.game.world, 'upgrades');

        var x =5;
        map1Json.layers
            .filter(layer => layer.type === 'objectgroup')
            .forEach(layer => {
                this.objectLayers[layer.name] = new ObjectLayer(this.game, layer.name, layer.objects, map);
                this.objectLayers[layer.name].xVelocity = -x;
            });
        this.game.add.group(this.game.world, 'monsters');

        this.objectLayers['foreground'].createFromObjects('redAllgy1', allgy =>
           new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi1_', 15));

        this.objectLayers['foreground'].createFromObjects('redAllgy2', allgy =>
           new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi2_', 15));


        this.objectLayers['foreground']
            .getObjectsByName('dayanguai')
            .forEach(mobData => {
               this.addEvent(() => this.objectLayers['foreground'].inBounds(mobData.x, mobData.y), 
                   () =>{
                       let pathPoints = Dayanguai.generatePathPoints(700, mobData.y);
                       pathPoints.x.unshift(this.game.world.width);
                       pathPoints.y.unshift(mobData.y);
                       let dayanguai2 = new Dayanguai(this.game, this.game.world.centerX, this.game.world.centerY, pathPoints);
                       this.game.world.getByName('monsters').add(dayanguai2, false);
                   })
            });


        upgrades.classType = Upgrade;
        upgrades.createMultiple(5, '');
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // let loop = this.game.add.sound('mission_1_loop', .5);
        // this.game.add.sound('mission_1_intro', .5).play().onStop.addOnce(() => {
        //    loop.loopFull();
        // });

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
        super.update();
    };
}