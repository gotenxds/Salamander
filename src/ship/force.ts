import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Animation = Phaser.Animation;
import Ship from "./ship";
export default class Force extends Sprite {
    private ship:Ship;
    private forceAnimation:Animation;

    constructor(game:Game, ship:Ship) {
        super(game, 0, 0, 'ship.weapons');
        game.world.add(this);
        ship.addChild(this);

        this.anchor.set(.5);
        this.x -= 10;
        this.y += 7;
        this.visible = false;

        this.ship = ship;
        this.forceAnimation = this.animations.add("force", Phaser.Animation.generateFrameNames('force_', 1, 3), 20, true);

        ship.onDamage.add(() => this.onShipDamage());
    }

    activate() {
        this.ship.heal(5);
        this.visible = true;
        this.forceAnimation.play();
    }

    private onShipDamage() {
        if (this.ship.health <= 1) {
            this.visible = false;
            this.forceAnimation.stop(true);
        }
    }
}