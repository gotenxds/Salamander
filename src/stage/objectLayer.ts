import Game = Phaser.Game;
import Group = Phaser.Group;
import Tilemap = Phaser.Tilemap;
import Image = Phaser.Image;
import TileSprite = Phaser.TileSprite;
import BitmapData = Phaser.BitmapData;
import Sprite = Phaser.Sprite;
import Sprite = Phaser.Sprite;
export default class ObjectLayer extends Group {
    private static FLIPPED_HORIZONTALLY_FLAG:number = 0x80000000;
    private static FLIPPED_VERTICALLY_FLAG:number = 0x40000000;
    private static FLIPPED_DIAGONALLY_FLAG:number = 0x20000000;

    private id:string;
    private _xVelocity:number = 0;
    private _yVelocity:number = 0;
    private map:Tilemap;
    private images:Image[] = [];
    private tileSprites:[TileSprite] = [];
    private objects:any[] = [];

    private objectFactory = {
        image: obj => {
            if (obj.properties.repeat) {
                this.createTileSprite(obj);
            }
            else {
                this.createImage(obj);
            }
        },
        imgGroup: (obj, imgGroups) => {
            if (imgGroups[obj.properties.imgGroup]) {
                imgGroups[obj.properties.imgGroup].images.push(obj);
            } else {
                imgGroups[obj.properties.imgGroup] = {images: [obj]};
            }
        },
        imgGroupData: (obj, imgGroups) => {
            if (imgGroups[obj.properties.imgGroup]) {
                imgGroups[obj.properties.imgGroup].data = obj;
            } else {
                imgGroups[obj.properties.imgGroup] = {images: [], data: obj};
            }
        },
        object: (obj) => {
            this.objects.push(obj)
        }
    };

    constructor(game:Game, id:string, objects:[any], map:Tilemap) {
        super(game, game.world, id);
        this.id = id;
        this.game = game;
        this.map = map;

        this.createObjects(objects);
    }

    private createObjects(objects) {
        let imgGroups = {};

        objects.forEach(obj => {
            this.objectFactory[obj.type || 'object'](obj, imgGroups);
        });

        this.createImageGroups(imgGroups);
    };

    private createTileSprite(obj) {
        let baseImage = this.game.cache.getImage(obj.properties.img, true);
        let tileSprite = this.game.add.tileSprite(obj.x, obj.y, this.game.width, obj.height, this.createBitmapDataFrom(obj, baseImage), null, this);
        tileSprite.anchor.set(.5, .5);

        obj.width = this.game.width;
        ObjectLayer.transformPositionFromTiledPosition(tileSprite, obj);

        this.tileSprites.push(tileSprite);
    }

    private createImage(obj) {
        let baseImage = this.game.cache.getImage(obj.properties.img, true);
        let image = this.game.add.image(0, 0, this.createBitmapDataFrom(obj, baseImage), null, this);
        image.anchor.set(.5, .5);

        ObjectLayer.transformPositionFromTiledPosition(image, obj);

        this.images.push(image);
    }

    private static drawImage(imgData, baseImage:HTMLImageElement, bitmapData:Phaser.BitmapData, boundingRect:any) {
        let image = new PIXI.Sprite(new PIXI.Texture(baseImage.base));
        image.anchor.set(.5, .5);

        ObjectLayer.transformPositionFromTiledPosition(image, imgData);
        ObjectLayer.applyFlipData(imgData, image);

        bitmapData.draw(image, image.x - boundingRect.data.x + Math.abs(image.width), image.y - boundingRect.data.y, imgData.width, imgData.height);
    }

    update() {
        let yup = true;

        this.tileSprites.forEach(tileSprite => {
            if (tileSprite.worldPosition.x <= this.game.world.centerX) {
                yup = false;
                tileSprite.tilePosition.x += this.xVelocity;
            }
        });

        if (yup) {
            this.position.add(this.xVelocity, this.yVelocity);
        }
    }

    resizeWorld() {
        this.game.world.setBounds(0, 0, this.map.widthInPixels * this.scale.x, this.map.heightInPixels * this.scale.y);
    };

    get xVelocity() {
        return this._xVelocity;
    }

    set xVelocity(value) {
        this._xVelocity = value;
    }

    get yVelocity() {
        return this._yVelocity;
    }

    set yVelocity(value) {
        this._yVelocity = value;
    }

    getObjectsByName(name:string):[any] {
        return this.objects.filter(obj => obj.name === name);
    }

    createFromObjects(name:string, createFunction:(obj) => Sprite) {
        this.objects.forEach(object => {
            if (object.name === name) {
                let sprite = createFunction(object);

                sprite.anchor.set(.5, .5);
                ObjectLayer.applyFlipData(object, sprite);
                ObjectLayer.transformPositionFromTiledPosition(sprite, object);

                this.add(sprite);
            }
        });
    }

    inBounds(x:number, y:number):boolean{
        let startX = Math.abs(this.position.x);
        let endX = startX + this.game.width;
        let startY = Math.abs(this.position.y);
        let endY = startY + this.game.height;

        return x >= startX && x <= endX && y >= startY && y <= endY;
    }

    private createImageGroups(imgGroups) {
        for (let imgGroupName in imgGroups) {
            let imgGroup = imgGroups[imgGroupName];
            let bitmapData = new BitmapData(this.game, imgGroup.data.name, imgGroup.data.width, imgGroup.data.height);
            imgGroup.images.forEach(imgData => {
                ObjectLayer.drawImage(imgData, this.game.cache.getImage(imgData.properties.img, true), bitmapData, imgGroup);
            });

            if (imgGroup.data.properties.repeat) {
                let tileSprite = this.game.add.tileSprite(imgGroup.data.x + imgGroup.data.width / 2, imgGroup.data.y + imgGroup.data.height / 2, imgGroup.data.width, imgGroup.data.height, bitmapData, null, this);
                tileSprite.anchor.set(.5, .5);

                this.tileSprites.push(tileSprite);
            } else {
                let image = this.game.add.image(imgGroup.data.x + imgGroup.data.width / 2, imgGroup.data.y + imgGroup.data.height / 2, bitmapData, null, this);
                image.anchor.set(.5, .5);

                this.images.push(image);
            }
        }
    };

    private createBitmapDataFrom(imgData, baseImage:HTMLImageElement):BitmapData {
        let image = new PIXI.Sprite(new PIXI.Texture(baseImage.base));
        image.anchor.set(.5, .5);

        ObjectLayer.applyFlipData(imgData, image);

        return new BitmapData(this.game, imgData.name, imgData.width, imgData.height)
            .draw(image, imgData.width / 2, imgData.height / 2, imgData.width, imgData.height);
    }

    private static applyFlipData(imgData, image) {
        if (imgData.gid & ObjectLayer.FLIPPED_HORIZONTALLY_FLAG) {
            image.rotation *= -1;
            image.scale.x = -1;
        }
        if (imgData.gid & ObjectLayer.FLIPPED_VERTICALLY_FLAG) {
            image.scale.y = -1;
        }
    };

    private static transformPositionFromTiledPosition(image:Phaser.Image | PIXI.Sprite, imgData:any) {
        image.rotation = Phaser.Math.degToRad(imgData.rotation || 0);

        let centerX = imgData.width / 2;
        let centerY = -imgData.height / 2;

        let cosRotation = Math.cos(image.rotation);
        let sinRotation = Math.sin(image.rotation);

        image.x = centerX * cosRotation - centerY * sinRotation;
        image.y = centerX * sinRotation + centerY * cosRotation;

        image.x += imgData.x;
        image.y += imgData.y;
    }
}

