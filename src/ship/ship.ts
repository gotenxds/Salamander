import Sprite = Phaser.Sprite;
import Signal = Phaser.Signal;
import AnimationManager = Phaser.AnimationManager;
import Animation = Phaser.Animation;
import Keyboard = Phaser.Keyboard;
import Input = Phaser.Input;
import Key = Phaser.Key;
import Group = Phaser.Group;
import Game = Phaser.Game;
import Tween = Phaser.Tween;
import Weapon from "../weapon/Weapon";
import DoubleBullet from "../weapon/DoubleBullet";
import Dayanguai from "../monsters/dayanguai";
import BlueExplosion from "../monsters/death/blueExplosion";
import {createBlue} from "../monsters/death/explostions";
import Timer = Phaser.Timer;
import MovementSystem from "./systems/movementSystems";
import WeaponsSystem from "./systems/weaponsSystem";
import CollisionDetectionSystem from "./systems/collisionDetectionSystem";

export default class Ship extends Group {
    private movementSystem:MovementSystem;
    private weaponsSystem:WeaponsSystem;
    private collisionSystem:CollisionDetectionSystem;
    private sprite:Sprite;
    private sparkSprite:Sprite;
    private explosion:BlueExplosion;
    private spawnEndPoint:{x:number,y:number};
    private isSpawning:boolean = false;
    private invisibilityTimer:Timer;
    private invisibilityTween:Tween;
    onUpgradePickup:Signal;
    onEnemyKilled:Signal;
    onDeath:Signal;

    constructor(game:Game) {
        super(game);

        this.invisibilityTimer = game.time.create(false);
        this.invisibilityTimer.loop(3500, () => this.invisibilityPeriodOver());
        this.spawnEndPoint = {x: game.width / 3, y: game.world.centerY};
        this.explosion = createBlue(game);
        this.initializeSprites();

        this.weaponsSystem = new WeaponsSystem(game, this, this.sparkSprite, {fire: Keyboard.SPACEBAR});
        this.collisionSystem = new CollisionDetectionSystem(game, this);
        this.movementSystem = new MovementSystem(game, this, this.sprite, {
            up: Keyboard.W,
            down: Keyboard.S,
            right: Keyboard.D,
            left: Keyboard.A
        });
        
        this.onUpgradePickup = this.collisionSystem.onUpgradePickup;
        this.onEnemyKilled = this.weaponsSystem.onEnemyKilled;
        this.onDeath = this.sprite.events.onKilled;
    }

    spawn():void {
        this.resetToMiddleLeft();
        this.isSpawning = true;
        this.invisibilityTimer.start();
        this.invisibilityTween.start();
        this.invisibilityTween.resume();
        this.sprite.revive(1);
    }

    kill() {
        this.sprite.kill();
    }

    update():void {
        if (this.isSpawning) {
            if (this.yetToReachSpawnPoint()) {
                this.movementSystem.moveWithSpin();
            } else {
                this.isSpawning = false;
            }
        }
        else if (this.sprite.alive) {
            this.collisionSystem.checkCollisions();

            this.weaponsSystem.updateFire();
            this.movementSystem.updateMovement();
        } else {
            this.respawn();
        }
    }

    upgradeRockets(){
        this.weaponsSystem.upgradeRockets();
    }
    
    get isInvincible():boolean{
        return !(this.invisibilityTween.isPaused || !this.invisibilityTween.isRunning);
    }

    private resetToMiddleLeft() :void{
        this.position.set(0, this.game.world.centerY);
    }

    private invisibilityPeriodOver():void {
        this.invisibilityTween.pause();
        this.alpha = 1;
        this.invisibilityTimer.stop(false);
    }

    private respawn():void {
        this.explosion.play(this.sprite.body);
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
        this.sprite = this.game.add.sprite(0, 0, 'ship', 'start.png', this);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.setTo(.5);
        (<Phaser.Physics.Arcade.Body> this.sprite.body).collideWorldBounds = true;
    };

    private initializeSparkSprite():void {
        this.sparkSprite = this.game.add.sprite(60, 6, 'ship.weapons');
        this.sprite.addChild(this.sparkSprite);
        this.sparkSprite.anchor.set(.5, .5);
        this.sparkSprite.scale.set(.95);
        this.sparkSprite.visible = false;

        this.invisibilityTween = this.game.add.tween(this).to({alpha: .3}, 200, Phaser.Easing.Linear.None, false, 0, Infinity, true);
    };

    private initializeTrail():void {
        let trail = this.game.add.sprite(-38, 8, 'ship.trail');
        trail.scale.set(.7);
        trail.anchor.set(1, .5);

        this.sprite.addChild(trail);
        this.game.add.tween(trail.scale).to({x: .5, y: .2}, 250, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(trail).to({alpha: .8}, 250, Phaser.Easing.Exponential.InOut, true, 0, Infinity, true);
    };
}