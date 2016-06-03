import Game = Phaser.Game;
import Image = Phaser.Image;
import Math = Phaser.Math;
import Monster from "./monster";

export default class Dayanguai extends Monster {
    static movementStatesX:number[] = [-230, 150];
    static movementStatesY:number[] = [0, -150];

    private topShell:Image;
    private bottomShell:Image;

    constructor(game:Game, x:number, y:number, pathPoints:{x:number[],y:number[]}, color:string = 'red') {
        super(game, x, y, 'monsters.dayanguai', 90, `${color}Eye.png`);

        this.initializeSprites(game, color);
        this.initializePath(game, pathPoints);
    }

    static generatePathPoints(x:number, y:number): {x:number[],y:number[]}{
        let points = {x:[], y:[]};

        for(let i = 0; i < 15; i++){
            points.x.push(x);
            points.y.push(y);

            x += this.movementStatesX[i % this.movementStatesX.length];
            y += this.movementStatesY[i % this.movementStatesY.length];
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

    private initializePath(game, pathPoints) {
        let w = 1 / game.width;
        for (let i = 0; i <= 1; i += w) {
            let px = Math.linearInterpolation(pathPoints.x, i);
            let py = Math.linearInterpolation(pathPoints.y, i);

            this.path.push({x: px, y: py});
        }
    };
}