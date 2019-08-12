import * as Phaser from "phaser";

export class InitScene extends Phaser.Scene {

    preload() {
        this.load.image('intro_background', 'https://res.cloudinary.com/vistra/image/upload/v1565440747/intro_zglclu.png');
    }

    create() {
        this.game.scene.switch('init', 'preloader');
    }

}
