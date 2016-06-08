import Game = Phaser.Game;
import Ship from "../ship";
import Weapon from "../../weapon/Weapon";
import Sprite = Phaser.Sprite;
import DoubleBullet from "../../weapon/DoubleBullet";
import Signal = Phaser.Signal;
import RocketsLauncher from "../../weapon/rocketsLauncher";
import RippleGun from "../../weapon/rippleGun";
import LaserGun from "../../weapon/laserGun";
import WeaponsSystem from "./weaponsSystem";
export default class ShipWeaponsSystem extends WeaponsSystem{

    private ship:Ship;
    private sparkSprite:Sprite;
    private keySchema:{fire:number};
    onEnemyKilled:Signal;

    constructor(game:Game, ship:Ship, sparkSprite:Sprite, keySchema:{fire:number}) {
        super(game);
        this.onEnemyKilled = new Signal();
        this.ship = ship;
        this.sparkSprite = sparkSprite;
        this.keySchema = keySchema;

        this.initializeAnimations();
        this.initializeOnEnemyKilledEvent();
    }

    updateFire():void {
        if (this.game.input.keyboard.isDown(this.keySchema.fire)) {
            this.fire();
        }

        super.updateFire();
    }

    protected fire():void {
        if (this.weapon.canFire()) {
            this.animateSpark();
            super.fire();
        }
    }

    private animateSpark():void {
        if (!this.sparkSprite.animations.currentAnim.isPlaying) {
            this.sparkSprite.visible = true;
            this.sparkSprite.animations.play('fire').onComplete.addOnce(() => this.sparkSprite.visible = false);
        }
    }

    protected getPosition():{x:number, y:number} {
        let shipSprite = <Phaser.Sprite>this.sparkSprite.parent;

        return {x: shipSprite.body.x, y: shipSprite.body.y};
    }

    private initializeAnimations():void {
        this.sparkSprite.animations.add('fire', Phaser.Animation.generateFrameNames('fire_spark_', 1, 4), 20);
    }

    private initializeOnEnemyKilledEvent():void {
        for (let weaponKey in this.weapons) {
            if (this.weapons.hasOwnProperty(weaponKey)) {
                let weapon = this.weapons[weaponKey];

                weapon.onEnemyKilled.add(args => {
                    args.ship = this.ship;
                    this.onEnemyKilled.dispatch(args);
                });
            }
        }
    }
}