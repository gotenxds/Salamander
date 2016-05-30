
import Sprite = Phaser.Sprite;
import GreenExplotion from "./death/greenExplostion";
import Game = Phaser.Game;
export default class Monster extends Sprite{
    path:{x:number,y:number}[] = [];
    pathIndex:number = 0;
    death:GreenExplotion;

    constructor(game:Game, x:number, y:number, key:string, frame:string = undefined) {
        super(game, x, y, key, frame);
        this.health = 1;
        this.maxHealth = 1;
        this.death = new GreenExplotion(game);
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