import * as _ from 'lodash';
import Scene = Phaser.Scene;

export class ItemRenderer {
    private scene: Phaser.Scene;
    private itemImageName: string;
    private itemCount: number;
    private x: number;
    private y: number;
    private scaleX: number;
    private scaleY: number;
    private maxCount: number;
    private itemImages: Phaser.Physics.Arcade.Image[];
    private imageFading: boolean;
    private stepX: number;
    private stepY: number;

    constructor(scene: Scene,
                itemImage: string,
                x: number,
                y: number,
                itemCount: number,
                stepX: number = 20,
                stepY: number = 0,
                scaleX: number = 1,
                scaleY: number = 1,
                maxCount: number = 5) {
        this.scene = scene;
        this.itemImageName = itemImage;
        this.itemCount = itemCount;
        this.x = x;
        this.y = y;
        this.stepX = stepX;
        this.stepY = stepY;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.maxCount = maxCount;

        this.initialize();
        this.setCount(this.itemCount);
    }

    setCount(itemCount: number) {
        this.itemCount = itemCount;
        this.update();
    }

    private initialize() {
        this.itemImages = _.range(this.maxCount)
            .map(
                (ind: number) => this.scene.physics.add.image(this.x + this.stepX * ind, this.y + this.stepY, this.itemImageName)
                    .setVisible(false)
                    .setScale(this.scaleX, this.scaleY)
                    .setInteractive()
            );
        _.range(this.maxCount)
            .map(() => false);
    }

    private update() {
        if (
            this.lastIndexClicked != null &&
            this.itemImages.filter(img => img.visible).length > this.itemCount
        ) {
            const imageToFade = this.itemImages[this.lastIndexClicked];
            if (imageToFade.visible && !this.imageFading) {
                this.imageFading = true;
                let c = 48;
                const interval = setInterval(
                    () => {
                        c--;
                        imageToFade.setAlpha(c / 48);
                        if (c == 0) {
                            imageToFade.setVisible(false);
                            clearInterval(interval);
                            this.imageFading = false;
                            this.lastIndexClicked = null;
                        }
                    },
                    600 / 48);
            }
        }
        this.itemImages
            .map((image, ind) => this.updateItem(ind))
    }

    private updateItem(ind: number) {
        if (this.imageFading) {
            return;
        }
        const image = this.itemImages[ind];
        if (ind >= this.itemCount) {
            image.setVisible(false);
        } else {
            image.setVisible(true);
            image.setAlpha(1);
        }
    }

    private lastIndexClicked: number;
    onPointerDown(callback: ()=>void) {
        for (const image of this.itemImages) {
            image.on('pointerdown', () => {
                if (image.visible) {
                    this.lastIndexClicked = this.itemImages.indexOf(image);
                    callback();
                }
            })
        }
    }

    async mixAnimation(): Promise<void> {
        return new Promise((resolve, reject) => {
            let angel = 0;
            let scale = 1;
            let alpha = 1;
            let count = 0;
            const interval = setInterval(() => {
                if (count > 150) {
                    clearInterval(interval);
                    resolve();
                }
                angel += 5;
                scale -= 1/150;
                alpha -= 1/150;
                for (const image of this.itemImages) {
                    image.setAngle(angel);
                    image.setScale(scale);
                    image.setAlpha(alpha);
                }
                count++;
            }, 20)
        });
    }

}