import Sprite = Phaser.Sprite;

export default class Preloader extends Phaser.State {
    asset:Sprite;
    ready:Boolean = false;

    public preload() {
        this.asset = this.game.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
        this.game.load.setPreloadSprite(this.asset);
        this.game.load.atlasJSONHash('ship', '/assets/ship.png', "/assets/ship.json");
        this.game.load.atlasJSONHash('ship.weapons', '/assets/ship.weapons.png', "/assets/ship.weapons.json");
        this.game.load.atlasJSONHash('ship.weapons.explosions', '/assets/ship.weapons.explosions.png', "/assets/ship.weapons.explosions.json");
        this.game.load.atlasJSONHash('greenExplosion', '/assets/greenExplosion.png', "/assets/greenExplosion.json");
        this.game.load.atlasJSONHash('ship.blueExplosion', '/assets/ship.blueExplosion.png', "/assets/ship.blueExplosion.json");
        this.game.load.atlasJSONHash('monsters.dayanguai', '/assets/monster_dayanguai.png', "/assets/monster_dayanguai.json");
        this.game.load.atlasJSONHash('monsters.haimian', '/assets/monster_haimian.png', "/assets/monster_haimian.json");
        this.game.load.atlasJSONHash('score_numbers', '/assets/score_numbers.png','/assets/score_numbers.json');
        this.game.load.atlasJSONHash('points_numbers', '/assets/points_numbers.png','/assets/points_numbers.json');
        this.game.load.atlasJSONHash('upgrades', '/assets/upgrades.png','/assets/upgrades.json');

        this.game.load.image('ship.trail', '/assets/ship.trail.png');
        this.game.load.image('playerPanel', '/assets/player_panel.png');
        this.game.load.image('playerIconBackground', '/assets/player_icon_background.png');
        this.game.load.image('player1_icon', '/assets/player1_icon.png');
        this.game.load.image('lives_icon', '/assets/lives_icon.png');
        this.game.load.image('lives_X', '/assets/lives_X.png');

        this.game.load.atlasJSONHash('upgradePresentor', '/assets/upgrade_presentor.png','/assets/upgrade_presentor.json');
        this.game.load.image('upgradeCounterLeft', '/assets/upgrade_counter_left.png');
        this.game.load.image('upgradeCounterRight', '/assets/upgrade_counter_right.png');

        this.game.load.audio('ship.blueExplosion', '/assets/audio/ship.blueExplosion.mp3');
        this.game.load.audio('ship.zidan', '/assets/audio/ship_zidan_sound.mp3');
        this.game.load.audio('ship.rocket', '/assets/audio/ship_rocket_sound.mp3');
        this.game.load.audio('ship.ripple', '/assets/audio/ship_ripple_sound.mp3');
        this.game.load.audio('ship.laser', '/assets/audio/ship_laser_sound.mp3');
        this.game.load.audio('mission_1_intro', '/assets/audio/sound-mission-1-intro.mp3');
        this.game.load.audio('mission_1_loop', '/assets/audio/sound-mission-1-loop.mp3');
        this.game.load.audio('ship.pickupUpgrade', '/assets/audio/ship_pickup_upgrade.mp3');
        this.game.load.audio('upgrade', '/assets/audio/upgrades/upgrade.mp3');
        this.game.load.audio('upgrade_missile', '/assets/audio/upgrades/upgrade_missile.mp3');
        this.game.load.audio('upgrade_ripple', '/assets/audio/upgrades/upgrade_ripple.mp3');
        this.game.load.audio('upgrade_laser', '/assets/audio/upgrades/upgrade_laser.mp3');
        this.game.load.audio('upgrade_option', '/assets/audio/upgrades/upgrade_option.mp3');
        this.game.load.audio('upgrade_force', '/assets/audio/upgrades/upgrade_force.mp3');

        this.game.load.tilemap('map1', '/assets/stages/1/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.atlasJSONHash('stage1Environment', '/assets/stages/1/stage1_roubi.png','/assets/stages/1/stage1_roubi.json');

        this.ready = true;
    };

    public loadResources() {
        // load your resources here
    };

    public create() {

    };

    public update() {
        this.game.state.start('menu');
    };

    public onLoadComplete() {
    }
}