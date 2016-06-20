import Game = Phaser.Game;
import Image = Phaser.Image;
import Math = Phaser.Math;
import Monster from "./monster";

export default class Dayanguai extends Monster {
    static movementStatesX:number[] = [-1000, 300];
    static movementStatesY:number[] = [0, -300];

    private topShell:Image;
    private bottomShell:Image;
    private _pathPoints:{x:number[],y:number[]};

    constructor(game:Game, x:number, y:number, pathPoints:{x:number[],y:number[]}, color:string = 'red') {
        super(game, x, y, 'monsters.dayanguai', 90, `${color}Eye.png`);
        this.dropRate = 100;
        this.pathPoints = pathPoints;

        this.initializeSprites(game, color);
    }

    get pathPoints():{x: number[], y: number[]} {
        return this._pathPoints;
    }

    set pathPoints(pathPoints:{x: number[], y: number[]}) {
        this._pathPoints = pathPoints;

        this.populatePath();
    }

    static generatePathPoints(startX:number, startY:number, centerY:number): {x:number[],y:number[]}{
        let points = {x:[], y:[]};

        for(let i = 0; i < 15; i++){
            points.x.push(startX);
            points.y.push(startY);

            let movementY = this.movementStatesY[i % this.movementStatesY.length];

            startX += this.movementStatesX[i % this.movementStatesX.length];
            startY += this.aboveCenter(startY, centerY) ? movementY : -movementY;
        }

        return points;
    }

    private initializeSprites(game:Game, color:string):void {
        game.world.addChild(this);
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

    private populatePath() {
        if (this._pathPoints){
            this.setPath([]);

            let w = 1 / this.game.width;
            for (let i = 0; i <= 1; i += w) {
                let px = Math.linearInterpolation(this._pathPoints.x, i);
                let py = Math.linearInterpolation(this._pathPoints.y, i);

                this.path.push({x: px, y: py});
            }
        }
    };

    private static aboveCenter(y:number, centerY:number):boolean {
        return y < centerY;
    }
}