import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {Cake} from "../cake";

export class DinnerScene extends Phaser.Scene {
    private backgroundImage: Phaser.Physics.Arcade.Image;
    private cake: Cake;
    private replayButton: Phaser.Events.EventEmitter;
    private song: Phaser.Sound.BaseSound;

    preload() {
        this.load.image('dinner', '/assets/dinner2.png');
        this.load.image('replay', '/assets/replay.png');

        this.load.image('cake', '/assets/cake.png');
        this.load.image('topping1', '/assets/topping1.png');
        this.load.image('topping2', '/assets/topping2.png');
        this.load.image('topping3', '/assets/topping3.png');
        this.load.image('topping4', '/assets/topping4.png');
        this.load.image('topping5', '/assets/topping5.png');
        this.load.image('topping6', '/assets/topping6.png');
        this.load.image('topping7', '/assets/topping7.png');
        this.load.image('topping8', '/assets/topping8.png');
        this.load.image('topping9', '/assets/topping9.png');
        this.load.image('topping10', '/assets/topping10.png');
        this.load.image('topping11', '/assets/topping11.png');
        this.load.image('topping12', '/assets/topping12.png');
        this.load.image('topping13', '/assets/topping13.png');
        this.load.image('topping14', '/assets/topping14.png');
        this.load.image('topping15', '/assets/topping15.png');
        this.load.image('topping16', '/assets/topping16.png');

        this.load.audio('song', '/assets/happybirthday.mp3');
    }

    create() {
        this.backgroundImage = this.physics.add.image(0, 0, 'dinner')
            .setScale(0.26)
            .setOrigin(0, 0);
            // .setScale(0.41);
        this.replayButton = this.physics.add
            .image(630, 25, 'replay')
            .setOrigin(0, 0)
            .setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => this.newGame());
        this.cake = new Cake(this, 240, 310, 0.17, gameState.dishDecoration);

        this.song = this.sound.add('song');
        this.song.play();
    }

    update() {
    }

    private newGame() {
        gameState.newGame();
        this.song.stop();
        this.game.scene.switch('dinner', 'kitchen');
    }
}