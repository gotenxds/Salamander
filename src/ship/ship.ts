import Signal = Phaser.Signal;
import AnimationManager = Phaser.AnimationManager;
import Animation = Phaser.Animation;
import Keyboard = Phaser.Keyboard;
import Input = Phaser.Input;
import Key = Phaser.Key;
import Group = Phaser.Group;
import Game = Phaser.Game;
import Tween = Phaser.Tween;
import BlueExplosion from "../monsters/death/blueExplosion";
import {createBlue} from "../monsters/death/explostions";
import MovementSystem from "./systems/movementSystems";
import WeaponsSystem from "./systems/weaponsSystem";
import CollisionDetectionSystem from "./systems/collisionDetectionSystem";
import ShipWeaponsSystem from "./systems/shipWeaponsSystem";
import Option from "./option/option";
import Force from "./force";
import Timer = Phaser.Timer;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

export default class Ship extends Sprite {
    private movementSystem:MovementSystem;
    private weaponsSystem:WeaponsSystem;
    private collisionSystem:CollisionDetectionSystem;
    private sparkSprite:Sprite;
    private explosion:BlueExplosion;
    private spawnEndPoint:{x:number,y:number};
    private isSpawning:boolean = false;
    private invisibilityTimer:Timer;
    private invisibilityTween:Tween;
    private options:Option[] = [];
    private force:Force;
    onUpgradePickup:Signal;
    onEnemyKilled:Signal;
    onDeath:Signal;
    onDamage:Signal;
    onMove:Signal;
    onFire:Signal;

    constructor(game:Game) {
        super(game, 0, 0, 'ship', 'start.png');
        game.world.add(this);
        this.maxHealth = 6;

        this.invisibilityTimer = game.time.create(false);
        this.invisibilityTimer.loop(3500, () => this.invisibilityPeriodOver());
        this.spawnEndPoint = {x: game.width / 3, y: game.world.centerY};
        this.explosion = createBlue(game);
        this.initializeSprites();

        this.weaponsSystem = new ShipWeaponsSystem(game, this, this.sparkSprite, {fire: Keyboard.SPACEBAR});
        this.collisionSystem = new CollisionDetectionSystem(game, this);
        this.movementSystem = new MovementSystem(game, this, {
            up: Keyboard.W,
            down: Keyboard.S,
            right: Keyboard.D,
            left: Keyboard.A
        });

        this.onDamage = new Signal();
        this.onUpgradePickup = this.collisionSystem.onUpgradePickup;
        this.onEnemyKilled = this.weaponsSystem.onEnemyKilled;
        this.onDeath = this.events.onKilled;
        this.onMove = this.movementSystem.onMove;
        this.onFire = this.weaponsSystem.onFire;

        this.force = new Force(game, this);
    }

    spawn():void {
        this.resetToMiddleLeft();
        this.isSpawning = true;
        this.invisibilityTimer.start();
        this.invisibilityTween.start();
        this.invisibilityTween.resume();
        this.revive(1);
    }

    kill() : Sprite{
        this.options.forEach(op => op.destroy(true));
        this.options = [];

        return super.kill();
    }

    damage(amount:number){
        super.damage(amount);

        this.onDamage.dispatch();
    }

    update():void {
        if (this.isSpawning) {
            if (this.yetToReachSpawnPoint()) {
                this.movementSystem.moveWithSpin();
            } else {
                this.isSpawning = false;
            }
        }
        else if (this.alive) {
            this.collisionSystem.checkCollisions();

            this.weaponsSystem.updateFire();
            this.movementSystem.updateMovement();
        } else {
            this.respawn();
        }
    }

    addOption() {
        this.options.push(new Option(this.game, this, this.getNextFollowTarget(), this.weaponsSystem.exportData()));
    }

    private getNextFollowTarget() : Sprite|Option {
        return this.options.length == 0 ? this : this.options[this.options.length - 1];
    }

    upgradeRockets() {
        this.weaponsSystem.upgradeRockets();

        this.options.forEach(op => op.upgradeRockets());
    }

    upgradeRipple() {
        this.weaponsSystem.upgradeRipple();

        this.options.forEach(op => op.upgradeRipple());
    }

    upgradeLaser() {
        this.weaponsSystem.upgradeLaser();

        this.options.forEach(op => op.upgradeLaser());
    }

    activateForce(){
        this.force.activate();
    }

    get isInvincible():boolean {
        return !(this.invisibilityTween.isPaused || !this.invisibilityTween.isRunning);
    }

    private resetToMiddleLeft():void {
        this.position.set(0, this.game.world.centerY);
    }

    private invisibilityPeriodOver():void {
        this.invisibilityTween.pause();
        this.alpha = 1;
        this.invisibilityTimer.stop(false);
    }

    private respawn():void {
        this.explosion.play(this.body);
        this.spawn();
    };

    private yetToReachSpawnPoint():boolean {
        return this.x <= this.spawnEndPoint.x && this.y <= this.spawnEndPoint.y;
    };

    private initializeSprites():void {
        this.initializeShipSprite();
        this.initializeSparkSprite();
        this.initializeTrail();
    };

    private initializeShipSprite():void {
        this.game.physics.arcade.enable(this);
        this.anchor.setTo(.5);
        (<Phaser.Physics.Arcade.Body> this.body).collideWorldBounds = true;
    };

    private initializeSparkSprite():void {
        this.sparkSprite = this.game.add.sprite(60, 6, 'ship.weapons');
        this.addChild(this.sparkSprite);
        this.sparkSprite.anchor.set(.5, .5);
        this.sparkSprite.scale.set(.95);
        this.sparkSprite.visible = false;

        this.invisibilityTween = this.game.add.tween(this).to({alpha: .3}, 200, Phaser.Easing.Linear.None, false, 0, Infinity, true);
    };

    private initializeTrail():void {
        let trail = this.game.add.sprite(-38, 8, 'ship.trail');
        trail.scale.set(.7);
        trail.anchor.set(1, .5);

        this.addChild(trail);
        this.game.add.tween(trail).to({
            'scale.x': .5,
            'scale.y': .2,
            alpha: .8
        }, 250, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(trail.scale).to({y: .2}, 250, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(trail).to({alpha: .8}, 250, Phaser.Easing.Exponential.InOut, true, 0, Infinity, true);
    };
}