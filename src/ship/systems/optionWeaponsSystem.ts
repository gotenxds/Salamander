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
import Option from "../option/option";
export default class OptionWeaponsSystem extends WeaponsSystem{
    private option:Option;

    constructor(game:Game, option:Option) {
        super(game);
        this.option = option;

        this.initializeOnEnemyKilledEvent();
    }

    protected getPosition():{x:number, y:number}{
        return {x: this.option.x - 100, y:this.option.y - 20};
    }

    fireWeapon(){
        this.fire();
    }

    private initializeOnEnemyKilledEvent():void {
        for (let weaponKey in this.weapons) {
            if (this.weapons.hasOwnProperty(weaponKey)) {
                let weapon = this.weapons[weaponKey];

                weapon.onEnemyKilled.add(args => {
                    args.ship = this.option.getShip();
                    this.onEnemyKilled.dispatch(args);
                });
            }
        }
    }
}