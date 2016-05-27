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

export default class Ship extends Group{
    keys:Key[] = [];
    keyToMovement: {key: number, func: Function}[] = [];
    frameRate:number = 50;
    sprite:Sprite;
    speed : number = 4;

    constructor(game: Game) {
        super(game);

        this.initializeSprites();
        this.initializeKeyEvents();
        this.initializeKeyToMovement();
        this.initializeAnimations();
    }

    private spin() {
        this.sprite.animations.play('moveUp', this.frameRate, false).onComplete.addOnce(() => {
            this.sprite.scale.setTo(1, -1);
            this.sprite.animations.play('moveUpReverse', this.frameRate, false).onComplete.addOnce(() => {
                this.sprite.animations.play('moveDown', this.frameRate, false).onComplete.addOnce(() => {
                    this.sprite.scale.setTo(1, 1);
                    this.sprite.animations.play('moveDownReverse', this.frameRate, false);
                });
            });
        })
    };

    public upPressed():void {
        this.animate('moveUp', () => this.upPressed());
    }

    public downPressed():void {
        this.animate('moveDown', () => this.downPressed());
    }

    public directionKeyReleased(args):void {
        var currentAnim = this.getCurrentAnimation();

        if (currentAnim.name === 'moveUp' && args.keyCode === Keyboard.UP || currentAnim.name === 'moveDown' && args.keyCode === Keyboard.DOWN) {
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

    private animate(animationName:string, func:Function) {
        var currentAnim = this.getCurrentAnimation();

        if (currentAnim.isPlaying && currentAnim.name === animationName) {
            currentAnim.reverseOnce();
        }
        else if (currentAnim.isPlaying) {
            currentAnim.onComplete.addOnce(() => func())
        } else {
            this.sprite.animations.play(animationName, this.frameRate, false);
        }
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

    update():void{
        for (let pair of this.keyToMovement){
            if (this.game.input.keyboard.isDown(pair.key)){
                pair.func();
            }
        }
    }

    private getCurrentAnimation():Animation {
        return this.sprite.animations.currentAnim;
    }

    private initializeSprites() {
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship', 'start.png');
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.setTo(.5);
        (<Phaser.Physics.Arcade.Body> this.sprite.body).collideWorldBounds = true;

        this.addChild(this.sprite);

        var trail = this.game.add.sprite(-35, 8, 'ship.trail');
        trail.scale.set(.7);
        trail.anchor.set(1,.5);

        this.sprite.addChild(trail);
        this.game.add.tween(trail.scale).to({x:.65, y:.65}, 250, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(trail).to({alpha: .7}, 250, Phaser.Easing.Exponential.InOut, true, 0, Infinity, true);
    };

    private initializeAnimations() {
        var upFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-up-', 1, 7, ".png", 2));
        var downFrames = ['start.png'].concat(Phaser.Animation.generateFrameNames('move-down-', 1, 7, ".png", 2));

        this.sprite.animations.add('moveUp', upFrames, this.frameRate, true);
        this.sprite.animations.add('moveUpReverse', upFrames.reverse(), this.frameRate, true);
        this.sprite.animations.add('moveDown', downFrames, this.frameRate, true);
        this.sprite.animations.add('moveDownReverse', downFrames.reverse(), this.frameRate, true);
    };

    private initializeKeyToMovement(): void {
        this.keyToMovement.push({key: Keyboard.UP, func: () => this.moveUp()});
        this.keyToMovement.push({key: Keyboard.DOWN, func: () => this.moveDown()});
        this.keyToMovement.push({key: Keyboard.RIGHT, func: () => this.moveRight()});
        this.keyToMovement.push({key: Keyboard.LEFT, func: () => this.moveLeft()});
    }

    private initializeKeyEvents(): void {
        this.keys[Keyboard.UP] = this.game.input.keyboard.addKey(Keyboard.UP);
        this.keys[Keyboard.DOWN] = this.game.input.keyboard.addKey(Keyboard.DOWN);

        this.keys[Keyboard.UP].onDown.add(() => this.upPressed());
        this.keys[Keyboard.UP].onUp.add(args => this.directionKeyReleased(args));
        this.keys[Keyboard.DOWN].onUp.add(args => this.directionKeyReleased(args));
        this.keys[Keyboard.DOWN].onDown.add(() => this.downPressed());
    };
}