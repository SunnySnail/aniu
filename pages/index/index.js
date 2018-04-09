//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        list: [],
        index_time: 0,
        showBox: false,
        hidden: true
    },
    //事件处理函数
    bindViewTap: function () {

    },
    onLoad: function (options) {
        this.setData({
            from: options.from || 'aniu'
        })
        this.fetchList();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    filterList: function (list) {
        var _list = [];

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var _item = {
                aniu_fundname: item.fund.aniu_fundname,
                petext: item.petext,
                stock_name: item.index_info[0],
                pe: Number(item.index_info[1]).toFixed(2),
                rank: item.index_info[2],
                color: item.color,
                indexno_id: item.indexno_id
            }
            _list.push(_item);
        }

        return _list;
    },
    fetchList: function () {
        var url = "https://m.aniu.com.cn/fof_pe_share/";
        var self = this;

        wx.request({
            url: url,
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                self.setData({
                    index_time: res.data.index_time,
                    list: self.filterList(res.data.slist)
                })
            }
        })
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    onShareAppMessage: function (res) {
        if (res.from == 'button') {
            console.log(res.target);
        }

        return {
            title: '指数估值定投管家',
            path: 'pages/index/index'
        }
    },
    canShow: function ($e) {
        if ($e.touches.length == 3) {
            this.setData({
                showBox: true
            });
        }

        if ($e.touches.length == 2) {
            this.setData({
                showBox: false
            })
        }

    },

    gotoKefu: function(){
        this.setData({
            hidden: false
        })
    }
})