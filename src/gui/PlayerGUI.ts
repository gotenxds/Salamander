
import PlayerDetails from "./playerDetails";
import UpgradeCoutner from "./upgradeCounter";
import Ship from "../ship/ship";
import Game = Phaser.Game;
export default class PlayerGUI{
    private ship:Ship;
    private playerDetails:PlayerDetails;
    private upgradeCounter:UpgradeCoutner;

    constructor(game:Game, ship:Ship){
        this.ship = ship;
        this.playerDetails = new PlayerDetails(game);
        this.upgradeCounter = new UpgradeCoutner(game, ship);

        this.ship.onEnemyKilled.add(args => this.playerDetails.addToScore(args.monster.getPoints()));
        this.ship.onUpgradePickup.add(ship => this.upgradeCounter.selectNext());
        this.ship.onDeath.add(() => this.shipDied());
    }

    multiplayerMode(leftSide:boolean = true){
        this.upgradeCounter.scale.set(.6);
        this.upgradeCounter.y = this.playerDetails.height + 10;

        if (leftSide){
            this.playerDetails.x += 70;

            this.upgradeCounter.x = 200;
        }else{
            this.playerDetails.scale.set(-1, 1);

            this.playerDetails.x = this.ship.game.width  - 70;
            this.upgradeCounter.x = this.ship.game.width -210;
        }
    }

    private shipDied(){
        this.upgradeCounter.completeReset();
        this.playerDetails.addToLives(-1);
    }
}