import Sprite           from './sprite';
import GraphicAction    from './graphicAction';
import Bitmap           from './bitmap';
import Text             from './text';
import Graphic          from './graphic';
import Util             from './util'
/**
 * 绘制item条目，样式在此处修改
 */
export default class Item extends Sprite{
    constructor(width, height) {
        super();
        this._bgColor = '';
        this.size(width, height);
        
        this.initRankIndeSprite();
        this.initHeadImgSprite();
        this.initNickSprite();
        this.initScoreSprite();
    }
    set bgColor(value){
        this._bgColor = value;
    }
    get bgColor(){
        return this._bgColor
    }
    addItemColorSprite(){
        let bg = new Graphic();
        bg.drawRect(0, 0, this.width, this.height, '#ffffff');
        bg.name = 'bg';
        this.addChildAt(bg, 0);
    }
    // 绘制排行序号
    initRankIndeSprite() {
        this.indexText = new Text();
        // ps: 排行序号样式
        this.indexText.fontSize = Util.getSize(26);
        this.indexText.width = Util.getSize(96);
        this.indexText.x = Util.getSize(96) / 2;
        this.indexText.align = 'center';
        this.indexText.valign = 'middle';
        this.indexText.y = this.height / 2;
        this.addChild(this.indexText);
    }
    // 绘制头像
    initHeadImgSprite() {
        // ps: 头像样式
        this.img = new Bitmap(true); // 裁剪成圆形
        this.img.width = Util.getSize(70);
        this.img.height = Util.getSize(70);
        this.img.x = Util.getSize(96);
        this.img.y = (this.height - this.img.height) / 2;
        this.addChild(this.img);
    }
    // 绘制昵称
    initNickSprite() {
        this.nickText = new Text();
        // ps: 昵称样式
        this.nickText.fontSize = Util.getSize(26);
        this.nickText.width = Util.getSize(308)
        this.nickText.x = this.img.x + this.img.width + Util.getSize(20);
        this.nickText.color = "#333333";
        this.nickText.valign = 'middle';
        this.nickText.y = this.height / 2;
        this.addChild(this.nickText);
    }
    // 绘制分数
    initScoreSprite() {
        this.scoreText = new Text();
        // ps: 分数样式
        this.scoreText.color = "#a6a6a6";
        this.scoreText.fontSize = Util.getSize(26);
        this.scoreText.width = Util.getSize(126);
        this.scoreText.x = this.nickText.x + this.nickText.width + Util.getSize(20) + Util.getSize(126) / 2;
        this.scoreText.y = this.height / 2;
        this.scoreText.valign = 'middle';
        this.scoreText.align = 'center';
        this.addChild(this.scoreText);
    }
    // 设置条目数据
    set dataSource(value){
        this.setData(value);
    }
    setData(data) {
        this.scoreText.text = (data.score || 0) + '';
        this.nickText.text = data.nick + '';
        this.indexText.text = data.rank + '';
        this.img.skin = data.src;
        // ps: 排行序号颜色样式
        this.indexText.color = data.rank < 4 ? '#fab818' : "#a6a6a6";
    }
    // 获取条目数据
    getData() {
        return {
            indexText: this.indexText.text,
            img: this.img.skin,
            nickText: this.scoreText.text,
            scoreText: this.scoreText.text
        }
    }
}
