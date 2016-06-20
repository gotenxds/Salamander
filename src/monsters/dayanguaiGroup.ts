import Dayanguai from "./dayanguai";
import Game = Phaser.Game;
import {linearPath} from "../utils/pathUtils";
import Point = Phaser.Point;
import Group = Phaser.Group;
export default class DayanguaiGroup extends Group {
    private static initialOffset:number = 100;
    private game:Game;
    private pathPoints : {x:number[],y:number[]};
    private lead:Dayanguai;
    private dayanguais:Dayanguai[] = [];

    constructor(game:Game, y:number, amount:number = 5) {
        super(game, game.world);
        this.game = game;
        this.pathPoints = Dayanguai.generatePathPoints(game.width, y, game.world.centerY);
        this.dayanguais.push(new Dayanguai(game, game.width, y, this.pathPoints));

        for (let i = 1; i < amount; i++) {
            let x = game.width + i * DayanguaiGroup.initialOffset;
            let followe = this.dayanguais[i-1];

            let dayanguai = new Dayanguai(game, x , y, null);
            dayanguai.setPath(linearPath(new Point(x, y), new Point(followe.x, followe.y)));

            this.dayanguais.push(dayanguai);
        }

        this.lead = this.dayanguais[0];

        let monsters = this.game.world.getByName('monsters');
        this.dayanguais.forEach(daynguai => {
            daynguai.events.onKilled.addOnce((args) => this.onKill(args));
            monsters.add(daynguai, false);
        });
    }

    update(){
        for(let i = 1; i < this.dayanguais.length; i++){

            let followe = this.dayanguais[i-1];
            let dayanguai = this.dayanguais[i];
            if (!dayanguai.hasWhereToGo()){
                DayanguaiGroup.setPathToFollow(dayanguai, followe);
            }
        }
    }

    private static setPathToFollow(follower:Dayanguai, followe:Dayanguai){
        follower.setPath(linearPath(new Point(follower.x, follower.y), new Point(followe.x, followe.y)));
    }

    private onKill(dayanguai){
        let index = this.dayanguais.indexOf(dayanguai);
        this.dayanguais.splice(index, 1);
        let follower = this.dayanguais[index];

        if(this.dayanguais.length > 0){
            if (dayanguai === this.lead){
                this.lead = this.dayanguais[0];
            }

            if (follower){
                DayanguaiGroup.setPathToFollow(follower, dayanguai);
                follower.setPath(follower.getPath().concat(dayanguai.getRemainingPath()));
            }
        }else{
            let upgrade = this.game.world.getByName('upgrades').getFirstDead(true, dayanguai.x, dayanguai.y);
            upgrade.revive();

            this.destroy();
        }
    }
}