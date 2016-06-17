import Tilemap = Phaser.Tilemap;
export default class Stage extends Phaser.State {

    private mapId:string;
    private assetsLocation:string;
    private map:Tilemap;

    constructor(mapId:string, assetsLocation:string){
        super();
        this.mapId = mapId;
        this.assetsLocation = assetsLocation;
    }

    preload(){
        var mapData = this.game.cache.getJSON('mapData');

        for (let imgIndex in mapData.tilesets[0].tiles){
            let name = mapData.tilesets[0].tiles[imgIndex].image;
            this.game.load.image(name, `${this.assetsLocation}/${name}`);
        }
    }

    create() {
        this.map = this.game.add.tilemap(this.mapId);
    };

    update() {
    };

    onInputDown() {
        this.game.state.start('game');
    };
}