import Sprite = Phaser.Sprite;
import Ship from "./ship/ship";
import Weapon from "./weapon/Weapon";
import Dayanguai from "./monsters/dayanguai";
import Haimian from "./monsters/haimian";
import EnvironmentObstacle from "./stage/enviromentObstacle";
import Stage from "./stage/stage";
import Keyboard = Phaser.Keyboard;
import Key = Phaser.Key;
import Point = Phaser.Point;
import DayanguaiGroup from "./monsters/dayanguaiGroup";

export default class FirstStage extends Stage {
    
    ship:Ship;
    keys = {Key};
    weapons:Weapon[];
    dayanguai:Dayanguai;

    public create() {
        super.create();
        
        this.ship.spawn();
    };

    protected createMonsters() {
        this.objectLayers['foreground']
            .getObjectsByName('dayanguai')
            .forEach(mobData => {
                this.addEvent(() => this.objectLayers['foreground'].inBounds(mobData.x, mobData.y),
                    () => new DayanguaiGroup(this.game, mobData.y))
            });
        this.objectLayers['foreground']
            .getObjectsByName('haimian')
            .forEach(mobData => {
                this.addEvent(() => this.objectLayers['foreground'].inBounds(mobData.x, mobData.y),
                    () => this.game.world.getByName('monsters').add(new Haimian(this.game, mobData.y), false))
            });
    }

    protected createEnvironment() {
        this.objectLayers['foreground'].createFromObjects('redAllgy1', allgy =>
            new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi1_', 15));

        this.objectLayers['foreground'].createFromObjects('redAllgy2', allgy =>
            new EnvironmentObstacle(this.game, allgy, 'stage1Environment', 'roubi2_', 15));
    }

    protected playStageMusic() {
         let loop = this.game.add.sound('mission_1_loop', .5);
         this.game.add.sound('mission_1_intro', .5).play().onStop.addOnce(() => {
            loop.loopFull();
         });
    }

    public update() {
        super.update();
    };
}