import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Image = Phaser.Image;
import Keyboard = Phaser.Keyboard;
import Ship from "../ship/ship";
import MissilePresentor from "./upgradePresentor/missilePresentor";
import RipplePresentor from "./upgradePresentor/rippliePresentor";
import LaserPresentor from "./upgradePresentor/laserPresentor";
import OptionPresentor from "./upgradePresentor/optionPresentor";
import ForcePresentor from "./upgradePresentor/forcePresentor";
import UpgradePresentor from "./upgradePresentor/upgradePresentor";
import Sound = Phaser.Sound;
export default class UpgradeCoutner extends Sprite {

    private presentors:UpgradePresentor[];
    private selectedIndex = -1;
    private upgradeKey = Keyboard.SHIFT;
    private ship:Ship;
    private upgradeSound:Sound;

    constructor(game:Game, ship:Ship) {
        super(game, game.world.centerX, game.height - 40);
        game.world.add(this);
        this.ship = ship;
        this.upgradeSound = game.add.sound('upgrade');

        this.addChild(new Image(game, -340, 0, 'upgradeCounterLeft'));
        this.addChild(new Image(game, 47, 0, 'upgradeCounterRight'));

        this.presentors = [MissilePresentor, RipplePresentor, LaserPresentor, OptionPresentor, ForcePresentor].map((presentor, index) => {
            return <UpgradePresentor>this.addChild(new presentor(game, -315 + index * UpgradePresentor.WIDTH, -5));
        });
    }

    selectNext():void {
        if (this.selectedIndex != -1) {
            this.presentors[this.selectedIndex].deSelect();
        }

        this.selectedIndex = ++this.selectedIndex % this.presentors.length;

        this.presentors[this.selectedIndex].select();
    }

    update():void {
        if (this.viableForUpgrade()) {
            var selected = this.getSelected();
            
            selected.upgrade(this.ship);
            selected.deSelect();
            
            this.upgradeSound.play();
            this.reset();
        }
    }

    private viableForUpgrade() {
        return this.game.input.keyboard.isDown(this.upgradeKey) && this.selectedIndex !== -1 && !this.getSelected().maxedOut();
    }

    private getSelected():UpgradePresentor {
        return this.presentors[this.selectedIndex];
    }

    private reset() {
        this.selectedIndex = -1;
    }
}