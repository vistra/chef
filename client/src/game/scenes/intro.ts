import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";

export class IntroScene extends Phaser.Scene {
    private backgroundImage: Phaser.Physics.Arcade.Image;
    private frontImage: Phaser.Events.EventEmitter;

    preload() {
        this.load.image('background', '/assets/intro.png');
        this.load.image('front', '/assets/intro-front.png');
    }

    create() {
        this.backgroundImage = this.physics.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setScale(0.41);
        this.frontImage = this.physics.add.image(100, 90, 'front')
            .setOrigin(0, 0)
            .setScale(0.6)
            .setInteractive()
            .on('pointerdown', () => this.newGame());
    }

    update() {
    }

    private newGame() {
        gameState.newGame();
        this.game.scene.switch('intro', 'kitchen');
    }
}