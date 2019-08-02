import * as assert from "assert";

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
        this.objective = {
            dish: 'cake',
            ingredients: [
                {item: Item.Oil, count: 1},
                // {item: Item.Egg, count: 5},
                // {item: Item.Chocolate, count: 4},
                // {item: Item.Flour, count: 3},
                // {item: Item.Butter, count: 2},
            ]
        };
        this.putItem(Item.Egg, ItemLocation.Fridge, 5);
        this.putItem(Item.Butter, ItemLocation.Fridge, 3);
        this.putItem(Item.Oil, ItemLocation.Cabinet, 3);
        this.putItem(Item.Flour, ItemLocation.Cabinet, 3);
        this.putItem(Item.Chocolate, ItemLocation.Cabinet, 5);
        this.state = 'dish_in_making';
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

    private putItem(item: Item, loc: ItemLocation, count: number = 1) {
        this.items[loc] = this.items[loc] || {};
        this.items[loc][item] = this.items[loc][item] || 0;
        this.items[loc][item] += count;
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
        assert(this.hasItem(item, fromLocation), `Item ${item} not available on location ${fromLocation}`);
        this.releasePlayerItem();
        this.removeItem(item, fromLocation);
        this.player.holds = item;
        this.player.itemOrigin = fromLocation;
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
}

export const gameState = new GameState();
(window as any).gameState = gameState;