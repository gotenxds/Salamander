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
    onFire:Signal;

    protected weapons;
    protected weapon:Weapon;
    protected rocketsLauncher:RocketsLauncher;

    constructor(game:Game) {
        this.onEnemyKilled = new Signal();
        this.onFire = new Signal();
        this.weapons = {defaultWeapon: <DoubleBullet>new DoubleBullet(game),rippleGun: <RippleGun>new RippleGun(game),laserGun: <LaserGun>new LaserGun(game), rocketLauncher: new RocketsLauncher(game)};
        this.rocketsLauncher = this.weapons.rocketLauncher;
        this.weapon = this.weapons.defaultWeapon;
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

    updateFire():void {
        this.rocketsLauncher.fire(this.getPosition());
    }

    exportData(){
        let currentWeaponName = this.weapons['defaultWeapon'] === this.weapon ? 'defaultWeapon' : this.weapon.name;

        let data = {currentWeapon:currentWeaponName , levels:{}};

        for (let weaponKey in this.weapons) {
            if (this.weapons.hasOwnProperty(weaponKey)) {
                let weapon = this.weapons[weaponKey];

                data.levels[weaponKey] = weapon.getLevel();
            }
        }

        return data;
    }

    importData(data){
        this.weapon = this.weapons[data.currentWeapon];

        for (let weaponKey in data.levels) {
            if (data.levels.hasOwnProperty(weaponKey)) {
                this.weapons[weaponKey].setLevel(data.levels[weaponKey]);
            }
        }
    }

    private upgradeAndSet(rippleGun) {
        rippleGun.upgrade();

        this.weapon = rippleGun;
    }

    protected fire():void {
        if (this.weapon.canFire()) {
            this.weapon.fire(this.getPosition());
            this.onFire.dispatch();
        }
    }

    protected abstract getPosition():{x:number, y:number};
}

export default WeaponsSystem;