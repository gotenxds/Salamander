/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import Boot from "./boot";
import Preloader from "./preloader";
import Menu from "./menu";
import FirstStage from "./game";

let game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'salamander-game');
game.state.add('boot', new Boot);
game.state.add('preloader', new Preloader);
game.state.add('menu', new Menu());
game.state.add('game', new FirstStage('map1', '/assets/stages/1/'));
game.state.start('boot');
