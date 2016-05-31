
import Game = Phaser.Game;
import Explosion from "./explostion";
import BlueExplosion from "./blueExplosion";

export function createGreen(game:Game){
    return new Explosion(game, 'green', 'green', 6, 33);
}

export function createBlue(game:Game){
    return new BlueExplosion(game);
}