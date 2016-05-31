
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Explosion from "./death/explostion";
import {createGreen} from "./death/explostions";
export default class Monster extends Sprite{
    path:{x:number,y:number}[] = [];
    pathIndex:number = 0;
    death:Explosion;

    constructor(game:Game, x:number, y:number, key:string, frame:string = undefined) {
        super(game, x, y, key, frame);
        this.health = 1;
        this.maxHealth = 1;
        this.death = createGreen(game);
    }

    update():void {
        if (!this.alive) {
            this.death.play(this, () => this.destroy());
        } else {
            this.x = this.path[this.pathIndex].x;
            this.y = this.path[this.pathIndex].y;

            this.pathIndex++;
        }
    }
}