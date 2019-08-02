import * as Phaser from "phaser";
import {gameState, Item, ItemLocation} from "../state";
import {ItemRenderer} from "../item";

export class CabineteScene extends Phaser.Scene {

    private items = {
        [Item.Chocolate]: {
            x: 310,
            y: 350,
            itemRenderer: null,
            stepX: 50
        },
        [Item.Oil]: {
            x: 450,
            y: 185,
            itemRenderer: null,
            stepX: 40
        },
        [Item.Flour]: {
            x: 300,
            y: 210,
            itemRenderer: null,
            stepX: 30
        }
    };
    private cabinet: Phaser.GameObjects.Image;

    preload() {
        this.load.image('cabinet_background', '/assets/cabinet.jpg');
        this.load.image('chocolate', '/assets/chocolate.png');
        this.load.image('oil', '/assets/oil.png');
        this.load.image('flour', '/assets/flour.png');
    }

    create() {
        this.cabinet = this.add.image(0, 0, 'cabinet_background')
            .setOrigin(0, 0)
            .setScale(0.825, 0.568);
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
            let leaving = false;
            this.items[item].itemRenderer.onPointerDown(() => {
                if (!leaving) {
                    leaving = true;
                    gameState.playerTakenItem(item as Item, ItemLocation.Cabinet);
                    setTimeout(() => {
                        this.game.scene.switch('cabinet', 'kitchen');
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
            this.items[item].itemRenderer.setCount(gameState.itemCount(item as Item, ItemLocation.Cabinet));
        }
    }

}