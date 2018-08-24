class Util {
    /**
     * 获取相对于750设计稿的尺寸
     */
    getSize (size) {
        return size * GameGlobal.stageWidth / 750
    }
}
export default new Util()

