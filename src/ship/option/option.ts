import Point = Phaser.Point;
import Sprite = Phaser.Sprite;
import Ship from "../ship";
import Game = Phaser.Game;
export default class Option extends Sprite {
    private static maxDistancePerAxis:number = 100;

    private source:Ship;
    private oldDistance;
    private weapons:{};

    constructor(game:Game, source:Ship, offset:Point) {
        super(game, source.x + offset.x, source.y + offset.y, 'ship.weapons', 'option');
        game.world.add(this);
        this.anchor.set(.5);

        this.source = source;
        this.source.onMove.add(e => this.onShipMove(e));
    }

    private onShipMove(eventArgs) {
        let diff = {
            x: eventArgs.curPosition.x - eventArgs.pastPosition.x,
            y: eventArgs.curPosition.y - eventArgs.pastPosition.y
        };

        if (Option.maxDistancePerAxis > Math.abs(this.x - this.source.getSprite().body.x - 50)) {
            this.x += diff.x * -1;
        } else {
            this.x += diff.x;
        }
        if (Option.maxDistancePerAxis > Math.abs(this.y - this.source.getSprite().body.y - 50)) {
            this.y += diff.y * -1;
        } else {
            this.y += diff.y;
        }
    }
}