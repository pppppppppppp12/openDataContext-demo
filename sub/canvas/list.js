import Sprite           from './sprite';
import GraphicAction    from './graphicAction';
import Bitmap           from './bitmap';
import Item             from './item';
import Box              from './box';
import Util             from './util'
/**
 * 绘制列表，并监听滚动事件
 */
const MAX_OFFSET = 50;
export default class ListView extends Sprite {
    constructor(width, height) {
        super();
        this.width  = width || 300;
        this.height = height || 500;
        this.top    = 0
        this.left   = 0
        this.render();
    }
    render() {
        let box = new Box(this.width, this.height);
        box.pos(this.left, this.top);
        this.addChild(box);

        this.list = new List(this.width, this.height);
        box.addChild(this.list);
    }
    set array(value) {
        this.list.array = value;
    }
}
class List extends Sprite {
    constructor(w, h) {
        super();
        this.dataSource = [];
        this.width = w;
        this.height = h;
        // ps: 初始化每个条目的高度
        this.itemHeight = Util.getSize(110);
        this.repeatX = 1;
        this.repeatY = Math.ceil(this.height / this.itemHeight);
        this._startIndex = 0;
        this.cells = [];
        this.scrollY = 0;
        this.bindEvent();
    }
    setContentSize() {
        if (this.parent) {
            this.parent.height = this.itemHeight * this.repeatY;
            this.parent.resetHeight();
        }
    }
    set bgColor(value) {
        this._bgColor = value;
    }
    get bgColor() {
        return this._bgColor
    }
    set array(value) {
        this.dataSource = value;
        this.renderItems();
        // 滚动视图高度在new时初始化，这里不再改变
        // this.setContentSize();
    }
    renderItems(cell, index) {
        this.dataSource.forEach((it, index) => {
            if (index > this.repeatY) {
                return;
            }
            let item = new Item(this.width, this.itemHeight);
            item.pos(0, this.itemHeight * index);
            item.dataSource = it;
            if (index % 2) {
                item.addItemColorSprite();
            }
            this.addChild(item);
            this.cells.push(item);
        });
        // this.height = this.repeatY * this.itemHeight;
        this.totalHeight = this.dataSource.length * this.itemHeight;
    }
    updateItem(scrollValue) {
        var index = Math.floor(-scrollValue / this.itemHeight);
        var num = 0,
            toIndex;
        if (index > this._startIndex) {
            num = index - this._startIndex;
            var down = true;
            this._startIndex = index;
            toIndex = this._startIndex + this.repeatY;
        } else if (index < this._startIndex) {
            num = this._startIndex - index;
            down = false;
            this._startIndex = index;
            toIndex = this._startIndex;
        }
        if (!num) return;

        var cellIndex = 0;
        var flag = true
        for (var i = 0; i < num; i++) {
            if (down) {
                // 滑动到最后一条，防止再添加条目
                if (this.cells[this.cells.length - 1] && this.cells[this.cells.length - 1].getData()
                    && Number(this.cells[this.cells.length - 1].getData().indexText) >= this.dataSource.length) {
                        flag = true
                        break
                    }
                var cell = this.cells.shift();
                this.cells.push(cell);
                cellIndex = this.cells.length;
            } else {
                cell = this.cells.pop();
                this.cells.unshift(cell);
            }
            let checkToIndex = toIndex // 防止因为滑动过快导致的位置错乱问题
            const currIndex = Number(cell.getData().indexText)
            if (down && checkToIndex !== currIndex + this.repeatY) {
                checkToIndex = currIndex + this.repeatY
            } else if (!down && checkToIndex !== currIndex - this.repeatY - 2) {
                checkToIndex = currIndex - this.repeatY - 2
            }
            var pos = checkToIndex * this.itemHeight;
            cell.y = pos;
        }
        if (!flag) return
        this.cells.forEach((it, i) => {
            this.updateItemData(this.dataSource[i + index], i);
        });
    }
    updateItemData(cell, cellIndex) {
        if (!cell) return
        this.cells[cellIndex].dataSource = cell;
    }
    canDragable(x, y) {
        // 列表之外不能拖动
        if (this.parent) {
            if (x < this.parent.x || x > this.parent.x + this.width ||
                y < this.parent.y || y > this.parent.y + this.height) {
                return false
            }
        }
        return true
    }
    bindEvent() {
        let startX, startY, depY;
        let that = this,
            startTop    = 0,
            endTop      = 0,
            startTime   = 0,
            endTime     = 0;

        let frameid = null;

        wx.onTouchStart(function(e) {
            cancelAnimationFrame(frameid);
            if (!e.changedTouches.length) {
                return
            }
            let point = e.changedTouches[0];
            startX = point.clientX;
            startY = point.clientY;
            if (!that.canDragable(startX, startY)) {
                return;
            }
            startTop = point.clientY;
            startTime = new Date().getTime();
        });

        wx.onTouchMove(function(e) {
            cancelAnimationFrame(frameid);
            if (e.changedTouches.length) {
                let point = e.changedTouches[0];
                if (!that.canDragable(point.clientX, point.clientY)) {
                    return;
                }
                depY = point.clientY - startY;
                if (depY < 0 && that.totalHeight - that.height + MAX_OFFSET + that.y < 0) {
                    return;
                }
                if (depY > 0 && that.y - MAX_OFFSET > 0) {
                    return;
                }
                if (that.y < 0 && that.y > that.height - that.totalHeight) {
                    that.scrollY += depY;
                    that.updateItem(that.y);
                }
                startY = point.clientY;
                that.y += depY;
            }
        });

        var f = 0;
        let start = 0,
            begin = 0,
            distance = 0,
            during = 30,
            speed;

        wx.onTouchEnd(function(e) {
            cancelAnimationFrame(frameid);
            if (!e.changedTouches.length) {
                return
            }
            endTime = new Date().getTime();
            endTop = e.changedTouches[0].clientY;

            depY = endTop - startY;
            startY = endTop;

            start = 0;
            begin = that.y;

            if (depY <= 0 && that.totalHeight - that.height + that.y < 0) {
                // bottom
                distance = that.height - that.totalHeight - that.y;
            } else if (depY >= 0 && that.y > 0) {
                // top
                distance = -that.y;
            } else {
                // 惯性运动
                speed = (endTop - startTop) / (endTime - startTime);
                distance = speed * 1200;
                if (endTop - startTop > 0 && begin + distance > 0) {
                    distance = -begin;
                } else if (endTop - startTop < 0 && (begin + distance) < (that.height - that.totalHeight)) {
                    distance = that.height - that.totalHeight - that.y;
                }
            }

            if (that.y < 0 && that.y > that.height - that.totalHeight) {
                that.scrollY += depY;
                that.updateItem(that.y);
            }
            tween();
            startTop = endTop;
        });

        function tween() {
            var left = that.cubicEaseOut(start, begin, distance, during);
            that.y = left;
            start++;
            if (that.y < 0 && that.y > that.height - that.totalHeight) {
                that.scrollY += depY;
                that.updateItem(that.y);
            }
            if (start <= during) {
                frameid = requestAnimationFrame(tween);
            } else {
                cancelAnimationFrame(frameid);
            }
        }
    }
    cubicEaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
}
