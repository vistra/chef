import * as Phaser from "phaser";
import * as _ from "lodash";
import {gameState, Item, ItemLocation} from "../state";
import {ItemRenderer} from "../item";
import {Cake} from "../cake";
import {Dashboard} from "../dashboard";

export class KitchenScene extends Phaser.Scene {

    private playerGroup: Phaser.Physics.Arcade.Group;
    private playerItem: Phaser.Physics.Arcade.Image | Cake;
    private clock: Phaser.Physics.Arcade.Sprite;
    private player: Phaser.Physics.Arcade.Sprite;
    private kitchen_background: Phaser.GameObjects.Image;

    private workspaceItems: Partial<{[item in Item]: ItemRenderer}> = {};
    private cake: Cake;
    private dishInTool: Cake;
    private dashboard: Dashboard;

    preload() {
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

        this.load.image('kitchen_background', '/assets/stock-vector-vector-modern-kitchen-interior-background-template-cartoon-dinner-room-illustration-with-furniture-1021226995.jpg');
        this.load.image('kid', '/assets/kid.png');
        this.load.image('butter', '/assets/butter.png');
        this.load.image('egg', '/assets/egg.png');
        this.load.image('chocolate', '/assets/chocolate.png');
        this.load.image('oil', '/assets/oil.png');
        this.load.image('flour', '/assets/flour.png');
        this.load.image('cake', '/assets/cake.png');
        this.load.image('cake_small', '/assets/cake_small.png');
        this.load.image('cake_tiny', '/assets/cake_tiny.png');
        this.load.spritesheet('sandclock_anim', '/assets/sand_clock.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('chef_left', '/assets/chef_orig_transparent.png', {frameWidth: 188, frameHeight: 336});
        this.load.spritesheet('chef_right', '/assets/imageedit_3_8711632043.png', {frameWidth: 188, frameHeight: 335});
    }

    create() {
        this.kitchen_background = this.add.image(0, 0, 'kitchen_background')
            .setOrigin(0,0)
            .setScale(0.54,0.45);

        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .setEmitOnRepeat(true)
            .on('down', () => this.handleSpaceClick());

        this.dashboard = new Dashboard(this, 0, 400);

        // Workspace
        // this.dishImage = this.physics.add.image(540, 150, 'cake_small');
        // this.dishImage.setVisible(false);
        // this.dishInToolImage = this.physics.add.image(620, 280, 'cake_tiny');
        this.dishInTool = new Cake(this, 452, 275, 0.03, []);
        this.dishInTool.setVisible(false);
        this.dishInTool.setAlpha(0.6);
        gameState.objective.ingredients.forEach((ingredient, ind) => {
            const scale = ingredient.item == Item.Egg ? 0.5 : 1;
            const offsetY = ingredient.item == Item.Egg ? 30 : 0;
            this.workspaceItems[ingredient.item] = new ItemRenderer(
                this,
                ingredient.item.toLowerCase(),
                70 + 10 * ind,
                190 + offsetY + 10 * ind,
                1,
                20,
                0,
                scale,
                scale
            )
        });

        this.clock = this.physics.add.sprite(0, 0, 'clock')
            .setOrigin(0, 0)
            .setVisible(false);

        this.anims.create({
            key: 'clock_anim',
            frames: this.anims.generateFrameNames('sandclock_anim', { start: 0, end: 4 }),
            frameRate: 1,
            repeat: 1
        });

        this.anims.create({
            key: 'chef_walk_left_anim',
            frames: this.anims.generateFrameNames('chef_left', { start: 0, end: 24 }),
            frameRate: 36,
            repeat: 1
        });

        this.anims.create({
            key: 'chef_stand_anim',
            frames: [{key: 'chef_left', frame: 1 }],
            frameRate: 20,
        });

        this.cake = new Cake(this, 50, 190, 0.05, []);
        this.cake.setVisible(false);

        this.player = this.physics.add.sprite(200, 250, 'chef-left')
            .setCollideWorldBounds(true)
            .setBounce(0)
            .setDepth(100);
        this.playerItem = this.physics.add.image(
            this.player.x + 20,
            this.player.y + 20,
            'egg'
        ).setDepth(200);

        this.playerGroup = this.physics.add.group();
        this.playerGroup.add(this.player);
        this.playerGroup.add(this.playerItem);
    }

    update() {
        this.updatePlayer();
        this.updateWorkspace();
        this.updateOven();
        this.dashboard.update();
    }

    private playerDirection: "left" | "right";
    private updatePlayer() {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play('chef_walk_left_anim', true);
            this.player.setScale(1, 1);
            this.playerDirection = 'left';
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play('chef_walk_left_anim', true);
            this.player.setScale(-1, 1);
            this.playerDirection = 'right';
        } else {
            this.playerGroup.setVelocityX(0);
            this.player.anims.play('chef_stand_anim', true)
        }

        if (this.playerDirection == 'left') {
            this.playerItem.setPosition(
                this.player.x - 30 + (this.playerItem instanceof Cake ? -45 : 0),
                this.player.y + 20 + (this.playerItem instanceof Cake ? -30 : 0)
            );
        } else if (this.playerDirection == 'right') {
            this.playerItem.setPosition(
                this.player.x + 30 + (this.playerItem instanceof Cake ? -15 : 0),
                this.player.y + 20 + (this.playerItem instanceof Cake ? -30 : 0)
            )
        }

        if (gameState.state == 'dish_in_making') {
            if (gameState.player.holds != null) {
                const playerItem = this.playerItem as Phaser.Physics.Arcade.Image;
                playerItem.setTexture(gameState.player.holds.toLowerCase());
                playerItem.setVisible(true);
            } else {
                this.playerItem.setVisible(false);
            }
        } else if (gameState.state == 'player_took_dish' || gameState.state == 'player_took_cooked_dish') {
            if (!(this.playerItem instanceof Cake)) {
                this.playerItem.setVisible(false);
                this.playerItem = new Cake(this, this.player.x + 20, this.player.y + 20, 0.05, gameState.dishDecoration);
                this.playerItem.setDepth(200);
            }
            this.playerItem.setVisible(true);
        } else if (gameState.state == 'dish_in_tool') {
            this.playerItem.setVisible(false);
        }
    }

    private updateWorkspace() {
        if (gameState.state == 'dish_in_making') {
            _.forOwn(this.workspaceItems, (itemRenderer: ItemRenderer, item: Item) => {
                itemRenderer.setCount(gameState.itemCount(item, ItemLocation.Workspace));
            });
        } else {
            _.forOwn(this.workspaceItems, (itemRenderer: ItemRenderer) => {
                itemRenderer.setCount(0);
            });
            if (this.cake) {
                this.cake.setDecoration(gameState.dishDecoration);
                this.cake.setVisible(
                    gameState.state == 'ingredients_mixed' || gameState.state == 'dish_decorated'
                );
            }
        }
    }

    private handleSpaceClick() {
        if (this.player.x > 630 && this.player.x < 730) {
            this.goToFridge();
        } else if (this.player.x > 260 && this.player.x < 370) {
            this.goToCabinet();
        } else if (this.player.x > 100 && this.player.x < 200) {
            this.workspaceInteraction();
        } else if (this.player.x > 430 && this.player.x < 510) {
            this.ovenInteraction();
        }
    }

    private goToFridge() {
        this.game.scene.switch('kitchen', 'fridge');
    }

    private goToCabinet() {
        this.game.scene.switch('kitchen', 'cabinet');
    }

    private goToCakeDecoration() {
        this.game.scene.switch('kitchen', 'cake_decoration');
    }

    private mixingIngredients = false;
    private async mixIngredients() {
        if (!this.mixingIngredients) {
            this.mixingIngredients = true;
            await Promise.all(
                Object.values(this.workspaceItems).map(itemRenderer => itemRenderer.mixAnimation())
                    .concat([this.cake.appear()])
            );
            gameState.playerMixedIngredients();
        }
    }

    private workspaceInteraction() {
        if (gameState.state == 'dish_decorated') {
            gameState.playerTookDish();
        } else if (gameState.state == 'ingredients_mixed') {
            this.goToCakeDecoration();
        } else if (gameState.state == 'dish_in_making') {
            const nextStep = gameState.getNextObjectiveStep();
            if (!nextStep) {
                this.mixIngredients();
            } else {
                if (gameState.player.holds == nextStep.item) {
                    gameState.playerPutItem(ItemLocation.Workspace);
                }
            }
        }
    }

    private ovenInteraction() {
        if (gameState.state == 'player_took_dish') {
            gameState.playerPutDishInTool();
            this.clock.setVisible(true);
            this.clock.anims.play('clock_anim');
            setTimeout(() => {
                this.clock.setVisible(false);
                gameState.dishIsCooked();
            }, 5000);
        } else if (gameState.state == 'dish_cooked') {
            gameState.playerTookDishFromTool();
        }
    }

    private updateOven() {
        this.dishInTool.setDecoration(gameState.dishDecoration);
        this.dishInTool.setVisible(gameState.state == 'dish_in_tool' || gameState.state == 'dish_cooked');
        this.dishInTool.setAlpha(0.6);
    }
}