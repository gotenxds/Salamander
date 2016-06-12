import Game = Phaser.Game;
import Group = Phaser.Group;
import Tilemap = Phaser.Tilemap;
import Image = Phaser.Image;
import TileSprite = Phaser.TileSprite;
import BitmapData = Phaser.BitmapData;
export default class ObjectLayer extends Group {
    private id:string;
    private _xVelocity:number = 0;
    private _yVelocity:number = 0;
    private map:Tilemap;
    private images:[Image] = [];
    private tileSprites:[TileSprite] = [];

    constructor(game:Game, id:string, objects:[any], map:Tilemap) {
        super(game);
        this.id = id;
        this.game = game;
        this.map = map;

        let imgGroups = {};

        objects.forEach(obj => {
            if (obj.type === 'image') {

                if (obj.properties.repeat) {
                    this.tileSprites.push(this.createTileSprite(obj));
                }
                else {
                    this.images.push(this.createImage(obj));
                }
            } else if (obj.type === 'imgGroup') {
                if (imgGroups[obj.properties.imgGroup]) {
                    imgGroups[obj.properties.imgGroup].images.push(obj);
                } else {
                    imgGroups[obj.properties.imgGroup] = {images: [obj]};
                }
            } else if (obj.type === 'imgGroupData') {
                if (imgGroups[obj.properties.imgGroup]) {
                    imgGroups[obj.properties.imgGroup].data = obj;
                } else {
                    imgGroups[obj.properties.imgGroup] = {images: [], data: obj};
                }
            }
        });

        for (let imgGroupName in imgGroups) {
            let imgGroup = imgGroups[imgGroupName];
            let bitmapData = new BitmapData(this.game, imgGroup.data.name, imgGroup.data.width, imgGroup.data.height);
            imgGroup.images.forEach(imgData =>{
                this.createFrom(imgData, this.game.cache.getImage(imgData.properties.img, true), bitmapData, imgGroup);
            });
            
            if (imgGroup.data.properties.repeat){
                this.tileSprites.push(this.game.add.tileSprite(imgGroup.data.x, imgGroup.data.y, imgGroup.data.width, imgGroup.data.height, bitmapData, null, this));
            }else{
                this.images.push(this.game.add.image(imgGroup.data.x, imgGroup.data.y, bitmapData, null, this));
            }
        }
    }

    update() {
        var yup = true;

        this.tileSprites.forEach(tileSprite => {
            if (tileSprite.worldPosition.x <= 0) {
                yup = false;
                tileSprite.tilePosition.x += this.xVelocity / 2;
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

    private createFrom(imgData, baseImage:HTMLImageElement, bitmapData:Phaser.BitmapData, boundingRect:any) {
        let image = new PIXI.Sprite(new PIXI.Texture(baseImage.base));

        ObjectLayer.transformFromTiledData(image, imgData);

        bitmapData.draw(image, imgData.x - (boundingRect.data.x || 0), imgData.y - (boundingRect.data.y  || 0) - imgData.height, imgData.width, imgData.height);
    }

    private createTileSprite(obj) {
        var tileSprite = this.game.add.tileSprite(obj.x, obj.y, this.game.width, 500, obj.properties.img, null, this);
        tileSprite.anchor.set(0, 1);

        this.tileSprites.push(tileSprite);

        tileSprite.angle = obj.rotation || 0;


        if (obj.properties.horizontalFlip) {
            tileSprite.scale.set(-1, 1);
            tileSprite.y += tileSprite.height / 2;
        }
        if (obj.properties.verticalFlip) {
            tileSprite.anchor.set(0, -1);
            tileSprite.scale.set(1, -1);

            // Because of tiled wired behavior.
            tileSprite.y += tileSprite.height;
        }

        return tileSprite;
    }

    private createImage(obj) {
        let bitmapData = new BitmapData(this.game, obj.name, obj.width, obj.height);

        this.createFrom(obj, this.game.cache.getImage(obj.properties.img, true), bitmapData, {data:{x:0, y:0}});

        this.images.push(this.game.add.image(0, 0, bitmapData, null, this));
    }

    private static applyDataOnImage(image:Phaser.Image, obj) {
        image.anchor.set(0, 1);

        image.angle = obj.rotation || 0;

        if (obj.properties.horizontalFlip) {
            image.scale.set(-1, 1);
            image.x += Math.abs(image.width);
            image.y += image.height / 2;
        }
        if (obj.properties.verticalFlip) {
            image.scale.set(1, -1);

            // Because of tiled wired behavior.
            image.y -= Math.abs(image.height);
        }
    }

    private static transformFromTiledData(image, imgData) {
        imgData.rotation = Phaser.Math.degToRad(imgData.rotation || 0);
        image.anchor.set(.5, .5);


        let centerX = imgData.width /2 ;
        let centerY = imgData.height /2 ;

        let cosRotation = Math.cos(image.rotation);
        let sinRotation = Math.sin(image.rotation);

        imgData.x += centerX * cosRotation - centerY * sinRotation;
        imgData.y += centerX * sinRotation + centerY * cosRotation;

        if (imgData.properties.horizontalFlip) {
            image.scale.x = -1;
         //   image.x += Math.abs(image.width);
            //image.y += image.height / 2;
        }
        if (imgData.properties.verticalFlip) {
            image.scale.y = -1;

            // Because of tiled wired behavior.
           // image.y -= Math.abs(image.height);
        }
    }
}