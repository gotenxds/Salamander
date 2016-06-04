import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Projectile from "./projectile";
import Signal = Phaser.Signal;
export default class Rocket extends Projectile {

    game:Game;
    onEnemyKilled:Signal;

    constructor(game:Game, level:number) {
        super(game, 'rocket', level);
        this.scale.set(.8)
    }
}