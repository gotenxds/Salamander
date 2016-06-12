export default class Boot extends Phaser.State {

    public preload() {
        this.game.load.image('preloader', 'assets/preloader.gif');
        this.game.load.json('map1Data', '/assets/stages/1/map.json');
    }

    public create() {
        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;
            this.game.scale.maxWidth = 640;
            this.game.scale.maxHeight = 480;
            this.game.scale.forceOrientation(true);
            this.game.scale.pageAlignHorizontally = true;
        }
        this.game.state.start('preloader');
    }
}