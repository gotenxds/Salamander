import NineImage from "../utils/NineImage";
import Game = Phaser.Game;
import Sprite = Phaser.Sprite;
import TextAsImage from "./textAsImage";
export default class SinglePLayerGUI extends Sprite {
    private scoreText:TextAsImage;
    private livesText:TextAsImage;
    private score:number = 0;
    private lives:number = 2;

    constructor(game:Game) {
        super(game, 0, 0, NineImage.create(game, 295, 77, 'playerPanel', 0, 0, 0, 80, 60));
        game.world.add(this);

        let playerIcon = this.createPlayerIcon(game, 'player1_icon');
        let playerIconBackground = SinglePLayerGUI.createPlayerIconBackground(game, 'playerIconBackground');
        let livesIcon = SinglePLayerGUI.createLivesIconBackground(game, playerIcon, 'lives_icon');
        let XIcon = SinglePLayerGUI.createXIconBackground(game, livesIcon, playerIcon, 'lives_X');
        this.createTextAsImages(game, playerIcon, XIcon);

        this.addChild(playerIconBackground);
        this.addChild(playerIcon);
        this.addChild(livesIcon);
        this.addChild(XIcon);
        this.addChild(this.scoreText);
        this.addChild(this.livesText);

        this.scoreText.update();
        this.livesText.update();
    }

    private createTextAsImages(game, playerIcon, XIcon) {
        this.scoreText = new TextAsImage(game, 'score_numbers', playerIcon.width + 5, 5, this.buildFormattedScore());
        this.livesText = new TextAsImage(game, 'score_numbers', XIcon.x + XIcon.width, playerIcon.height / 2 + 10, this.lives.toString());
        this.livesText.scale.set(.9, .9);
    };

    private static createPlayerIconBackground(game:Game, tag:string):Sprite {
        let playerIconBackground = game.add.sprite(-7, -1.5, tag);
        playerIconBackground.width = 83;
        playerIconBackground.height = 83;

        return playerIconBackground;
    };

    private createPlayerIcon(game:Game, tag:string):Sprite {
        let playerIcon = game.add.sprite(2, 5, tag);
        playerIcon.width = 63;
        playerIcon.height = 63;

        return playerIcon;
    };

    private static createLivesIconBackground(game:Game, playerIcon:Sprite, tag:string):Sprite {
        let livesIcon = game.add.sprite(playerIcon.width + 15, playerIcon.height / 2 + 5, tag);
        livesIcon.scale.set(.65, .65);

        return livesIcon;
    };

    private static createXIconBackground(game:Game, livesIcon:Sprite, playerIcon:Sprite, tag:string):Sprite {
        let XIcon = game.add.sprite(livesIcon.x + livesIcon.width + 8, playerIcon.height / 2 + 13, 'lives_X');
        XIcon.scale.set(1.1, 1.1);

        return XIcon;
    };

    addToScore(addition:number):void {
        this.score += addition;
        this.scoreText.setText(this.buildFormattedScore());
    }

    addToLives(addition:number):void {
        this.lives += addition;
        this.livesText.setText(this.lives.toString());

        if (this.lives < 0){
            alert("Dead bitch !");
        }
    }

    private buildFormattedScore() {
        let score = this.score.toString();
        let formattedScore = '';
        for (let i = score.length - 1; i >= 0; i--) {
            if (SinglePLayerGUI.thereShouldBeACommaHere(i, score)) {
                formattedScore = `,${score[i] + formattedScore}`;
            } else {
                formattedScore = score[i] + formattedScore;
            }
        }

        return formattedScore;
    };

    private static thereShouldBeACommaHere(i, score) {
        return i > 0 && (score.length - i) % 3 === 0;
    };
}