export default class Menu extends Phaser.State {
  
  public create () {
    var text = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, 'MENU', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    text.anchor.set(0.5);

    this.game.input.onDown.add(this.onInputDown, this);
  };

  public update () {};

  public onInputDown () {
    this.game.state.start('game');
  };
}