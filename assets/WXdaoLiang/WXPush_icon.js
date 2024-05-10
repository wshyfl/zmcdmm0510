


cc.Class({
    extends: cc.Component,

    properties: {
        isBanner: false,
        targetIndex: -1,

    },

    onLoad() {
        if (!window.wxPush.showDaoLiang || !window.wxPush.downLoadOver) {
            this.node.destroy();
            return;
        }
        this.icon = cc.find("icon", this.node);
        this.appId = null;
        if (!this.isBanner) {
            this.node.on("touchend", () => {
                if (this.appId)
                    this.jump(this.appId);
            }, this);
        }
        this.tempScale = this.node.scale;
        this.node.scale = 0;
    },
    
    jumpBanner() {
        if (this.appId)
            this.jump(this.appId);
    },
    start() {
        if (!window.wxPush.showDaoLiang || !window.wxPush.downLoadOver) {
            return;
        }
        this.schedule(() => {
            this.reset();
        }, window.wxPush.changeDuration);
        this.reset();
    },
    reset() {
        var self = this;
        if (this.targetIndex == -1) {//单个随机
            var _data = window.wxPush.getRandomData();
            console.log(" 单个图标 " + _data)
            if (_data) {
                self.icon.getComponent(cc.Sprite).spriteFrame = _data.spr;
                self.appId = _data.appId;
                self.node.scale = self.tempScale;
            }
        }
        else if (this.targetIndex >= 0) {//顺序
            if (window.pushArr && window.pushArr.length > 0) {

                var _data = window.wxPush.getDataOrder(window.wxPush.randomArr[this.targetIndex % window.pushArr.length]);

                console.log(" 多个图标 " + _data)
                if (_data) {
                    self.icon.getComponent(cc.Sprite).spriteFrame = _data.spr;
                    self.appId = _data.appId;
                    self.node.scale = self.tempScale;
                }
            }
        }
    },
    jump(_appid) {
        console.log("jump ")
        wx.navigateToMiniProgram({
            appId: _appid,
            path: "",
            extraData: {
                foo: 'bar'
            },
            envVersion: 'release',
            success(res) {
                var aa = "进入" + _appid

            },
            fail(res) {
                console.log("更多游戏失败  " + JSON.stringify(res))
            },
        })
    },


    // update (dt) {},
});
