import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import Dayanguai from "../monsters/dayanguai";
export default class Projectile extends Sprite {

    game:Game;

    constructor(game:Game, uri:string) {
        super(game, 0, 0, 'ship.weapons', `${uri}.png`);
        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        this.anchor.set(0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
    }

    fire(x, y, angle, speed, gx, gy) {
        var body = (<Phaser.Physics.Arcade.Body>this.body);

        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);
        this.scale.set(1);

        this.game.physics.arcade.velocityFromAngle(angle, speed, body.velocity);

        this.angle = angle;

        body.gravity.set(gx, gy);
    };

    update(){
        this.game.world.forEachAlive((child) => {
            if (child.key && child.key.startsWith('monsters') && this.game.physics.arcade.collide(this, child)){
                (<Dayanguai>child).damage(1);
                this.kill();
            }
        }, this);
    }
}