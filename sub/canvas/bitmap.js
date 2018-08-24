import Sprite from './sprite';

const ImageCache = {};

export default class Bitmap extends Sprite {
    /**
     * @param circleFlag 是否需要裁剪为圆形
     */
    constructor(circleFlag) {
        super()
        this.originX = 0;
        this.originY = 0;
        this.image = null;
        this.circleFlag = circleFlag
    }
    update(ctx) {
        if (!ctx) return;
        if (!this.image) return;
        ctx.save();
        this.transform(ctx);
        if (this.circleFlag) { // 裁剪成圆形
            ctx.beginPath()
            ctx.arc(this.originX + this.width / 2 , this.originY + this.height / 2, this.width / 2, 0, 2 * Math.PI)
            ctx.clip()
        }
        ctx.drawImage(this.image, -this.width * this.originX, -this.height * this.originY, this.width, this.height);
        this.childUpdate(ctx);
        ctx.restore();
    }
    get skin() {
        return this.src
    }
    set skin(value) {
        this.src = value;
        if (ImageCache[value]) {
            this.image = ImageCache[value];
        } else {
            this.image = wx.createImage();
            this.image.src = value;
            let that = this;
            this.image.onload = function() {
                ImageCache[that.skin] = that.image;
            }
        }
    }
    origin(x, y) {
        switch (arguments.length) {
            case 1:
                this.originX = Math.max(0, Math.min(1, x));
                this.originY = Math.max(0, Math.min(1, x));
                return this;
            case 2:
                this.originX = Math.max(0, Math.min(1, x));
                this.originY = Math.max(0, Math.min(1, y));
                return this;
        }
        return this;
    }
}
