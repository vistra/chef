import * as Phaser from "phaser";
import {MenuScene} from "./scenes/menu";
import {KitchenScene} from "./scenes/kitchen";
import {FridgeScene} from "./scenes/fridge";
import {CakeDecorationScene} from "./scenes/cake_decoration";
import {CabineteScene} from "./scenes/cabinet";

export const game = new Phaser.Game({
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        mouse: true,
        touch: true
    },
    width: 800,
    height: 600
});

game.scene.add('menu', MenuScene);
game.scene.add('fridge', FridgeScene);
game.scene.add('cabinet', CabineteScene);
game.scene.add('cake_decoration', CakeDecorationScene);
game.scene.add('kitchen', KitchenScene, true);

(window as any).game = game;