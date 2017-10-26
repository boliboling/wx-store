//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        banlist: [],
        cats: [],
        imgheights: [],
        prodlist:[]
    },
    imageLoad: function(e) {
        //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight
        var imgheights = this.data.imgheights
        //把每一张图片的高度记录到数组里  
        imgheights.push(imgheight)
        this.setData({
            imgheights: imgheights,
        })
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    /**
     * 判断登陆 
     */
    wxCheckSession: function() {
        const that = this;
        new Promise((resolve) => {
            wx.checkSession({
                success: function() {
                  wx.getUserInfo({
                    withCredentials:true,
                    lang:'zh_CN',
                    success:function(res){
                      resolve(res)
                    }
                  })
                },
                fail: function() {
                    that.wxLogin();
                }
            })
        }).then(res => {
          this.wxSaveUserInfo(res);
        })
    },
    /**
     * 保存用户资料
     */
    wxSaveUserInfo(data){
      wx.request({
        url:app.pserver + 'saveUserInfo',
        data:{
          encryptedData:data.encryptedData,
          iv:data.iv,
          rd_session:wx.getStorageSync('3rd_session')
        },
        method:'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success:function(res){
          console.log(res)
        }
      })
    },
    /**
     *  登陆操作 
     */
    wxLogin: function() {
        new Promise(resolve => {
            wx.login({
                success: function(res) {
                    resolve(res.code);
                }
            })
        }).then(code => {
            wx.request({
                url: app.pserver + 'infoInit',
                data: { code: code },
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    console.log(res);
                    if(res.data.data){
                      wx.setStorage({
                        key:'3rd_session',
                        data:res.data.data
                      })
                    }
                }
            })
        })
    },
    /*提取分类中商品列表*/
    getProdList: function(cat_list){
        let prod_list = [];
        cat_list.map(item => {
            if(item.prod_list){
                prod_list = prod_list.concat(item.prod_list);
            }
        })
        this.setData({
            prod_list: prod_list
        })
    },
    onLoad: function() {
        var that = this;
        // this.wxCheckSession();
        wx.request({
            url: app.server + 'indexAjax', //仅为示例，并非真实的接口地址
            data: {
                x: '',
                y: ''
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                const index_data = res.data.data;
                const ban_list = [];
                const cat_list = [];
                index_data.ban_list.map(item => {
                    ban_list.push(item.picurl)
                });
                that.getProdList(index_data.cat_list);
                that.setData({
                    banlist: ban_list,
                    cats: index_data.cat_list
                })
            }
        })
    }
})