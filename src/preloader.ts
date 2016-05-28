import Sprite = Phaser.Sprite;

export default class Preloader extends Phaser.State {
    asset:Sprite;
    ready:Boolean = false;

    public preload() {
        this.asset = this.game.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
        this.game.load.setPreloadSprite(this.asset);
        this.game.load.atlasJSONHash('ship', '/assets/ship.png', "/assets/ship.json");
        this.game.load.atlasJSONHash('ship.weapons', '/assets/ship.weapons.png', "/assets/ship.weapons.json");
        this.game.load.image('ship.trail', '/assets/ship.trail.png');

        this.ready = true;
    };

    public loadResources() {
        // load your resources here
    };

    public create() {

    };

    public update() {
        // if (!!this.ready) {
        this.game.state.start('menu');
        // }
    };

    public onLoadComplete() {
        // this.ready = true;
    }
}