import Game = Phaser.Game;
import Ship from "../ship";
import Sprite = Phaser.Sprite;
import Signal = Phaser.Signal;
export default class CollisionDetectionSystem {
    private game:Game;
    private ship:Ship;

    constructor(game:Game, ship:Ship) {
        this.game = game;
        this.ship = ship;
    }


    checkCollisions():void {
        this.game.world.getByName('monsters').forEachAlive(this.checkMonster.bind(this));
        this.game.world.getByName('upgrades').forEachAlive(this.checkUpgrade.bind(this));
    };

    private checkMonster(monster) {
        if (this.game.physics.arcade.collide(this.ship, monster)) {
            if (!this.ship.isInvincible) {
                this.ship.kill();
            }
        }
    }
    
    private checkUpgrade(upgrade) {
        if (this.game.physics.arcade.collide(this.ship, upgrade)) {
            upgrade.kill();
        }
    }
}