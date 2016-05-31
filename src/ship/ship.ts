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

export default class Ship extends Group {
    keys:Key[] = [];
    keyToMovement:{key: number, func: Function}[] = [];
    frameRate:number = 50;
    sprite:Sprite;
    sparkSprite:Sprite;
    speed:number = 4;
    weapon:Weapon;
    explosion:BlueExplosion;
    spawnEndPoint:{x:number,y:number};
    isSpawning:boolean = false;

    constructor(game:Game) {
        super(game);

        this.spawnEndPoint = {x: game.width / 3, y: game.world.centerY};
        this.explosion = createBlue(game);
        this.initializeSprites();
        this.initializeKeyEvents();
        this.initializeKeyToMovement();
        this.initializeAnimations();
    }

    private spin() {
        if (!this.sprite.animations.currentAnim.isPlaying) {
            let moveUp = this.sprite.animations.getAnimation('moveUpFull');
            let moveDown = this.sprite.animations.getAnimation('moveDownFull');
            var spinFrameRate = this.frameRate * 3;

            moveUp.play(spinFrameRate, false).onComplete.addOnce(() => {
                this.sprite.scale.setTo(1, -1);
                moveUp.reverseOnce().play(spinFrameRate, false).onComplete.addOnce(() => {
                    moveDown.play(spinFrameRate, false).onComplete.addOnce(() => {
                        this.sprite.scale.setTo(1, 1);
                        moveDown.reverseOnce().play(spinFrameRate, false);
                    });
                });
            })
        }
    };

    public upPressed():void {
        this.animateMovement('moveUp', () => this.upPressed());
    }

    public downPressed():void {
        this.animateMovement('moveDown', () => this.downPressed());
    }

    public directionKeyReleased(args):void {
        var currentAnim = this.getCurrentAnimation();

        if (currentAnim.name === 'moveUp' && args.keyCode === Keyboard.W || currentAnim.name === 'moveDown' && args.keyCode === Keyboard.S) {
            currentAnim.reverseOnce();

            if (!currentAnim.isPlaying) {
                currentAnim.play(this.frameRate, false);
            }
        } else {
            currentAnim.onComplete.addOnce(args => {
                this.getCurrentAnimation().stop();
            });
        }
    }

    private animateMovement(animationName:string, func:Function) {
        var currentAnimation = this.getCurrentAnimation();

        if (currentAnimation.isPlaying && currentAnimation.name === animationName) {
            currentAnimation.reverseOnce();
        }
        else if (currentAnimation.isPlaying) {
            currentAnimation.onComplete.addOnce(() => func())
        } else {
            this.sprite.animations.play(animationName, this.frameRate, false);
        }
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

    moveUp():void {
        this.y -= this.speed;
    }

    moveDown():void {
        this.y += this.speed;
    }

    moveRight():void {
        this.x += this.speed;
    }

    moveLeft():void {
        this.x -= this.speed;
    }

    private fire() {
        this.animateSpark();
        this.weapon.fire(this.sprite);
    };

    spawn():void {
        this.resetToMiddleLeft();
        this.isSpawning = true;
        this.sprite.revive(1);
    }

    private resetToMiddleLeft(){
        this.position.set(0, this.game.world.centerY);
    }

    update():void {
        this.game.debug.spriteInfo(this.sprite, 20, 30);

        if (this.isSpawning) {
            if (this.yetToReachSpawnPoint()) {
                if (!this.getCurrentAnimation().isPlaying) {
                    this.spin();
                }
                this.x += this.speed * 3;
            } else {
                this.isSpawning = false;
            }

            this.checkCollisions();
        }
        else if (this.sprite.alive) {
            this.checkCollisions();

            this.checkForMovement();
        } else {
            this.respawn();
        }
    }

    private respawn() {
        this.explosion.play(this.sprite.body);
        this.spawn();
    };

    private checkForMovement() {
        for (let pair of this.keyToMovement) {
            if (this.game.input.keyboard.isDown(pair.key)) {
                pair.func();
            }
        }
    };

    private checkCollisions() {
        this.game.world.forEachAlive((child) => {
            if (child.key && child.key.startsWith('monsters') && this.game.physics.arcade.collide(this, child)) {
                if(this.isSpawning){
                    child.kill();
                }else{
                    this.sprite.kill();
                }
            }
        }, this);
    };

    private yetToReachSpawnPoint() {
        return this.x <= this.spawnEndPoint.x && this.y <= this.spawnEndPoint.y;
    };

    private getCurrentAnimation():Animation {
        return this.sprite.animations.currentAnim;
    }

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
        var upFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-up-', 1, 7, ".png", 2));
        var downFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-down-', 1, 7, ".png", 2));
        var upFramesFull = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-up-', 1, 14, ".png", 2));
        var downFramesFull = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-down-', 1, 16, ".png", 2));

        this.sprite.animations.add('moveUp', upFrames, this.frameRate, true);
        this.sprite.animations.add('moveUpFull', upFramesFull, this.frameRate, true);
        this.sprite.animations.add('moveDown', downFrames, this.frameRate, true);
        this.sprite.animations.add('moveDownFull', downFramesFull, this.frameRate, true);

        this.sparkSprite.animations.add('fire', Phaser.Animation.generateFrameNames('fire_spark_', 1, 4, '.png'), 20);
    };

    private initializeKeyToMovement():void {
        this.keyToMovement.push({key: Keyboard.W, func: () => this.moveUp()});
        this.keyToMovement.push({key: Keyboard.S, func: () => this.moveDown()});
        this.keyToMovement.push({key: Keyboard.D, func: () => this.moveRight()});
        this.keyToMovement.push({key: Keyboard.A, func: () => this.moveLeft()});
        this.keyToMovement.push({key: Keyboard.SPACEBAR, func: () => this.fire()});
    }

    private initializeKeyEvents():void {
        this.keys[Keyboard.W] = this.game.input.keyboard.addKey(Keyboard.W);
        this.keys[Keyboard.S] = this.game.input.keyboard.addKey(Keyboard.S);

        this.keys[Keyboard.W].onDown.add(() => this.upPressed());
        this.keys[Keyboard.W].onUp.add(args => this.directionKeyReleased(args));
        this.keys[Keyboard.S].onUp.add(args => this.directionKeyReleased(args));
        this.keys[Keyboard.S].onDown.add(() => this.downPressed());
    };
}