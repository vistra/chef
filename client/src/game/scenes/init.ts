import * as Phaser from "phaser";

export class InitScene extends Phaser.Scene {

    preload() {
        this.load.image('intro_background', '/assets/intro.png');
    }

    create() {
        this.game.scene.switch('init', 'preloader');
    }

}
