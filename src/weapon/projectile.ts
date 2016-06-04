import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Monster from "../monsters/monster";
import Signal = Phaser.Signal;
export default class Projectile extends Sprite {

    game:Game;
    onEnemyKilled:Signal;
    
    private damagePoints;

    constructor(game:Game, uri:string, damagePoints:number = 1) {
        super(game, 0, 0, 'ship.weapons', uri);
        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        this.onEnemyKilled = new Phaser.Signal();
        this.anchor.set(0.5);
        this.checkWorldBounds = true; 
        this.outOfBoundsKill = true;
        this.exists = false;
        this.damagePoints = damagePoints; 
    }

    fire(x, y, angle, speed, gx, gy) : void{
        var body = (<Phaser.Physics.Arcade.Body>this.body);

        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);

        this.game.physics.arcade.velocityFromAngle(angle, speed, body.velocity);

        this.angle = angle;

        body.gravity.set(gx, gy);
    };

    update():void{
        this.game.world.getByName('monsters').forEachAlive((monster) => {
            if (this.game.physics.arcade.collide(this, monster)){
                (<Monster>monster).damage(this.damagePoints);

                if (!monster.alive){
                    this.onEnemyKilled.dispatch({monster:monster});
                }
                this.kill();
            }
        }, this);
    }
}