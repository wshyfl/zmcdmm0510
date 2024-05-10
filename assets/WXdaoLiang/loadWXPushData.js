

cc.Class({
    extends: cc.Component,

    properties: {
        selfAppId: "wx85a1afc39ce96b19",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        window.wxPush = this;
        window.wxPush.showDaoLiang = true;//显示倒量
        this.changeDuration = 6;//切换图片的 间隔
        cc.game.addPersistRootNode(this.node);

        window.pushArr = new Array();

        this.dataLoadedNum = 0;//已经下载的图片/id 数量
        this.sprArr = new Array();
        this.jsonUrl = 'https://wanbgame.com/game/wxpush/Daoliang.json';//地址



        this.downLoadOver = false;//加载成功?
        this.loadData();
     
        



    },

    loadData() {
        var self = this;
        cc.assetManager.loadRemote(this.jsonUrl, function (err, data) {
            if (err) {
                console.log("资源加载错误  " + err);
                return
            }
            console.log("长度是 " + data.json.length)

            for (var i = 0; i < data.json.length; i++) {
                console.log("icon名称是: " + data.json[i].iconID)
                console.log(data.json[i].ID + "关闭: " + data.json[i].close)
                if(window.wxPush.showDaoLiang){
                    if (data.json[i].close) {
                        if (self.selfAppId == data.json[i].APPID) {
                            window.wxPush.showDaoLiang = false;
                            console.log("倒量关闭 " + data.json[i].ID);
                        }    
                    }
                }
                if (self.selfAppId != data.json[i].APPID)
                window.pushArr.push({ "appName":data.json[i].ID,"appId": data.json[i].APPID, "spr": "https://wanbgame.com/game/wxpush/" + data.json[i].iconID + ".png" });
            }
            if (window.wxPush.showDaoLiang)
                self.loadIcon();
            else
                console.log("倒量关闭 无需下载图片")
        });
    },

    loadIcon() {
        if (this.dataLoadedNum >= window.pushArr.length) {
            console.log("图片下载完毕  下载总数量为 " + this.dataLoadedNum);
            this.loadComplete();
            return;
        }
        var self = this;
        console.log("图片加载~~~  " +window.pushArr[this.dataLoadedNum].spr);
        cc.assetManager.loadRemote(window.pushArr[this.dataLoadedNum].spr, function (err, texture) {
            if (err) {
                console.log("图片加载错误  " + err);
                return
            }
            console.log("图片加载~~~ 2  ");
            self.loadIcon();
            var spriteFrame = new cc.SpriteFrame(texture);

            var _node =new cc.Node();
            _node.addComponent(cc.Sprite);
            _node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            _node.parent = self.node;
            self.node.active = false;
            self.sprArr.push(_node);
        });
        this.dataLoadedNum++;//已经下载的图片/id 数量
    },
    loadComplete(){
        console.log("小游戏跳转资源加载成功");

        this.downLoadOver = true;//加载成功?
        this.arrIndex = new Array();
        for(var i=0;i<window.pushArr.length;i++){
            this.arrIndex.push(i);
        }
        this.randomArr = this.getNewArr(this.arrIndex, this.arrIndex.length);//随机数组
        this.schedule(() => {
            this.randomArr = this.getNewArr(this.arrIndex, this.arrIndex.length);//随机数组
        }, this.changeDuration);
        
    },
    getDataOrder(_index) {
        if (window.pushArr.length <= 0) {
            setTimeout(() => {
                this.getDataOrder();
            }, 500)
            return null;
        }
        var _data = { "appId": window.pushArr[_index].appId, "spr": this.sprArr[_index].getComponent(cc.Sprite).spriteFrame }
        // console.log("名称 " +window.pushArr[_index].appName+"  appID: "+window.pushArr[_index].appId
        // +"  spr: "+this.sprArr[_index].getComponent(cc.Sprite).spriteFrame.name)
        return _data;
    },
    //单个图标--完全随机
    getRandomData() {

        //***调用逻辑
        /**1 调用 appID */
        //     this.idName.string = window.pushArr[_a].appId;//appid
        /**2 调用图片 */
        //     this.imgspr.spriteFrame = window.pushArr[_a].spr;//图片

        if (window.pushArr.length <= 0) {
            setTimeout(() => {
                this.getRandomData();
            }, 1000)
            return null;
        }
        var _index = this.random(0, window.pushArr.length - 1);
        while (window.pushArr[_index].appId == this.selfAppId) {
            _index = this.random(0, window.pushArr.length - 1);
        }
        var _data = { "appId": window.pushArr[_index].appId, "spr": this.sprArr[_index].getComponent(cc.Sprite).spriteFrame }
        return _data;
    },
    getRandomArr() {
        var _arr = null;
        _arr = this.getNewArr(window.pushArr, window.pushArr.length);

        return _arr;
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    getNewArr(Arr, num)	//传入2个参数，一个数组，要获取数组的长度 (目的 将一个数组打乱后重新返回)
    {
        var arr = new Array();  //这个数组的目的是把传入进来的数组复制一份
        for (var i in Arr) {
            arr.push(Arr[i]);
        }  //这个for 循环用来把传入的数组复制一份  

        var return_arr = new Array();  //存储随机数用的数组
        for (var i = 0; i < num; i++) 	//获取随机数
        {
            if (arr.length > 0) {
                var nums = Math.floor(Math.random() * arr.length);  //从arr里面随机一个地址并 赋给变量nums
                return_arr[i] = arr[nums];	//将arr地址里的值 给   return_arr[i];
                arr.splice(nums, 1);	//删除 地址上的数字，防止在随机出来重复的
            }
            else {
                break;
            }
        }
        return return_arr;		//返回获取的5个值
    },
});
