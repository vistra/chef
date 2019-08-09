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
    private backButton: Phaser.Events.EventEmitter;
    private leaving: boolean  = false;


    preload() {}

    create() {
        this.leaving = false;
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
            this.items[item].itemRenderer.onPointerDown(() => {
                if (!this.leaving) {
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