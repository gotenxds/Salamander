import Point = Phaser.Point;
import Sprite = Phaser.Sprite;
import Ship from "../ship";
import Game = Phaser.Game;
import OptionWeaponsSystem from "../systems/optionWeaponsSystem";
export default class Option extends Sprite {
    private static distanceFromFollowTarget:number = 50;

    private ship:Ship;
    private followTarget: Sprite;
    private weapons:{};
    private weaponSystem:OptionWeaponsSystem;
    private path:Point[] = [];

    constructor(game:Game, ship:Ship, followTarget:Sprite, weaponData = {}) {
        super(game, followTarget.x + 50, followTarget.y + 50, 'ship.weapons', 'option');
        game.world.add(this);
        this.anchor.set(.5);

        this.weaponSystem = new OptionWeaponsSystem(game, this);
        this.weaponSystem.importData(weaponData);

        this.ship = ship;
        this.followTarget = followTarget;

        let onFireSignalBinding = this.ship.onFire.add(() => this.weaponSystem.fireWeapon());
        let onEnemyKilledSignalBinding = this.weaponSystem.onEnemyKilled.add((args) => ship.onEnemyKilled.dispatch(args));

        this.events.onDestroy.addOnce(() => {
            onFireSignalBinding.detach();
            onEnemyKilledSignalBinding.detach();
        })
    }

    update() {
        this.weaponSystem.updateFire();

        let distanceFromFollowTarget = Phaser.Math.distance(this.x, this.y, this.followTarget.x, this.followTarget.y);

        if (distanceFromFollowTarget <= Option.distanceFromFollowTarget) {
            this.path = [];
        }

        if (this.path.length === 0 && distanceFromFollowTarget > Option.distanceFromFollowTarget) {
            this.populatePath();
        }

        let newPoint = this.path.shift() || this.position;

        this.x = newPoint.x;
        this.y = newPoint.y;
    }

    upgradeRockets() {
        this.weaponSystem.upgradeRockets();
    }

    upgradeRipple() {
        this.weaponSystem.upgradeRipple();
    }

    upgradeLaser() {
        this.weaponSystem.upgradeLaser();
    }

    getShip() {
        return this.ship;
    }

    private populatePath() {
        let pathPoints = {x: [this.x, this.followTarget.x], y: [this.y, this.followTarget.y]};
        let w = 1 / 20;
        for (let i = 0; i <= 1; i += w) {
            let px = Phaser.Math.linearInterpolation(pathPoints.x, i);
            let py = Phaser.Math.linearInterpolation(pathPoints.y, i);

            this.path.push(new Point(px, py));
        }
    }
}