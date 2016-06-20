import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Explosion from "./death/explostion";
import {createGreen} from "./death/explostions";
import TextAsImage from "../gui/TextAsImage";
import Tween = Phaser.Tween;
export default class Monster extends Sprite {
    protected path:{x:number,y:number}[] = [];
    protected dropRate:number = .75;
    private pathIndex:number = 0;
    private death:Explosion;
    private pointsDisplay:TextAsImage;
    private pointsTween:Tween;
    private points:number;

    constructor(game:Game, x:number, y:number, key:string, points:number = 90, frame:string = undefined) {
        super(game, x, y, key, frame);
        game.physics.arcade.enable(this);

        this.health = 1;
        this.maxHealth = 1;
        this.death = createGreen(game);
        this.pointsDisplay = new TextAsImage(game, 'points_numbers', 0, 0, points.toString());
        this.pointsDisplay.alpha = 0;
        this.pointsTween = this.game.add.tween(this.pointsDisplay).to({}, 1000, Phaser.Easing.Linear.None, false, 0, 0);
        this.points = points;

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;

        this.events.onKilled.add(() => this.killed())
    }

    update():void {
        if (this.alive && this.hasWhereToGo()) {
            this.x = this.path[this.pathIndex].x;
            this.y = this.path[this.pathIndex].y;

            this.pathIndex++;
        }
    }

    getPoints():number {
        return this.points;
    }

    setPath(path:{x:number,y:number}[]) {
        this.path = path;
        this.pathIndex = 0;
    }
    getPath() {
        return this.path;
    }

    hasWhereToGo():boolean {
        return this.path.length > this.pathIndex;
    }

    getRemainingPath():{x:number,y:number}[] {
        return this.path.slice(this.pathIndex - 1, this.path.length - 1);
    }

    private playPoints() {
        this.pointsDisplay.alpha = 1;
        this.pointsDisplay.position.set(this.x, this.y);
        this.pointsTween.updateTweenData('vEnd', <any>{alpha: 0, 'y': this.y - 20});
        this.pointsTween.start();
    }

    private killed() {
        if (this.inWorld) {
            this.death.play(this);
            this.playPoints();

            if (Math.random() >= this.dropRate) {
                let upgrade = this.game.world.getByName('upgrades').getFirstDead(true, this.x, this.y);
                upgrade.revive();
            }
        }
    }
}