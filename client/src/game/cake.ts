import {ICakeDecoration} from "./state";
import * as Phaser from "phaser";

export class Cake {

    private decorImages: Phaser.Physics.Arcade.Image[] = [];
    private decoration: ICakeDecoration[];
    public cakeImage: Phaser.Physics.Arcade.Image;
    private group: Phaser.Physics.Arcade.Group;

    constructor(private scene: Phaser.Scene,
                public x: number,
                public y: number,
                public scale: number,
                decoration: ICakeDecoration[]) {
        this.cakeImage = this.scene.physics.add.image(x, y,'cake')
            .setInteractive()
            .setOrigin(0, 0)
            .setScale(scale);
        this.setDecoration(decoration);
    }

    setDecoration(decoration: ICakeDecoration[]) {
        decoration = decoration || [];
        if (this.decoration && decoration.length == this.decoration.length) {
            return; // performance hack
        }
        this.decorImages.forEach(image => image.destroy());
        this.decorImages = [];
        const width = this.cakeImage.width;
        const height = this.cakeImage.height;
        for (const decor of decoration) {
            this.decorImages.push(
                this.scene.physics.add.image(
                    this.cakeImage.x + decor.x * width * this.scale,
                    this.cakeImage.y + decor.y * height * this.scale,
                    'cake_toppings'
                ).setTexture(decor.type)
                .setScale(this.scale * 0.15 / 0.37)
            );
        }
        if (this.group) {
            this.decorImages.forEach(img => this.group.add(img));
        }
        this.decoration = decoration.slice();
    }

    setVisible(visible: boolean) {
        this.cakeImage.setVisible(visible);
        this.decorImages.forEach(decor => decor.setVisible(visible))
    }

    setGroup(group: Phaser.Physics.Arcade.Group) {
        this.group = group;
        this.group.add(this.cakeImage);
        this.decorImages.forEach(img => this.group.add(img));
    }

    setPosition(x: number, y: number) {
        const offsetX = x - this.x;
        const offsetY = y - this.y;
        this.decorImages
            .concat([this.cakeImage])
            .forEach(img => img.setPosition(img.x + offsetX, img.y + offsetY))
        this.x = x;
        this.y = y;
    }

    async appear(timeMs = 3000): Promise<void> {
        return new Promise((resolve, reject) => {
            let elapsed = 0;
            this.decorImages
                .concat([this.cakeImage])
                .forEach(img => img
                    .setAlpha(0)
                    .setVisible(true)
                );
            const interval = setInterval(() => {
                this.decorImages
                    .concat([this.cakeImage])
                    .forEach(img => img.setAlpha(elapsed / timeMs));
                elapsed += timeMs / 48;
                if (elapsed > timeMs) {
                    clearInterval(interval);
                    this.setVisible(true);
                    resolve();
                }
            }, timeMs / 48)
        });
    }

    setAlpha(alpha: number) {
        this.decorImages
            .concat([this.cakeImage])
            .forEach(img => img.setAlpha(alpha));
    }

    setDepth(depth: number) {
        this.cakeImage.setDepth(depth);
        this.decorImages
            .forEach(img => img.setDepth(depth + 1));
    }
}