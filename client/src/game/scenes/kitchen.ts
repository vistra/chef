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
    private stepSound: Phaser.Sound.BaseSound;
    private fridgeSounds: Phaser.Sound.BaseSound;
    private closetSounds: Phaser.Sound.BaseSound;
    private magicSounds: Phaser.Sound.BaseSound;
    private ovenSound: Phaser.Sound.BaseSound;
    private ovenOpenCloseSound: Phaser.Sound.BaseSound;
    private leftPressed: boolean;
    private mixingIngredients = false;

    preload() {
    }

    create() {
        this.leftPressed = false;
        this.mixingIngredients = false;

        this.kitchen_background = this.add.image(0, 0, 'kitchen_background')
            .setOrigin(0,0)
            .setScale(0.8,0.65);

        const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .setEmitOnRepeat(true)
            .on('down', () => this.handleSpaceClick());

        this.dashboard = new Dashboard(this, 0, 400, () => this.handleSpaceClick());

        // Workspace
        // this.dishImage = this.physics.add.image(540, 150, 'cake_small');
        // this.dishImage.setVisible(false);
        // this.dishInToolImage = this.physics.add.image(620, 280, 'cake_tiny');
        this.dishInTool = new Cake(this, 445, 265, 0.03, []);
        this.dishInTool.setVisible(false);
        this.dishInTool.setAlpha(0.6);
        const orderedIngredients = [
            Item.Oil,
            Item.Egg,
            Item.Chocolate,
            Item.Flour,
            Item.Butter,
        ];

        gameState.objective.ingredients.forEach((ingredient) => {
            const ind = orderedIngredients.indexOf(ingredient.item);
            const scale = ingredient.item == Item.Egg ? 0.5 : 1;
            const offsetY = ingredient.item == Item.Egg ? 30 : 0;
            this.workspaceItems[ingredient.item] = new ItemRenderer(
                this,
                ingredient.item.toLowerCase(),
                60 + 10 * ind,
                185 + offsetY + 10 * ind,
                1,
                20,
                0,
                scale,
                scale
            )
        });

        this.clock = this.physics.add.sprite(0, 0, 'clock')
            .setOrigin(0, 0)
            .setScale(0.5)
            .setVisible(false);

        this.anims.create({
            key: 'clock_anim',
            frames: this.anims.generateFrameNames('sandclock_anim', { start: 0, end: 5 }),
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

        // Sounds
        this.stepSound = this.sound.add('steps', {'loop': true, detune: 500, volume: 1});
        this.fridgeSounds = this.sound.add('fridge');
        this.fridgeSounds.addMarker({
            name: 'fridge_open',
            start: 7,
            duration: 2
        });


        this.closetSounds = this.sound.add('closet');
        this.closetSounds.addMarker({
            name: 'closet_open',
            start: 2.5,
            duration: 2
        });

        this.magicSounds = this.sound.add('magic');
        this.magicSounds.addMarker({
            name: 'magic',
            start: 1,
            duration: 3
        });

        this.ovenSound = this.sound.add('oven');
        this.ovenSound.addMarker({
            name: 'oven',
            start: 4.3,
            duration: 5
        });

        this.ovenOpenCloseSound = this.sound.add('oven_open_close');
        this.ovenOpenCloseSound.addMarker({
            name: 'open',
            start: 5.5,
            duration: 2
        });
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
        if (cursors.left.isDown || this.leftPressed || this.dashboard.leftPressed) {
            this.player.setVelocityX(-300);
            this.player.anims.play('chef_walk_left_anim', true);
            this.player.setScale(1, 1);
            this.playerDirection = 'left';
            this.startStepSound();
        } else if (cursors.right.isDown || this.dashboard.rightPressed) {
            this.player.setVelocityX(300);
            this.player.anims.play('chef_walk_left_anim', true);
            this.player.setScale(-1, 1);
            this.playerDirection = 'right';
            this.startStepSound();
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('chef_stand_anim', true)
            this.stopStepSound();
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
        if (this.player.x > 610 && this.player.x < 730) {
            this.goToFridge();
        } else if (this.player.x > 210 && this.player.x < 370) {
            this.goToCabinet();
        } else if (this.player.x < 200) {
            this.workspaceInteraction();
        } else if (this.player.x > 400 && this.player.x < 510) {
            this.ovenInteraction();
        }
    }

    private goToFridge() {
        this.fridgeSounds.play('fridge_open');
        setTimeout(() => this.game.scene.switch('kitchen', 'fridge'), 500);
    }

    private goToCabinet() {
        this.closetSounds.play('closet_open');
        setTimeout(() => this.game.scene.switch('kitchen', 'cabinet'), 500);
    }

    private goToCakeDecoration() {
        this.game.scene.switch('kitchen', 'cake_decoration');
    }

    private async mixIngredients() {
        if (!this.mixingIngredients) {
            this.mixingIngredients = true;
            this.magicSounds.play('magic');
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
                    const number = gameState.itemCount(nextStep.item, ItemLocation.Workspace).toString()
                        .replace('1', 'one')
                        .replace('2', 'two')
                        .replace('3', 'three');
                    const gender = nextStep.item == Item.Oil ? 'male' : 'female';
                    const final = gameState.itemCount(nextStep.item, ItemLocation.Workspace) == nextStep.count ? 'final' : 'not-final';
                    this.dashboard.dontUpdate = true;
                    this.sound.play(`${number}-${gender}-${final}`);
                    setTimeout(() => this.dashboard.dontUpdate = false, 1500);
                } else if (gameState.player.holds != null) {
                    this.sound.play('wrong_item');
                }
            }
        }
    }

    private ovenInteraction() {
        if (gameState.state == 'player_took_dish') {
            this.ovenSound.play('oven');
            gameState.playerPutDishInTool();
            this.clock.setVisible(true);
            this.clock.anims.play('clock_anim');
            setTimeout(() => {
                this.clock.setVisible(false);
                gameState.dishIsCooked();
            }, 5000);
        } else if (gameState.state == 'dish_cooked') {
            this.dashboard.dontUpdate = true;
            gameState.playerTookDishFromTool();
            this.ovenOpenCloseSound.play('open');
            setTimeout(() => {
                this.dashboard.dontUpdate = false;
                setTimeout(() => {
                    this.leftPressed = true;
                    this.player.setCollideWorldBounds(false);
                    setTimeout(() => {
                        this.leftPressed = false;
                        this.stopStepSound();
                        this.game.scene.switch('kitchen', 'dinner');
                    }, 2500)
                }, 1500);
            }, 1000)

        }
    }

    private updateOven() {
        this.dishInTool.setDecoration(gameState.dishDecoration);
        this.dishInTool.setVisible(gameState.state == 'dish_in_tool' || gameState.state == 'dish_cooked');
        this.dishInTool.setAlpha(0.6);
    }

    private startStepSound() {
        if (!this.stepSound.isPlaying) {
            this.stepSound.play();
        }
    }

    private stopStepSound() {
        if (this.stepSound.isPlaying) {
            this.stepSound.stop();
        }
    }
}