import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {ItemRenderer} from "../item";

export class FridgeScene extends Phaser.Scene {

    private items = {
        [Item.Egg]: {
            x: 250,
            y: 240,
            spacing: 40,
            scaleX: 1,
            scaleY: 1,
            itemRenderer: null,
        },
        [Item.Butter]: {
            x: 330,
            y: 140,
            spacing: 40,
            scaleX: 1,
            scaleY: 1,
            itemRenderer: null,
        }
    };
    private fridgeImage: Phaser.GameObjects.Image;

    preload() {
        // this.load.image('fridge_background', '/assets/fridge_background.png');
        this.load.image('fridge_background', '/assets/stock-vector-fridge-in-cartoon-style-open-and-closed-refrigerator-vector-illustration-716580310.jpg');
        this.load.image('egg', '/assets/egg.png');
        this.load.image('butter', '/assets/butter.png');
    }

    create() {
        this.fridgeImage = this.add.image(0, 0, 'fridge_background')
            .setOrigin(0, 0)
            .setScale(1, 0.55);
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
                    setTimeout(() => {
                        this.game.scene.switch('fridge', 'kitchen');
                        leaving = false;
                    }, 500);
                }
            });
        }
    }

    update() {
        this.renderItems();
    }

    renderItems() {
        for (const item in this.items) {
            this.items[item].itemRenderer.setCount(gameState.itemCount(item as Item, ItemLocation.Fridge));
        }
    }

}