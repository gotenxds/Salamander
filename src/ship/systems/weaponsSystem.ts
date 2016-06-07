import Game = Phaser.Game;
import Ship from "../ship";
import Weapon from "../../weapon/Weapon";
import Sprite = Phaser.Sprite;
import DoubleBullet from "../../weapon/DoubleBullet";
import Signal = Phaser.Signal;
import RocketsLauncher from "../../weapon/rocketsLauncher";
import RippleGun from "../../weapon/rippleGun";
import LaserGun from "../../weapon/laserGun";
abstract class WeaponsSystem {
    game:Game;
    onEnemyKilled:Signal;

    protected weapons;
    protected weapon:Weapon;
    protected rocketsLauncher:RocketsLauncher;

    constructor(game:Game) {
        this.onEnemyKilled = new Signal();
        this.weapons = {doubleBullet: <DoubleBullet>new DoubleBullet(game),rippleGun: <RippleGun>new RippleGun(game),laserGun: <LaserGun>new LaserGun(game)};
        this.rocketsLauncher = new RocketsLauncher(game);
        this.weapon = this.weapons.doubleBullet;
        this.game = game;
    }

    upgradeRockets() {
        this.rocketsLauncher.upgrade();
    }

    upgradeLaser() {
        this.upgradeAndSet(this.weapons.laserGun);
    }

    upgradeRipple() {
        this.upgradeAndSet(this.weapons.rippleGun);
    }

    abstract updateFire():void;

    private upgradeAndSet(rippleGun) {
        rippleGun.upgrade();

        this.weapon = rippleGun;
    }

    protected fire():void {
        if (this.weapon.canFire()) {
            this.weapon.fire(this.getPosition());
        }
    }

    protected abstract getPosition():{x:number, y:number};
}

export default WeaponsSystem;