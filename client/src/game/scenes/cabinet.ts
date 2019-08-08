import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {ItemRenderer} from "../item";

export class CabineteScene extends Phaser.Scene {

    private items = {
        [Item.Chocolate]: {
            x: 310,
            y: 335,
            itemRenderer: null,
            stepX: 50
        },
        [Item.Oil]: {
            x: 450,
            y: 170,
            itemRenderer: null,
            stepX: 40
        },
        [Item.Flour]: {
            x: 300,
            y: 195,
            itemRenderer: null,
            stepX: 30
        }
    };
    private cabinet: Phaser.GameObjects.Image;
    private closetSounds: Phaser.Sound.BaseSound;
    private backButton: Phaser.Events.EventEmitter;

    preload() {
        this.load.image('cabinet_background', '/assets/cabinet.jpg');
        this.load.image('back', '/assets/back-button.png');
        this.load.image('chocolate', '/assets/chocolate.png');
        this.load.image('oil', '/assets/oil.png');
        this.load.image('flour', '/assets/flour.png');

        this.load.audio('closet', '/assets/closet.mp3');
    }

    create() {
        this.cabinet = this.add.image(0, 0, 'cabinet_background')
            .setOrigin(0, 0)
            .setScale(0.825, 0.528);

        this.backButton = this.add.image(700, 20, 'back')
            .setScale(0.05)
            .setOrigin(0, 0)
            .setPosition(740, 25)
            .setInteractive()
            .on('pointerdown', () => this.backToKitchen());

        for (const item in this.items) {
            this.items[item].itemRenderer = new ItemRenderer(
                this,
                item.toLowerCase(),
                this.items[item].x,
                this.items[item].y,
                0,
                this.items[item].stepX,
                this.items[item].stepY,
            );
            this.items[item].itemRenderer.onPointerDown(() => {
                if (!this.leaving) {
                    gameState.playerTakenItem(item as Item, ItemLocation.Cabinet);
                    this.backToKitchen();
                }
            });
        }

        this.closetSounds = this.sound.add('closet');
        this.closetSounds.addMarker({
            name: 'closet_close',
            start: 5,
            duration: 2
        });
    }

    update() {
        this.renderItems();
    }

    renderItems() {
        for (const item in this.items) {
            this.items[item].itemRenderer.setCount(gameState.itemCount(item as Item, ItemLocation.Cabinet));
        }
    }

    private leaving: boolean  = false;

    private backToKitchen() {
        if (!this.leaving) {
            this.leaving = true;
            this.closetSounds.play('closet_close');
            setTimeout(() => {
                this.game.scene.switch('cabinet', 'kitchen');
                this.leaving = false;
            }, 500);
        }
    }
}