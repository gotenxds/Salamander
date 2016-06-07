
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;
import Ship from "../ship";
import Game = Phaser.Game;
export default class Option extends Sprite{
    private static maxDistancePerAxis:number = 100;

    private source:Ship;
    private oldDistance;

    constructor(game: Game, source:Ship, offset:Point){
        super(game, source.x, source.y, 'ship.weapons', 'option');
        game.world.add(this);
        this.anchor.set(.5);

        this.source = source;
        this.source.onMove.add(e => this.onShipMove(e));

        this.oldDistance = this.getDistance();
    }

    private onShipMove(eventArgs){
        let diff = {x: eventArgs.curPosition.x - eventArgs.pastPosition.x, y: eventArgs.curPosition.y - eventArgs.pastPosition.y };

        let distanceFromShip = this.getDistance();

        if (Option.maxDistancePerAxis > Math.abs(this.x - this.source.getSprite().body.x -50) && distanceFromShip <= this.oldDistance){
            this.x += diff.x * -1;
        }else{
            this.x += diff.x;
        }
        if (Option.maxDistancePerAxis > Math.abs(this.y - this.source.getSprite().body.y -50)  && distanceFromShip <= this.oldDistance){
            this.y += diff.y * -1;
        }else{
            this.y += diff.y;
        }

        console.log(Math.abs(this.y - this.source.getSprite().body.y))
    }

    private getDistance(){
        return Phaser.Math.distance(this.x, this.y, this.source.getSprite().body.x, this.source.getSprite().body.y);
    }
}