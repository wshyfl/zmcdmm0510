

cc.Class({
    extends: cc.Component,

    properties: {

        content: cc.Node,
        moveSpeed: 1,
        itemInterval: {
            default: 206,
            displayName: "unit间距"
        },
        clickInterval: {
            default: 500,
            displayName: "触发点击最大间隔（毫秒）",
            tooltip: "超过不触发点击"
        },
        moveMaxDistance: {
            default: 10,
            displayName: "可移动最大间隔是10像素",
            tooltip: "超过不触发点击"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gunShowArr = this.content.children;

        this.numSum = this.gunShowArr.length;
        this.initTouchFunc();

        this.autoMove = true;

        




    },

    start() {

    },

    initTouchFunc() {
        for (var i = 0; i < this.gunShowArr.length; i++)
            this.registerTouchFunc(i);
    },

    registerTouchFunc(_id) {
        if (this.gunShowArr[_id] != null) {
            this.gunShowArr[_id].on(cc.Node.EventType.TOUCH_START, function (event) {
                this.startFunc(event, _id)
            }, this);
            this.gunShowArr[_id].on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                this.moveFunc(event, _id)

            }, this);
            this.gunShowArr[_id].on(cc.Node.EventType.TOUCH_END, function (event) {
                this.moveEndFunc(event, _id)
            }, this);
            this.gunShowArr[_id].on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                this.moveEndFunc(event, _id)
            }, this);
        }
    },

    startFunc(event, _buJianID) {
        this.touchStartTime = Tools.getDate("millisecond");
        this.touchStartDistance = 0;
        this.autoMove = false;

    },
    moveFunc(event, _buJianID) {
        for (var i = 0; i < this.gunShowArr.length; i++) {
            this.gunShowArr[i].x += event.getDelta().x;
        }

        this.touchStartDistance += Math.abs(event.getDelta().x)
        this.resetGunShowX();
    },
    moveEndFunc(event, _buJianID) {
        this.autoMove = true;
        var _interval = Tools.getDate("millisecond") - this.touchStartTime;

        if (_interval <= this.clickInterval && this.touchStartDistance < this.moveMaxDistance) {
            this.btnCallFunc(_buJianID);
        }
    },
    resetGunShowX() {
        for (var i = 0; i < this.gunShowArr.length; i++) {
            if (this.gunShowArr[i].x < -300) {
                this.gunShowArr[i].x = this.gunShowArr[(i + this.numSum - 1) % this.numSum].x + this.itemInterval;
            }

            if (this.gunShowArr[i].x >= -300 + this.itemInterval * (this.numSum - 1)) {
                if (i != this.gunShowArr.length - 1)
                    this.gunShowArr[i].x = this.gunShowArr[i + 1].x - this.itemInterval;
                else
                    this.gunShowArr[i].x = this.gunShowArr[0].x - this.itemInterval;
            }
        }

        ;
    },
    update(dt) {
        if (this.autoMove) {
            for (var i = 0; i < this.gunShowArr.length; i++) {
                this.gunShowArr[i].x -= this.moveSpeed;
            }
            this.resetGunShowX();

        }
    },
    btnCallFunc(_index) {
        var _WXPush_icon = this.gunShowArr[_index].getComponent("WXPush_icon")
        if(_WXPush_icon){
            _WXPush_icon.jumpBanner();
        }

    },


});
