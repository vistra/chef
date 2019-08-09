import * as assert from "assert";
import * as _ from 'lodash';

export interface ICakeDecoration {
    x: number,
    y: number,
    type: string
}

export type TDishDecoration = ICakeDecoration[];

export enum Item {
    Chocolate = 'Chocolate',
    Egg = 'Egg',
    Flour = 'Flour',
    Oil = 'Oil',
    Butter = 'Butter'
}

export const Items: Item[] = [
    Item.Chocolate,
    Item.Egg,
    Item.Flour,
    Item.Oil,
    Item.Butter
];

export enum ItemLocation {
    Fridge = 'Fridge',
    Cabinet = 'Cabinet',
    Workspace = 'Workspace'
}

type IItems  = Partial<{
    [ingredient in Item]: number
}>

interface IObjective {
    dish: 'cake';
    ingredients: Array<{
        item: Item,
        count: number
    }>;
}

interface IPlayer {
    holds: Item;
    itemOrigin: ItemLocation;
}

class GameState {

    objective: IObjective;

    player: IPlayer = {
        holds: null,
        itemOrigin: null
    };

    items: {[loc in ItemLocation]: IItems} = {
        [ItemLocation.Workspace]: {},
        [ItemLocation.Fridge]: {},
        [ItemLocation.Cabinet]: {},
    };
    
    fridgeItems: IItems = {};

    cabinetItems: IItems = {};

    workspaceItems: IItems = {};

    dishDecoration: TDishDecoration;

    state: "dish_in_making" | "ingredients_mixed" | "dish_decorated" | "player_took_dish" | "dish_in_tool" | "dish_cooked" | "player_took_cooked_dish";

    constructor() {
        this.newGame();
    }

    getNextObjectiveStep(): IObjective['ingredients'][0] {
        for (const step of this.objective.ingredients) {
            if (this.itemCount(step.item, ItemLocation.Workspace) != step.count) {
                return step;
            }
        }
        return null;
    }

    isObjectiveCompleted(): boolean {
        return this.getNextObjectiveStep() == null;
    }

    itemCount(item: Item, loc: ItemLocation): number {
        return this.items[loc][item] || 0;
    }

    hasItem(item: Item, loc: ItemLocation): boolean {
        return this.itemCount(item, loc) > 0;
    }

    releasePlayerItem() {
        if (this.player.holds != null) {
            assert(this.player.itemOrigin != null);
            this.playerPutItem(this.player.itemOrigin);
        }
    }

    private setItemCount(item: Item, loc: ItemLocation, count) {
        this.items[loc] = this.items[loc] || {};
        this.items[loc][item] = count
    }

    private putItem(item: Item, loc: ItemLocation, count: number = 1) {
        this.items[loc] = this.items[loc] || {};
        this.items[loc][item] = this.items[loc][item] || 0;
        this.setItemCount(item, loc, this.items[loc][item] + count);
    }

    private removeItem(item: Item, loc: ItemLocation) {
        assert(this.items
            && this.items[loc]
            && this.items[loc][item] != null
            && this.items[loc][item] > 0);
        this.items[loc][item]--;
    }

    playerPutItem(loc: ItemLocation) {
        assert(this.player.holds);
        this.putItem(this.player.holds, loc);
        this.player.holds = null;
        this.player.itemOrigin = null;
    }

    playerTakenItem(item: Item, fromLocation: ItemLocation) {
        if (this.state == "dish_in_making") {
            assert(this.hasItem(item, fromLocation), `Item ${item} not available on location ${fromLocation}`);
            this.releasePlayerItem();
            this.removeItem(item, fromLocation);
            this.player.holds = item;
            this.player.itemOrigin = fromLocation;
        }
    }

    playerMixedIngredients() {
        this.state = "ingredients_mixed";
    }

    dishDecorated(decoration: TDishDecoration) {
        this.state = 'dish_decorated';
        this.dishDecoration = decoration;
    }

    playerTookDish() {
        this.releasePlayerItem();
        this.state = 'player_took_dish'
    }

    playerPutDishInTool() {
        this.state = 'dish_in_tool';
    }

    dishIsCooked() {
        this.state = 'dish_cooked';
    }

    playerTookDishFromTool() {
        this.state = 'player_took_cooked_dish';
    }

    newGame() {
        this.objective = {
            dish: 'cake',
            ingredients: _.shuffle([
                {item: Item.Oil, count: _.random(1,3)},
                {item: Item.Egg, count: _.random(1,3)},
                {item: Item.Chocolate, count: _.random(1,3)},
                {item: Item.Flour, count: _.random(1,3)},
                {item: Item.Butter, count: _.random(1,3)},
            ])
        };
        this.setItemCount(Item.Egg, ItemLocation.Fridge, 5);
        this.setItemCount(Item.Butter, ItemLocation.Fridge, 3);
        this.setItemCount(Item.Oil, ItemLocation.Cabinet, 3);
        this.setItemCount(Item.Flour, ItemLocation.Cabinet, 3);
        this.setItemCount(Item.Chocolate, ItemLocation.Cabinet, 5);

        this.dishDecoration = null;
        this.state = 'dish_in_making';
        this.player = {
            holds: null,
            itemOrigin: null
        };
    }
}

export const gameState = new GameState();
(window as any).gameState = gameState;