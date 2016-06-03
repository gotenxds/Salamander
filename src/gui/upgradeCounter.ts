import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import UpgradePresentor from "./upgradePresentor";
export default class UpgradeCoutner extends Sprite {

    private presentors:UpgradePresentor[];
    private selectedIndex = -1;

    constructor(game:Game) {
        super(game, game.world.centerX, game.height - 40);
        game.world.add(this);

        this.addChild(new Image(game, -340, 0, 'upgradeCounterLeft'));
        this.addChild(new Image(game, 47, 0, 'upgradeCounterRight'));

        this.presentors = ['MISSILE', 'RIPPLE', 'LASER', 'OPTION', 'FORCE'].map((upgradeName, index) => {
            return <UpgradePresentor>this.addChild(new UpgradePresentor(game, -315 + index * UpgradePresentor.WIDTH, -5, upgradeName));
        });
    }

    selectNext(){
        if (this.selectedIndex != -1){
            this.presentors[this.selectedIndex].deSelect();
        }
        
        this.selectedIndex = ++this.selectedIndex % this.presentors.length;
        
        this.presentors[this.selectedIndex].select();
    }
}