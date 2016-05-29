import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Image = Phaser.Image;
import Sprite = Phaser.Sprite;
import GreenExplotion from "./death/greenExplostion";
import Math = Phaser.Math;
export default class Dayanguai extends Sprite {
    static movementStatesX:number[] = [-230, 150];
    static movementStatesY:number[] = [0, -150];

    topShell:Image;
    bottomShell:Image;
    path:{x:number,y:number}[] = [];
    pathIndex:number = 0;
    death:GreenExplotion;

    constructor(game:Game, x:number, y:number, pathPoints:{x:number[],y:number[]}, color:string = 'red') {
        super(game, x, y, 'monsters.dayanguai', `${color}Eye.png`);
        this.health = 1;
        this.maxHealth = 1;
        this.death = new GreenExplotion(game);
        this.initializeSprites(game, color);

        let  w = 1 / game.width;
        for (let i = 0; i <= 1; i += w)
        {
            let px = Math.linearInterpolation(pathPoints.x, i);
            let py = Math.linearInterpolation(pathPoints.y, i);

            this.path.push({ x: px, y: py });
        }
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

    static generatePathPoints(x:number, y:number): {x:number[],y:number[]}{
        let points = {x:[], y:[]};

        for(let i = 0; i < 10; i++){
            points.x.push(x);
            points.y.push(y);

            x += this.movementStatesX[i % this.movementStatesX.length];
            y += this.movementStatesY[i % this.movementStatesY.length];
        }

        return points;
    }

    private initializeSprites(game:Game, color:string):void {
        game.world.addChild(this);
        game.physics.arcade.enable(this);
        this.scale.set(.9, .9);
        this.topShell = game.add.sprite(27, 0, 'monsters.dayanguai', `${color}Shell.png`);
        this.bottomShell = game.add.sprite(27, 59, 'monsters.dayanguai', `${color}Shell.png`);

        this.addChild(this.topShell);
        this.addChild(this.bottomShell);

        this.topShell.anchor.set(.5, .5);
        this.bottomShell.anchor.set(.5, .5);

        this.bottomShell.angle = 180;

        game.add.tween(this.topShell).to({y: 5}, 500, Phaser.Easing.Bounce.InOut, true, 0, Infinity, true);
        game.add.tween(this.bottomShell).to({y: 64}, 500, Phaser.Easing.Bounce.InOut, true, 0, Infinity, true);
    }

    private changeState() {
        this.stateIndex++;
        this.stateIndex %= this.movementStates.length;
    }
}