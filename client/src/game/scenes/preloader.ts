import * as Phaser from "phaser";
import {gameState, Items} from "../state";

export class PreloaderScene extends Phaser.Scene {
    private backgroundImage: Phaser.Physics.Arcade.Image;
    private progressbar: Phaser.GameObjects.Graphics;
    private window: Phaser.GameObjects.Graphics;
    private loadingText: Phaser.GameObjects.Text;

    preload() {
        this.load.on('progress', (p) => this.onProgress(p));
        this.load.once('complete', () => this.onComplete());

        this.load.image('intro_front', '/assets/intro-front.png');
        this.load.image('dashboard', '/assets/dashboard.png');
        this.load.image('sound_button', '/assets/sound_button.png');
        this.load.image('objective_item_count', '/assets/objective_item.png');
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

        this.load.image('instructions', '/assets/instructions.png');
        this.load.image('kitchen_background', '/assets/kitchen.jpg');
        this.load.image('kid', '/assets/kid.png');
        this.load.image('butter', '/assets/butter.png');
        this.load.image('egg', '/assets/egg.png');
        this.load.image('chocolate', '/assets/chocolate.png');
        this.load.image('oil', '/assets/oil.png');
        this.load.image('flour', '/assets/flour.png');
        this.load.image('cake', '/assets/cake.png');
        this.load.image('fridge_background', '/assets/stock-vector-fridge-in-cartoon-style-open-and-closed-refrigerator-vector-illustration-716580310.jpg');
        this.load.image('back', '/assets/back-button.png');

        this.load.image('cabinet_background', '/assets/cabinet.jpg');

        this.load.spritesheet('sandclock_anim', '/assets/sandclock.png', {frameWidth: 870/3 - 2, frameHeight: 930/2 - 4});
        this.load.spritesheet('chef_left', '/assets/chef_orig_transparent.png', {frameWidth: 188, frameHeight: 336});
        this.load.spritesheet('chef_right', '/assets/imageedit_3_8711632043.png', {frameWidth: 188, frameHeight: 335});

        this.load.audio('steps', '/assets/steps in wood floor.wav');
        this.load.audio('oven', '/assets/oven.mp3');
        this.load.audio('oven_open_close', '/assets/oven_open_close.mp3');
        this.load.audio('fridge', '/assets/fridge.mp3');
        this.load.audio('closet', '/assets/closet.mp3');
        this.load.audio('magic', '/assets/magic.mp3');
        this.load.audio('wrong_item', '/assets/wrong_item.mp3');

        for (const item of Items) {
            for (const count of [1,2,3]) {
                this.load.audio(`${count}-${item}`, `/assets/${count}-${item.toLowerCase()}.mp3`);
            }
        }

        this.load.audio('inst_mix', `/assets/inst_mix.mp3`);
        this.load.audio('inst_decorate', `/assets/inst_decorate.mp3`);
        this.load.audio('inst_put_in_oven', `/assets/inst_put_in_oven.mp3`);
        this.load.audio('inst_wait', `/assets/inst_wait.mp3`);
        this.load.audio('inst_take_from_oven', `/assets/inst_take_from_oven.mp3`);
        this.load.audio('inst_beteavon', `/assets/inst_beteavon.mp3`);

        this.load.audio('one-female-final', `/assets/one-female-final.mp3`);
        this.load.audio('two-female-final', `/assets/two-female-final.mp3`);
        this.load.audio('three-female-final', `/assets/three-female-final.mp3`);
        this.load.audio('one-female-not-final', `/assets/one-female-not-final.mp3`);
        this.load.audio('two-female-not-final', `/assets/two-female-not-final.mp3`);
        this.load.audio('one-male-final', `/assets/one-male-final.mp3`);
        this.load.audio('two-male-final', `/assets/two-male-final.mp3`);
        this.load.audio('three-male-final', `/assets/three-male-final.mp3`);
        this.load.audio('one-male-not-final', `/assets/one-male-not-final.mp3`);
        this.load.audio('two-male-not-final', `/assets/two-male-not-final.mp3`);

        this.load.image('cake_decoration_background', '/assets/cake_decoration_background.png');
        this.load.image('v', '/assets/v.png');

        this.load.audio('squish', '/assets/squish.mp3');

        this.load.image('dinner', '/assets/dinner2.png');
        this.load.image('replay', '/assets/replay.png');
        this.load.audio('happybirthday_song', '/assets/happybirthday.mp3');

        this.backgroundImage = this.physics.add.image(0, 0, 'intro_background')
            .setOrigin(0, 0)
            .setScale(0.41);

        this.window = this.add.graphics()
            .fillStyle(0x99cc, 1)
            .fillRect(170, 240, 430, 110);

        this.loadingText = this.add.text(335, 270, "Loading..");

        this.progressbar = this.add.graphics();
    }

    create() {
    }

    private onProgress(p: number) {
        const width = 370;
        const height = 20;
        const x = 200;
        const y = 300;

        if (this.progressbar) {
            this.progressbar.fillStyle(0xffffff, 1);
            this.progressbar.fillRect(x, y, p * width, height);
            this.loadingText.setText(`Loading.. (${Math.floor(p*100)}%)`);
        }
    }

    private onComplete() {
        this.load.off('progress');
        this.game.scene.switch('preloader', 'intro');
    }

    update() {}
}