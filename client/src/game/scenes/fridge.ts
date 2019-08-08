import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {ItemRenderer} from "../item";

export class FridgeScene extends Phaser.Scene {

    private items = {
        [Item.Egg]: {
            x: 225,
            y: 215,
            spacing: 40,
            scaleX: 1,
            scaleY: 1,
            itemRenderer: null,
        },
        [Item.Butter]: {
            x: 290,
            y: 125,
            spacing: 40,
            scaleX: 1,
            scaleY: 1,
            itemRenderer: null,
        }
    };
    private fridgeImage: Phaser.GameObjects.Image;
    private fridgeSounds: Phaser.Sound.BaseSound;
    private closetSounds: Phaser.Sound.BaseSound;
    private backButton: Phaser.Events.EventEmitter;

    preload() {
        // this.load.image('fridge_background', '/assets/fridge_background.png');
        this.load.image('fridge_background', '/assets/stock-vector-fridge-in-cartoon-style-open-and-closed-refrigerator-vector-illustration-716580310.jpg');
        this.load.image('back', '/assets/back-button.png');
        this.load.image('egg', '/assets/egg.png');
        this.load.image('butter', '/assets/butter.png');

        this.load.audio('fridge', '/assets/fridge.mp3');
    }

    create() {
        this.fridgeImage = this.add.image(20, 0, 'fridge_background')
            .setOrigin(0, 0)
            .setScale(0.8, 0.5);
        this.backButton = this.add.image(700, 20, 'back')
            .setScale(0.05  )
            .setOrigin(0, 0)
            .setPosition(675, 25)
            .setInteractive()
            .on('pointerdown', () => this.backToKitchen());

        for (const item in this.items) {
            this.items[item].itemRenderer = new ItemRenderer(
                this,
                item.toLowerCase(),
                this.items[item].x,
                this.items[item].y,
                0,
                this.items[item].spacing,
                0,
                this.items[item].scaleX,
                this.items[item].scaleY,
            );
            let leaving = false;
            this.items[item].itemRenderer.onPointerDown(() => {
                if (!leaving) {
                    leaving = true;
                    gameState.playerTakenItem(item as Item, ItemLocation.Fridge);
                    this.backToKitchen();
                }
            });
        }

        this.fridgeSounds = this.sound.add('fridge');
        this.fridgeSounds.addMarker({
            name: 'fridge_close',
            start: 10,
            duration: 1
        });

    }

    update() {
        this.renderItems();
    }

    renderItems() {
        for (const item in this.items) {
            this.items[item].itemRenderer.setCount(gameState.itemCount(item as Item, ItemLocation.Fridge));
        }
    }

    private leaving: boolean  = false;

    private backToKitchen() {
        if (!this.leaving) {
            this.leaving = true;
            this.fridgeSounds.play('fridge_close');
            setTimeout(() => {
                this.game.scene.switch('fridge', 'kitchen');
                this.leaving = false;
            }, 500);
        }
    }

}