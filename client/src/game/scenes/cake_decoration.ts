import * as Phaser from "phaser";
import {gameState, ICakeDecoration} from "../state";
import {Cake} from "../cake";
import Pointer = Phaser.Input.Pointer;

export class CakeDecorationScene extends Phaser.Scene {
    private brushImage: Phaser.GameObjects.Image;
    private brushType: string;

    private decorations: ICakeDecoration[] = [];
    private cake: Cake;

    preload() {
        this.load.image('cake_decoration_background', '/assets/cake_decoration_background.png');
        this.load.image('cake_big', '/assets/cake.png');
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
        this.load.image('turqoise', '/assets/cupcake_turqoise.png');
        this.load.image('v', '/assets/v.png');
    }

    create() {
        this.add.image(0, 0, 'cake_decoration_background')
            .setOrigin(0, 0);
        this.cake = new Cake(this, 150, 10, 0.37,[]);

        this.cake.cakeImage.on('pointerdown', (pointer: Pointer) => {
            this.addDecoration(pointer);
        });

        this.brushImage = this.add.image(0, 0, 'topping1')
            // .setOrigin(0, 0)
            .setScale(0.15)
            .setAlpha(0.5)
            .setVisible(false);

        this.add.image(400, 490, 'v')
            .setInteractive()
            .on('pointerdown', () => {
               this.finished();
            });

        const toppings = [
            { index: 0, x: 50, y: 20 },
            { index: 1, x: 50, y: 60 },
            { index: 2, x: 50, y: 100 },
            { index: 3, x: 50, y: 140 },
            { index: 4, x: 50, y: 180 },
            { index: 5, x: 50, y: 220 },
            { index: 6, x: 50, y: 260 },
            { index: 7, x: 50, y: 300 },
            { index: 8, x: 700, y: 20 },
            { index: 9, x: 700, y: 60 },
            { index: 10, x: 700, y: 100 },
            { index: 11, x: 700, y: 140 },
            { index: 12, x: 700, y: 180 },
            { index: 13, x: 700, y: 220 },
            { index: 14, x: 700, y: 260 },
            { index: 15, x: 700, y: 300 },
        ];

        for (const topping of toppings) {
            const brush = this.physics.add.image(topping.x, topping.y, 'cake_toppings')
                .setTexture(`topping${topping.index + 1}`)
                .setOrigin(0,0)
                .setScale(0.2);
            brush.setInteractive();
            brush.on('pointerdown', () => {
                this.selectBrush(`topping${topping.index + 1}`);
            })
        }
    }

    update() {
        this.brushImage.setPosition(
            this.input.mousePointer.x,
            this.input.mousePointer.y
        )
    }

    selectBrush(type: string) {
        this.brushImage.setTexture(type);
        this.brushImage.setVisible(true);
        this.brushType = type;
    }

    addDecoration(pointer: Pointer) {
        if (this.brushType) {
            this.decorations.push({
                type: this.brushType,
                x: (pointer.x - this.cake.cakeImage.x) / (this.cake.cakeImage.width * this.cake.scale),
                y: (pointer.y - this.cake.cakeImage.y) / (this.cake.cakeImage.height * this.cake.scale)
            });
            this.cake.setDecoration(this.decorations);
        }
    }

    private finished() {
        gameState.dishDecorated(this.decorations);
        this.game.scene.switch('cake_decoration', 'kitchen');
    }
}
