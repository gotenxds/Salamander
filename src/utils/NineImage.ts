export default class NineImage {
    private static _textureKey = 0;
    private static _nineImage:Phaser.BitmapData;
    private static _image:Phaser.Image;
    private static _frame:Phaser.Frame;
    private static _width:number;
    private static _height:number;
    private static _horizontalRepeats:number;
    private static _verticalRepeats:number;
    private static _centralWidth:number;
    private static _centralHeight:number;
    private static _lastWidth:number;
    private static _lastHeight:number;
    private static _leftWidth:number;
    private static _rightWidth:number;
    private static _topHeight:number;
    private static _bottomHeight:number;

    public static create(aGame:Phaser.Game, aWidth:number, aHeight:number, aKey:string, aFrame:number | string, aTop:number = 0, aLeft:number = 0, aBottom:number = 0, aRight:number = 0, aRepeats:boolean = false):Phaser.BitmapData {
        NineImage._image = <Phaser.Image>aGame.cache.getImage(aKey);
        if (typeof aFrame === "string") {
            NineImage._frame = aGame.cache.getFrameByName(aKey, aFrame);
        } else {
            NineImage._frame = aGame.cache.getFrameByIndex(aKey, aFrame);
        }
        NineImage.calculateNineImage(aWidth, aHeight, aTop, aLeft, aBottom, aRight, aRepeats);
        NineImage._nineImage = new Phaser.BitmapData(aGame, "NineImage" + (NineImage._textureKey++), NineImage._width, NineImage._height);
        NineImage.renderNineImage();
        return NineImage._nineImage;
    }

    private static calculateNineImage(aWidth:number, aHeight:number, aTop:number, aLeft:number, aBottom:number, aRight:number, aRepeats:boolean):void {
        var frame = NineImage._frame;
        NineImage._centralWidth = frame.width - aLeft - aRight;
        NineImage._centralHeight = frame.height - aTop - aBottom;
        if (aRepeats) {
            NineImage._horizontalRepeats = aWidth;
            NineImage._verticalRepeats = aHeight;
            NineImage._width = aLeft + aRight + NineImage._centralWidth * aWidth;
            NineImage._height = aTop + aBottom + NineImage._centralHeight * aHeight;
            NineImage._lastWidth = 0;
            NineImage._lastHeight = 0;
        } else {
            var w = aWidth - aLeft - aRight;
            NineImage._horizontalRepeats = Math.floor(w / NineImage._centralWidth);
            NineImage._lastWidth = w % NineImage._centralWidth;
            var h = aHeight - aTop - aBottom;
            NineImage._verticalRepeats = Math.floor(h / NineImage._centralHeight);
            NineImage._lastHeight = h % NineImage._centralHeight;
            NineImage._width = aWidth;
            NineImage._height = aHeight;
        }
        NineImage._leftWidth = aLeft;
        NineImage._rightWidth = aRight;
        NineImage._topHeight = aTop;
        NineImage._bottomHeight = aBottom;
    }

    private static renderNineImage():void {
        var sourceY = NineImage._frame.y;
        var destY = 0;
        if (NineImage._topHeight > 0) {
            NineImage.renderNineImageRow(NineImage._image, sourceY, destY, NineImage._topHeight);
            sourceY += NineImage._topHeight;
            destY += NineImage._topHeight;
        }
        for (var i = 0; i < NineImage._verticalRepeats; i++) {
            NineImage.renderNineImageRow(NineImage._image, sourceY, destY, NineImage._centralHeight);
            destY += NineImage._centralHeight;
        }
        if (NineImage._lastHeight > 0) {
            NineImage.renderNineImageRow(NineImage._image, sourceY, destY, NineImage._lastHeight);
            destY += NineImage._lastHeight;
        }
        sourceY += NineImage._centralHeight;
        if (NineImage._bottomHeight > 0) {
            NineImage.renderNineImageRow(NineImage._image, sourceY, destY, NineImage._bottomHeight);
        }
    }

    private static renderNineImageRow(aImage:Phaser.Image, aSourceY:number, aDestY:number, aHeight:number) {
        var sourceX = NineImage._frame.x;
        var destX = 0;
        if (NineImage._leftWidth > 0) {
            NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._leftWidth, aHeight, destX, aDestY);
            destX += NineImage._leftWidth;
            sourceX += NineImage._leftWidth;
        }
        for (var i = 0; i < NineImage._horizontalRepeats; i++) {
            NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._centralWidth, aHeight, destX, aDestY);
            destX += NineImage._centralWidth;
        }
        if (NineImage._lastWidth > 0) {
            NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._lastWidth, aHeight, destX, aDestY);
            destX += NineImage._lastWidth;
        }
        sourceX += NineImage._centralWidth;
        if (NineImage._rightWidth > 0) {
            NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._rightWidth, aHeight, destX, aDestY);
        }
    }

}