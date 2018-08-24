import Graphic  from './canvas/graphic';
import Text     from './canvas/text';
import Bitmap   from './canvas/bitmap';
import ListView from './canvas/list';
import Box      from './canvas/box';
import Util     from './canvas/util'

const sysInfo = wx.getSystemInfoSync();
GameGlobal.height = sysInfo.windowHeight;
GameGlobal.width = sysInfo.windowWidth;
/**
 * 好友排行
 */
export default class FriendRank {
    /**
     * @param stage
     * @param scrollHeight 滚动视图的 可视区域高度
     */
    constructor(stage, scrollHeight) {
        this.scrollHeight = scrollHeight
        this.stage = stage;
        this.visible = true;
        this.getFriendData();
    }
    update() {

    }
    getFriendData() {
        this.list = [
            {
                key: 1,
                nickname: "1111111111",
                src: 'https://wx.qlogo.cn/mmopen/vi_32/Ogia9Flzb3icFGTA9icRNHWqDQPMqQN45N3O3qiamsCpicFg63rovLTMTK49EiaGuEkDvONGe66by6dKiabjl1zqbIbnQ/132',
                score: 10000
            }
        ]
        // if (!wx.getFriendCloudStorage) return [];
        // wx.getFriendCloudStorage({
        //     keyList: ['score'],
        //     success: res => {
        //       //console.log(JSON.stringify(res));
        //         if (!res.data.length) return;
        //         this.list = res.data;
                this.render();
        //     },
        //     fail: err => {

        //     }
        // });
    }
    render() {
        if (!this.visible) return
        if (!this.list || !this.list.length) return;

        // 测试数据
        for (var i = 0; i < 49; i++) {
            const newObj = {
                ...this.list[0]
            }
            newObj.key = this.list[this.list.length - 1].key + 1
            newObj.score = i * 100
            this.list.push(newObj);
        }

        let data = this.getSortedListData();

        this.renderList(data);
        // this.renderBackground();
        // this.renderTitle();
    }
    /**
     * 格式化列表数据
     */
    getSortedListData(){
        let data = [];
        this.list.forEach((it, index) => {
            data.push({
                rank: Number(it.key),            // 排名
                nick: it.nickname,               // 昵称
                src: it.src,                     // 头像链接
                score: Math.floor(it.score)      // 分数
            });
        });
        // 按分数排序
        data.sort((a, b) => {
            return b.score - a.score
        });
        data.forEach((it, index) => {
            it.rank = ++index
        });
        return data
    }
    renderList(data){
        // ps: 初始化容器和列表 宽高，高度为 滚动视图可视区域的高度
        let box = new Box(Util.getSize(640), this.scrollHeight);
        let _list = new ListView(Util.getSize(640), this.scrollHeight);
        _list.array = data;

        box.addChild(_list);
        this.stage.addChild(box);
    }
    renderTitle(){
        let title = new Text();
        title.pos(GameGlobal.width / 2, 50);
        title.valign    = 'middle';
        title.align     = 'center';
        title.fontSize  = 24;
        title.text      = '好友排行榜';
        title.color     = 'white';
        this.stage.addChild(title);
    }
    renderBackground() {
        let background = new Graphic();
        background.drawRect(0, 0, this.stage.width, this.stage.height, 'rgba(0,0,0,0.6)');
        this.stage.addChild(background);
    }
}
