import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Image = Phaser.Image;
import Sprite = Phaser.Sprite;
import GreenExplotion from "./death/greenExplostion";
export default class Dayanguai extends Sprite {
    topShell:Image;
    bottomShell:Image;
    movementStates:{x:number,y:number}[] = [{x: -2.5, y: 0}, {x: 1.7, y: -1.7}];
    stateIndex:number = 0;
    indexSinceLastStateChange:number = 0;
    indexToChangeState:number = 100;
    death:GreenExplotion;

    constructor(game:Game, x:number, y:number, color:string = 'red') {
        super(game, x, y, 'monsters.dayanguai', `${color}Eye.png`);
        this.health = 1;
        this.maxHealth = 1;
        this.death = new GreenExplotion(game);
        this.initializeSprites(game, color);
    }

    update():void {
        if (!this.alive) {
            this.death.play(this, () => this.destroy());
        } else {
            if (this.indexSinceLastStateChange >= this.indexToChangeState) {
                this.changeState();
                this.indexSinceLastStateChange = -1;
            }

            var state = this.movementStates[this.stateIndex];
            this.x += state.x;
            this.y += state.y;

            this.indexSinceLastStateChange++;
        }
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