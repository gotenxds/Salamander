import Sprite = Phaser.Sprite;

export default class Preloader extends Phaser.State {
    asset:Sprite;
    ready:Boolean = false;

    public preload() {
        this.asset = this.game.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
        this.game.load.setPreloadSprite(this.asset);
        this.game.load.atlasJSONHash('ship', '/assets/ship.png', "/assets/ship.json");
        this.game.load.atlasJSONHash('ship.weapons', '/assets/ship.weapons.png', "/assets/ship.weapons.json");
        this.game.load.atlasJSONHash('greenExplosion', '/assets/greenExplosion.png', "/assets/greenExplosion.json");
        this.game.load.atlasJSONHash('ship.blueExplosion', '/assets/ship.blueExplosion.png', "/assets/ship.blueExplosion.json");
        this.game.load.atlasJSONHash('monsters.dayanguai', '/assets/monster_dayanguai.png', "/assets/monster_dayanguai.json");
        this.game.load.atlasJSONHash('monsters.haimian', '/assets/monster_haimian.png', "/assets/monster_haimian.json");
        this.game.load.image('ship.trail', '/assets/ship.trail.png');

        this.game.load.audio('ship.blueExplosion', '/assets/audio/ship.blueExplosion.mp3');
        this.game.load.audio('ship.zidan', '/assets/audio/ship_zidan_sound.mp3');
        this.game.load.audio('mission_1_intro', '/assets/audio/sound-mission-1-intro.mp3');
        this.game.load.audio('mission_1_loop', '/assets/audio/sound-mission-1-loop.mp3');

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