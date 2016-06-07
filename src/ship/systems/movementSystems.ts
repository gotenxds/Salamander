import Ship from "../ship";
import Key = Phaser.Key;
import Keyboard = Phaser.Keyboard;
import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Animation = Phaser.Animation;
import Signal = Phaser.Signal;
import Point = Phaser.Point;
export default class MovementSystem {
    private game:Game;
    private speed:number = 4;
    private frameRate:number = 50;
    private keyToMovement:{key: number, func: Function}[] = [];
    private keys:Key[] = [];
    private keySchema:{up:number,down:number,right:number,left:number};
    private ship:Ship;
    private shipSprite:Sprite
    onMove :Signal;

    constructor(game:Game, ship:Ship, shipSprite:Sprite, keySchema:{up:number,down:number,right:number,left:number}) {
        this.game = game;
        this.ship = ship;
        this.shipSprite = shipSprite;
        this.keySchema = keySchema;

        this.initializeKeyToMovement(keySchema);
        this.initializeKeyEvents(keySchema);
        this.initializeAnimations();
        this.onMove = new Signal();
    }

    updateMovement():void {
        let curPosition = this.getCurrentPosition();
        let moved = false;

        for (let pair of this.keyToMovement) {
            if (this.game.input.keyboard.isDown(pair.key)) {
                moved = true;
                pair.func();
            }
        }

        if (moved){
            this.onMove.dispatch({curPosition:this.getCurrentPosition(), pastPosition:curPosition});
        }
    };

    moveWithSpin():void {
        let curPosition = this.getCurrentPosition();

        if (!this.getCurrentAnimation().isPlaying) {
            this.spin();
        }
        this.shipSprite.body.x += this.speed * 3;

        this.onMove.dispatch({curPosition:this.getCurrentPosition(), pastPosition:curPosition});
    }

    spin():void {
        if (!this.shipSprite.animations.currentAnim.isPlaying) {
            let moveUp = this.shipSprite.animations.getAnimation('moveUpFull');
            let moveDown = this.shipSprite.animations.getAnimation('moveDownFull');
            var spinFrameRate = this.frameRate * 3;

            moveUp.play(spinFrameRate, false).onComplete.addOnce(() => {
                this.shipSprite.scale.setTo(1, -1);
                moveUp.reverseOnce().play(spinFrameRate, false).onComplete.addOnce(() => {
                    moveDown.play(spinFrameRate, false).onComplete.addOnce(() => {
                        this.shipSprite.scale.setTo(1, 1);
                        moveDown.reverseOnce().play(spinFrameRate, false);
                    });
                });
            })
        }
    }

    private upPressed():void {
        this.animateMovement('moveUp', () => this.upPressed());
    }

    private downPressed():void {
        this.animateMovement('moveDown', () => this.downPressed());
    }

    private directionKeyReleased(args):void {
        var currentAnim = this.getCurrentAnimation();

        if (currentAnim.name === 'moveUp' && args.keyCode === this.keySchema.up || currentAnim.name === 'moveDown' && args.keyCode === this.keySchema.down) {
            currentAnim.reverseOnce();

            if (!currentAnim.isPlaying) {
                currentAnim.play(this.frameRate, false);
            }
        } else {
            currentAnim.onComplete.addOnce(() => {
                this.getCurrentAnimation().stop();
            });
        }
    }

    private animateMovement(animationName:string, func:Function):void {
        var currentAnimation = this.getCurrentAnimation();

        if (currentAnimation.isPlaying && currentAnimation.name === animationName) {
            currentAnimation.reverseOnce();
        }
        else if (currentAnimation.isPlaying) {
            currentAnimation.onComplete.addOnce(() => func())
        } else {
            this.shipSprite.animations.play(animationName, this.frameRate, false);
        }
    }

    private getCurrentAnimation():Animation {
        return this.shipSprite.animations.currentAnim;
    };


    private moveUp():void {
        this.shipSprite.body.y -= this.speed;
    }

    private moveDown():void {
        this.shipSprite.body.y += this.speed;
    }

    private moveRight():void {
        this.shipSprite.body.x += this.speed;
    }

    private moveLeft():void {
        this.shipSprite.body.x -= this.speed;
    }

    private initializeKeyToMovement(keySchema:{up:number,down:number,right:number,left:number}):void {
        this.keyToMovement.push({key: keySchema.up, func: () => this.moveUp()});
        this.keyToMovement.push({key: keySchema.down, func: () => this.moveDown()});
        this.keyToMovement.push({key: keySchema.right, func: () => this.moveRight()});
        this.keyToMovement.push({key: keySchema.left, func: () => this.moveLeft()});
    }

    private initializeAnimations():void {
        var upFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-up-', 1, 7, ".png", 2));
        var downFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-down-', 1, 7, ".png", 2));
        var upFramesFull = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-up-', 1, 14, ".png", 2));
        var downFramesFull = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-down-', 1, 16, ".png", 2));

        this.shipSprite.animations.add('moveUp', upFrames, this.frameRate, true);
        this.shipSprite.animations.add('moveUpFull', upFramesFull, this.frameRate, true);
        this.shipSprite.animations.add('moveDown', downFrames, this.frameRate, true);
        this.shipSprite.animations.add('moveDownFull', downFramesFull, this.frameRate, true);
    };

    private initializeKeyEvents(keySchema:{up:number, down:number}):void {
        this.keys[keySchema.up] = this.game.input.keyboard.addKey(keySchema.up);
        this.keys[keySchema.down] = this.game.input.keyboard.addKey(keySchema.down);

        this.keys[keySchema.up].onDown.add(() => this.upPressed());
        this.keys[keySchema.up].onUp.add(args => this.directionKeyReleased(args));
        this.keys[keySchema.down].onUp.add(args => this.directionKeyReleased(args));
        this.keys[keySchema.down].onDown.add(() => this.downPressed());
    };

    private getCurrentPosition():Point{
        return new Point(this.shipSprite.body.x, this.shipSprite.body.y);
    }
}