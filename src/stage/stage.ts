import Tilemap = Phaser.Tilemap;
import Group = Phaser.Group;
import Upgrade from "../upgrades/upgrade";
import ObjectLayer from "./objectLayer";
import PlayerGUI from "../gui/PlayerGUI";
import Ship from "../ship/ship";
abstract class Stage extends Phaser.State {

    private mapId:string;
    private assetsLocation:string;

    protected mapData;
    protected map:Tilemap;
    protected onEvents:StageEvent[] = [];
    protected monsters:Group;
    protected upgrades:Group;
    protected objectLayers:{[key:string]:ObjectLayer} = {};
    protected playerGUI:PlayerGUI;
    protected ship:Ship;


    constructor(mapId:string, assetsLocation:string){
        super();
        this.mapId = mapId;
        this.assetsLocation = assetsLocation;
    }

    preload() {
        this.mapData = this.game.cache.getJSON(`${this.mapId}Data`);
        
        for (let imgIndex in this.mapData.tilesets[0].tiles){
            let name = this.mapData.tilesets[0].tiles[imgIndex].image;
            this.game.load.image(name, `${this.assetsLocation}/${name}`);
        }
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.monsters = this.game.add.group(this.game.world, 'monsters');
        this.upgrades = this.game.add.group(this.game.world, 'upgrades');
        this.map = this.game.add.tilemap(this.mapId);

        this.upgrades.classType = Upgrade;
        this.upgrades.createMultiple(5, '');

        this.createObjectLayers();
        this.createEnvironment();
        this.createMonsters();
        this.playStageMusic();
        
        this.game.world.bringToTop(this.monsters);
        this.game.world.bringToTop(this.upgrades);

        this.ship = new Ship(this.game);
        this.playerGUI = new PlayerGUI(this.game, this.ship);
    };

    update() {
        this.activateEvents();
    };

    private activateEvents() {
        let index = this.onEvents.length;

        while (index--) {
            let onEvent = this.onEvents[index];

            if (onEvent.predicate()) {
                onEvent.call();

                if (onEvent.once) {
                    this.onEvents.splice(index, 1);
                }
            }
        }
    }

    addEvent(predicate:()=>boolean, call:()=>any, once:boolean = true) {
        this.onEvents.push(new StageEvent(predicate, call, once))
    }

    protected createObjectLayers() {
        var x = 5;
        this.mapData.layers
            .filter(layer => layer.type === 'objectgroup')
            .forEach(layer => {
                this.objectLayers[layer.name] = new ObjectLayer(this.game, layer.name, layer.objects, this.map);
                this.objectLayers[layer.name].xVelocity = -x;
            });
    }

    protected abstract createMonsters();

    protected abstract createEnvironment();

    protected abstract playStageMusic();
}

class StageEvent {
    predicate:()=>boolean;
    call:()=>any;
    once:boolean;

    constructor(predicate:()=>boolean, call:()=>any, once:boolean) {
        this.predicate = predicate;
        this.call = call;
        this.once = once;
    }
}

export default Stage;