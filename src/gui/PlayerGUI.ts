
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

    private shipDied(){
        this.upgradeCounter.completeReset();
        this.playerDetails.addToLives(-1);
    }
}