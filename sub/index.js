import FriendRank   from './friendRank'
import GroupRank    from './groupRank'
import MiniCanvas   from './canvas/index';

const stage = new MiniCanvas(sharedCanvas);
// 赋值舞台宽度，用于计算 相对于游戏舞台大小 的尺寸
GameGlobal.stageWidth = sharedCanvas.width

export default class Main {
    constructor() {
        this.initMessage();
    }
    initMessage() {
        wx.onMessage(data => {
            switch (data.command) {
                case 'showFriendRank':
                    // data.scroll_height 滚动视图的高度，相对于 640 的舞台尺寸
                    const scrollHeight = data.scroll_height * GameGlobal.stageWidth / 640
                    this.renderFriendRank(scrollHeight);
                    break;
                case 'showGroupRank':
                    this.renderGroupRank(data.shareTickets);
                    break;
                case 'updateData':
                    break;
                case 'otherMessage':
                    break;
            }
        });
    }
    
    renderFriendRank(scrollHeight) {
        this.hideGroupRank();
        this.friendRank = new FriendRank(stage, scrollHeight);
    }
    hideFriendRank() {
      if (this.friendRank)
        this.friendRank.visible = false;
    }
    renderGroupRank(scrollHeight, shareTicket) {
      this.hideFriendRank();
      this.groupRank = new GroupRank(stage, scrollHeight, shareTicket);
    }
    hideGroupRank() {
      if (this.groupRank)
        this.groupRank.visible = false;
    }
}
new Main();

