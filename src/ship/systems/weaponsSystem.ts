import Game = Phaser.Game;
import Ship from "../ship";
import Weapon from "../../weapon/Weapon";
import Sprite = Phaser.Sprite;
import DoubleBullet from "../../weapon/DoubleBullet";
import Signal = Phaser.Signal;
export default class WeaponsSystem {
    private weapons;
    private game:Game;
    private ship:Ship;
    private sparkSprite:Sprite;
    private keySchema:{fire:number};
    private weapon:Weapon;
    onEnemyKilled:Signal;

    constructor(game:Game, ship:Ship, sparkSprite:Sprite, keySchema:{fire:number}) {
        this.onEnemyKilled = new Signal();
        this.weapons = [new Weapon(game, 'simpleBullet', 'simpleBullet'), new DoubleBullet(game)];
        this.weapon = this.weapons[0];
        this.game = game;
        this.ship = ship;
        this.sparkSprite = sparkSprite;
        this.keySchema = keySchema;

        this.initializeAnimations();
        this.weapons.forEach(weapon => weapon.onEnemyKilled.add(args => {
            args.ship = this.ship;
            this.onEnemyKilled.dispatch(args);
        }))
    }

    updateFire():void {
        if (this.game.input.keyboard.isDown(this.keySchema.fire)) {
            this.fire();
        }
    }

    private fire():void {
        this.animateSpark();
        this.weapon.fire(this.getPosition());
    };

    private animateSpark():void {
        if (!this.sparkSprite.animations.currentAnim.isPlaying) {
            this.sparkSprite.visible = true;
            this.sparkSprite.animations.play('fire').onComplete.addOnce(() => this.sparkSprite.visible = false);
        }
    }

    private getPosition():{x:number, y:number} {
        let shipSprite = <Phaser.Sprite>this.sparkSprite.parent;

        return {x: shipSprite.body.x + 140, y: shipSprite.body.y + 35};
    };

    private initializeAnimations():void {
        this.sparkSprite.animations.add('fire', Phaser.Animation.generateFrameNames('fire_spark_', 1, 4, '.png'), 20);
    };
}