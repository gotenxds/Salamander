import Sprite = Phaser.Sprite;
import Game = Phaser.Game;
import Tween = Phaser.Tween;
export default class Upgrade extends Sprite {

    pickedTween:Tween;

    constructor(game:Game) {
        super(game, 700, 700, 'upgrades', 'upgrade_1_center');
        game.world.add(this);
        game.world.getByName("upgrades").add(this);
        game.physics.arcade.enable(this);

        let leftSprite = new Sprite(game, -13, 23.5, 'upgrades', 'upgrade_1_left');
        let rightSprite = new Sprite(game, 73, 23.5, 'upgrades', 'upgrade_1_right');
        let topSprite = new Sprite(game, 25, -3, 'upgrades', 'upgrade_1_top');
        let bottomSprite = new Sprite(game, 25, 69, 'upgrades', 'upgrade_1_bottom');
        
        this.createTweens(topSprite, bottomSprite, leftSprite, rightSprite);

        this.addChild(leftSprite);
        this.addChild(rightSprite);
        this.addChild(topSprite);
        this.addChild(bottomSprite);
    }

    private createTweens(topSprite:Phaser.Sprite, bottomSprite:Phaser.Sprite, leftSprite:Phaser.Sprite, rightSprite:Phaser.Sprite) {
        this.game.add.tween(topSprite).to({'y': topSprite.y - 10}, 1000, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(bottomSprite).to({'y': bottomSprite.y + 10}, 1000, Phaser.Easing.Linear.None, true, 0, Infinity, true);

        this.game.add.tween(leftSprite).to({'x': leftSprite.x - 5}, 1000, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        this.game.add.tween(rightSprite).to({'x': rightSprite.x + 5}, 1000, Phaser.Easing.Linear.None, true, 0, Infinity, true);
        
        this.pickedTween = this.game.add.tween(this.scale).to({'x':0, y:0}, 200, Phaser.Easing.Linear.None, false, 0);
        this.pickedTween.onComplete.add(super.kill, this);
    }

    kill(){
        this.pickedTween.start();
    }
}