import Group = Phaser.Group;
import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
export default class TextAsImage extends Group {
    private tag:string;
    private maxChars:number;
    private textHight:number;
    private text:string;
    private dirty:boolean = true;

    constructor(game:Game, tag:string, x:number = 0, y:number = 0, text:string = '', maxChars:number = Infinity, height:number = -1) {
        super(game);

        this.tag = tag;
        this.maxChars = maxChars;
        this.text = text;
        this.x = x;
        this.y = y;

        if (height === -1) {
            this.textHight = this.game.cache.getImage(tag).height;
        }
    }

    setText(text:string):void {
        this.dirty = this.text !== text;
        this.text = text;
        this.update();
    }

    update():void {
        if (this.dirty) {
            this.dirty = false;

            this.forEachAlive(letter => letter.kill(), this);
            let x = 0;
            let y = 0;
            let charSprite:Sprite;

            for (let char of this.text) {
                charSprite = this.getFirstDead(true, x, y, this.tag, char);

                charSprite.revive();
                x += charSprite.width;
            }
        }
    }
}