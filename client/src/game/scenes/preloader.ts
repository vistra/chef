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

        this.load.image('intro_front', 'https://res.cloudinary.com/vistra/image/upload/v1565440899/intro-front_y4u6oh.png');
        this.load.image('dashboard', 'https://res.cloudinary.com/vistra/image/upload/v1565440777/dashboard_hf084w.png');
        this.load.image('sound_button', 'https://res.cloudinary.com/vistra/image/upload/v1565440776/sound_button_jvhhuj.png');
        this.load.image('objective_item_count', 'https://res.cloudinary.com/vistra/image/upload/v1565440777/objective_item_ioay77.png');
        this.load.image('topping1', 'https://res.cloudinary.com/vistra/image/upload/v1565440769/topping1_zh3poc.png');
        this.load.image('topping2', 'https://res.cloudinary.com/vistra/image/upload/v1565440774/topping2_zkj8bd.png');
        this.load.image('topping3', 'https://res.cloudinary.com/vistra/image/upload/v1565440763/topping3_jghdsw.png');
        this.load.image('topping4', 'https://res.cloudinary.com/vistra/image/upload/v1565440762/topping4_uwgjqs.png');
        this.load.image('topping5', 'https://res.cloudinary.com/vistra/image/upload/v1565440759/topping5_txafas.png');
        this.load.image('topping6', 'https://res.cloudinary.com/vistra/image/upload/v1565440757/topping6_sprsmt.png');
        this.load.image('topping7', 'https://res.cloudinary.com/vistra/image/upload/v1565440754/topping7_edazb4.png');
        this.load.image('topping8', 'https://res.cloudinary.com/vistra/image/upload/v1565440764/topping8_kse4s3.png');
        this.load.image('topping9', 'https://res.cloudinary.com/vistra/image/upload/v1565440752/topping9_nevqti.png');
        this.load.image('topping10', 'https://res.cloudinary.com/vistra/image/upload/v1565440768/topping10_vw9teu.png');
        this.load.image('topping11', 'https://res.cloudinary.com/vistra/image/upload/v1565440749/topping11_xgxxrc.png');
        this.load.image('topping12', 'https://res.cloudinary.com/vistra/image/upload/v1565440746/topping12_dtc4js.png');
        this.load.image('topping13', 'https://res.cloudinary.com/vistra/image/upload/v1565440743/topping13_aybm3x.png');
        this.load.image('topping14', 'https://res.cloudinary.com/vistra/image/upload/v1565440751/topping14_pjinxz.png');
        this.load.image('topping15', 'https://res.cloudinary.com/vistra/image/upload/v1565440726/topping15_tnmc6d.png');
        this.load.image('topping16', 'https://res.cloudinary.com/vistra/image/upload/v1565440762/topping16_ul9siz.png');

        this.load.image('instructions', 'https://res.cloudinary.com/vistra/image/upload/v1565440719/instructions_wn24qr.png');
        this.load.image('kitchen_background', 'https://res.cloudinary.com/vistra/image/upload/v1565440631/kitchen_smcylj.jpg');
        // this.load.image('kid', '/assets/kid.png');
        this.load.image('butter', 'https://res.cloudinary.com/vistra/image/upload/v1565440782/butter_s2jgqa.png');
        this.load.image('egg', 'https://res.cloudinary.com/vistra/image/upload/v1565440782/egg_efrkir.png');
        this.load.image('chocolate', 'https://res.cloudinary.com/vistra/image/upload/v1565440781/chocolate_kv0er7.png');
        this.load.image('oil', 'https://res.cloudinary.com/vistra/image/upload/v1565440780/oil_uf8iq5.png');
        this.load.image('flour', 'https://res.cloudinary.com/vistra/image/upload/v1565440779/flour_ncbf73.png');
        this.load.image('cake', 'https://res.cloudinary.com/vistra/image/upload/v1565440869/cake_ococlh.png');
        this.load.image('fridge_background', 'https://res.cloudinary.com/vistra/image/upload/v1565440594/stock-vector-fridge-in-cartoon-style-open-and-closed-refrigerator-vector-illustration-716580310_f6ijr8.jpg');
        this.load.image('back', 'https://res.cloudinary.com/vistra/image/upload/v1565440749/back-button_jmlywr.png');

        this.load.image('cabinet_background', 'https://res.cloudinary.com/vistra/image/upload/v1565440691/cabinet_ma1myf.jpg');

        this.load.spritesheet('sandclock_anim', 'https://res.cloudinary.com/vistra/image/upload/v1565440750/sandclock_drokuc.png', {frameWidth: 870/3 - 2, frameHeight: 930/2 - 4});
        this.load.spritesheet('chef_left', 'https://res.cloudinary.com/vistra/image/upload/v1565440903/chef_orig_transparent_ht1vp2.png', {frameWidth: 188, frameHeight: 336});

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

        this.load.image('cake_decoration_background', 'https://res.cloudinary.com/vistra/image/upload/v1565440853/cake_decoration_background_rzddmi.png');
        this.load.image('v', 'https://res.cloudinary.com/vistra/image/upload/v1565440845/v_twby6r.png');

        this.load.audio('squish', '/assets/squish.mp3');

        this.load.image('dinner', 'https://res.cloudinary.com/vistra/image/upload/v1565440895/dinner2_kol2xq.png');
        this.load.image('replay', 'https://res.cloudinary.com/vistra/image/upload/v1565440872/replay_oitbfi.png');
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