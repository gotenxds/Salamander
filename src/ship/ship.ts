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

export default class Ship extends Group {
    movementSystem: MovementSystem;
    keyToMovement:{key: number, func: Function}[] = [];
    sprite:Sprite;
    sparkSprite:Sprite;
    weapon:Weapon;
    explosion:BlueExplosion;
    spawnEndPoint:{x:number,y:number};
    isSpawning:boolean = false;
    invisibilityTimer:Timer;
    invisibilityTween:Tween;

    constructor(game:Game) {
        super(game);

        this.invisibilityTimer = game.time.create(false);
        this.invisibilityTimer.loop(3500, () => {
            this.invisibilityTween.pause();
            this.alpha = 1;
            this.invisibilityTimer.stop(false);
            console.log('stop');
        });
        this.spawnEndPoint = {x: game.width / 3, y: game.world.centerY};
        this.explosion = createBlue(game);
        this.initializeSprites();
        this.initializeKeyToMovement();
        this.initializeAnimations();

        this.movementSystem = new MovementSystem(game, this, this.sprite, {up:Keyboard.W,down:Keyboard.S,right:Keyboard.D,left:Keyboard.A});
    }


    private animateSpark() {
        if (!this.sparkSprite.animations.currentAnim.isPlaying) {
            this.sparkSprite.visible = true;
            this.sparkSprite.animations.play('fire').onComplete.addOnce(() => this.sparkSprite.visible = false);
        }
    }

    setWeapon(weapon:Weapon):void {
        this.weapon = weapon;
    }

    private fire() {
        this.animateSpark();
        this.weapon.fire(this.sprite);
    };

    spawn():void {
        this.resetToMiddleLeft();
        this.isSpawning = true;
        this.invisibilityTimer.start();
        this.invisibilityTween.start();
        this.invisibilityTween.resume();
        console.log('start');
        this.sprite.revive(1);
    }

    private resetToMiddleLeft(){
        this.position.set(0, this.game.world.centerY);
    }

    update():void {
        this.game.debug.spriteInfo(this.sprite, 20, 30);

        if (this.isSpawning) {
            if (this.yetToReachSpawnPoint()) {
                this.movementSystem.moveWithSpin();

            } else {
                this.isSpawning = false;
            }
        }
        else if (this.sprite.alive) {
            this.checkCollisions();

            this.movementSystem.updateMovement();
        } else {
            this.respawn();
        }
    }

    private respawn() {
        this.explosion.play(this.sprite.body);
        this.spawn();
    };

    private checkCollisions() {
        this.game.world.forEachAlive((child) => {
            if (child.key && child.key.startsWith('monsters') && this.game.physics.arcade.collide(this, child)) {
                if(this.invisibilityTween.isPaused || !this.invisibilityTween.isRunning){
                    this.sprite.kill();
                }
            }
        }, this);
    };

    private yetToReachSpawnPoint() {
        return this.x <= this.spawnEndPoint.x && this.y <= this.spawnEndPoint.y;
    };

    private initializeSprites() {
        this.initializeShipSprite();
        this.initializeSparkSprite();
        this.initializeTrail();
    };

    private initializeShipSprite() {
        this.sprite = this.game.add.sprite(0, 0, 'ship', 'start.png', this);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.setTo(.5);
        (<Phaser.Physics.Arcade.Body> this.sprite.body).collideWorldBounds = true;
    };

    private initializeSparkSprite() {
        this.sparkSprite = this.game.add.sprite(60, 6, 'ship.weapons');
        this.sprite.addChild(this.sparkSprite);
        this.sparkSprite.anchor.set(.5, .5);
        this.sparkSprite.scale.set(.95);
        this.sparkSprite.visible = false;

        this.invisibilityTween = this.game.add.tween(this).to({alpha: .3}, 200, Phaser.Easing.Linear.None, false, 0, Infinity, true);
    };

    private initializeTrail() {
        var trail = this.game.add.sprite(-38, 8, 'ship.trail');
        trail.scale.set(.7);
        trail.anchor.set(1, .5);

        this.sprite.addChild(trail);
        this.game.add.tween(trail.scale).to({x: .5, y: .2}, 250, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(trail).to({alpha: .8}, 250, Phaser.Easing.Exponential.InOut, true, 0, Infinity, true);
    };

    private initializeAnimations() {
        this.sparkSprite.animations.add('fire', Phaser.Animation.generateFrameNames('fire_spark_', 1, 4, '.png'), 20);
    };

    private initializeKeyToMovement():void {
        this.keyToMovement.push({key: Keyboard.SPACEBAR, func: () => this.fire()});
    }
}