import * as Phaser from "phaser";
import {gameState, Item} from "./state";

export class Dashboard {
    private objectiveItemImage: Phaser.Physics.Arcade.Image;
    private objectiveText: Phaser.GameObjects.Text;
    private objectiveCountText: Phaser.GameObjects.Text;
    private objectiveGroup: Phaser.GameObjects.Group;
    private instructionsText: Phaser.GameObjects.Text;
    private dashboardImage: Phaser.Physics.Arcade.Image;
    private soundButtonImage: Phaser.Physics.Arcade.Image;
    private objectiveItemCountImage: Phaser.Physics.Arcade.Image;
    private hebInstructionsText: Phaser.GameObjects.Text;
    private hebObjectiveText: Phaser.GameObjects.Text;

    constructor(private scene: Phaser.Scene,
                public x: number,
                public y: number) {
        this.create();
    }

    private create() {
        this.dashboardImage = this.scene.physics.add.image(this.x, this.y, 'dashboard')
                .setOrigin(0, 0);
        this.soundButtonImage = this.scene.physics.add.image(this.x + 700, this.y + 19, 'sound_button')
            .setOrigin(0,0);

        this.createObjective();
    }

    private createObjective() {
        this.objectiveItemCountImage = this.scene.physics.add.image(this.x + 60, this.y + 15, 'objective_item_count')
            .setOrigin(0,0);
        this.objectiveItemImage = this.scene.physics.add.image(this.x + 145, this.y + 7, 'egg')
            .setOrigin(0,0);
        this.objectiveText = this.scene.add.text(this.x + 240, this.y + 55, '')
            .setColor('black')
            .setFontSize(30)
            .setOrigin(0,0);
        this.hebObjectiveText = this.scene.add.text(this.x + 635, this.y + 20, '')
            .setColor('black')
            .setFontSize(30)
            .setOrigin(0,0);
        this.objectiveCountText = this.scene.add.text(this.x + 10, this.y + 10, '')
            .setColor('black')
            .setFontSize(100)
            .setOrigin(0,0);

        this.objectiveGroup = this.scene.add.group()
            .add(this.objectiveItemImage)
            .add(this.objectiveItemCountImage)
            .add(this.objectiveText)
            .add(this.hebObjectiveText)
            .add(this.objectiveCountText);

        this.instructionsText = this.scene.add.text(this.x + 20, this.y + 55, 'That\'s it :) Now mix the ingredients.')
            .setFontSize(25)
            .setColor('black')
            .setVisible(false);

        this.hebInstructionsText = this.scene.add.text(this.x + 640, this.y + 20, 'כל הכבוד!')
            .setFontSize(25)
            .setColor('black')
            .setVisible(false);
    }

    private setInstruction(eng: string, heb: string) {
        this.instructionsText.setText(eng);
        this.instructionsText.setVisible(true);
        this.hebInstructionsText.setText(heb);
        this.hebInstructionsText.setVisible(true);
        this.hebInstructionsText.setPosition(this.x + 640 - this.hebInstructionsText.width, this.hebInstructionsText.y)
    }

    private setObjectiveText(item: Item, count: number) {
        this.objectiveText.setText(count.toString()
            .replace('1', 'One')
            .replace('2', 'Two')
            .replace('3', 'Three')
            .replace('4', 'Four')
            .replace('5', 'Five')
             + ' '
             + (count > 1 ?
                    item.toString().replace('Egg', 'eggs')
                    .replace('Flour', 'bags of flour')
                    .replace('Oil', 'bottles of oil')
                    .replace('Chocolate', 'chocolate bars')
                    .replace('Butter', 'packs of butter')
                :
                    item.toString().replace('Egg', 'egg')
                        .replace('Flour', 'bag of flour')
                        .replace('Oil', 'bottle of oil')
                        .replace('Chocolate', 'chocolate bar')
                        .replace('Butter', 'pack of butter')
            )
        );
        this.objectiveText.setVisible(true);

        const gender = item == Item.Oil ? 'male' : 'female';
        const itemText = (count > 1 ?
                item.toString().replace('Egg', 'ביצים')
                    .replace('Flour', 'שקיות קמח')
                    .replace('Oil', 'בקבוקי שמן')
                    .replace('Chocolate', 'חפיסות שוקולד')
                    .replace('Butter', 'חבילות חמאה')
                :
                item.toString().replace('Egg', 'ביצה')
                    .replace('Flour', 'שקית קמח')
                    .replace('Oil', 'בקבוק שמן')
                    .replace('Chocolate', 'חפישת שוקולד')
                    .replace('Butter', 'חבילת חמאה')
        );
        const numberText = (gender == 'male' ?
                count.toString()
                    .replace('1', 'אחד')
                    .replace('2', 'שני')
                    .replace('3', 'שלושה')
                    .replace('4', 'ארבעה')
                    .replace('5', 'חמישה')
        :
                count.toString()
                    .replace('1', 'אחת')
                    .replace('2', 'שתי')
                    .replace('3', 'שלוש')
                    .replace('4', 'ארבע')
                    .replace('5', 'חמש')
        ) ;
        this.hebObjectiveText.setText(
            (count > 1 ?
                numberText + ' ' + itemText
            :
                itemText + ' ' + numberText
            )
        );
        this.hebObjectiveText.setVisible(true);
        this.hebObjectiveText.setPosition(this.x + 635 - this.hebObjectiveText.width, this.hebObjectiveText.y)
    }

    public update() {
        const nextStep = gameState.getNextObjectiveStep();
        if (nextStep) {
            this.setItemImage(nextStep.item);
            this.setObjectiveText(nextStep.item, nextStep.count);
            this.objectiveCountText.setText(`${nextStep.count}`);
        } else if (gameState.state == 'dish_in_making') {
            this.objectiveGroup.getChildren().forEach((c: any) => c.setVisible(false));
            this.setInstruction('That\'s it :) Now mix the ingredients.', '.כל הכבוד! עכשיו צריך לערבב את המרכיבים')
        } else if (gameState.state == 'ingredients_mixed'){
            this.setInstruction('Good! Now decorate the cake.', '.מצויין! עכשיו אפשר לקשט את העוגה')
        } else if (gameState.state == 'dish_decorated'){
            this.setInstruction('Alright! Now put the cake in the oven.', '.יפה מאוד! עכשיו אפשר לשים את העוגה בתנור')
        } else if (gameState.state == 'dish_in_tool') {
            this.setInstruction('Very good! Now we wait...', '...מצויין! עכשיו ממתינים');
        } else if (gameState.state == 'dish_cooked') {
            this.setInstruction('It\'s ready! You can take it out of the oven', '.העוגה מוכנה! אפשר להוציא אותה מהתנור');
        } else if (gameState.state == 'player_took_cooked_dish') {
            this.setInstruction('Bete-avon!', '!בתיאבון');
        }
    }


    private setItemImage(item: Item) {
        this.objectiveItemImage.setTexture(item.toLocaleLowerCase());
        switch (item) {
            case Item.Oil:
                this.objectiveItemImage.setScale(1);
                this.objectiveItemImage.setPosition(this.x + 145, this.y + 7);
                break;
            case Item.Egg:
                this.objectiveItemImage.setScale(1);
                this.objectiveItemImage.setPosition(this.x + 130, this.y + 20);
                break;
            case Item.Chocolate:
                this.objectiveItemImage.setScale(1);
                this.objectiveItemImage.setPosition(this.x + 115, this.y + 25);
                break;
            case Item.Flour:
                this.objectiveItemImage.setScale(1.4);
                this.objectiveItemImage.setPosition(this.x + 130, this.y + 22);
                break;
            case Item.Butter:
                this.objectiveItemImage.setScale(0.65);
                this.objectiveItemImage.setPosition(this.x + 120, this.y + 30);
                break;
            default:
                break;
        }

    }
}