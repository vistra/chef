import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {Cake} from "../cake";

export class DinnerScene extends Phaser.Scene {
    private backgroundImage: Phaser.Physics.Arcade.Image;
    private cake: Cake;
    private replayButton: Phaser.Events.EventEmitter;
    private song: Phaser.Sound.BaseSound;

    preload() {
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

        this.song = this.sound.add('happybirthday_song');
        this.song.addMarker({
            name: 'song',
            start:  5,
            duration: 60
        });
        this.song.play('song');
    }

    update() {
    }

    private newGame() {
        this.song.stop();
        this.game.scene.getScenes(null).forEach(
            s => {
                if (s.scene.key != 'preload' && s.scene.key != 'init' && s.scene.key != 'dinner') {
                    s.scene.stop();
                }
            }
        );
        gameState.newGame();
        this.scene.start('intro');
    }
}