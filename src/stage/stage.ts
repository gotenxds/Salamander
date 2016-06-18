import Tilemap = Phaser.Tilemap;
export default class Stage extends Phaser.State {

    private mapId:string;
    private assetsLocation:string;
    private map:Tilemap;
    protected onEvents:StageEvent[] = [];

    // constructor(mapId:string, assetsLocation:string){
    //     super();
    //     this.mapId = mapId;
    //     this.assetsLocation = assetsLocation;
    // }

    preload() {
        // var mapData = this.game.cache.getJSON('map1Data');
        //
        // for (let imgIndex in mapData.tilesets[0].tiles){
        //     let name = mapData.tilesets[0].tiles[imgIndex].image;
        //     this.game.load.image(name, `${this.assetsLocation}/${name}`);
        // }
    }

    create() {
        // this.game.add.group(this.game.world, 'environmentObstacles');
        // this.map = this.game.add.tilemap(this.mapId);
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

    onInputDown() {
        this.game.state.start('game');
    };
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