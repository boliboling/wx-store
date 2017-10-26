// pdetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banlist:[],
    info:{},
    show:false,
    intro:'',
    collection:false,
    cart_num:0,
    showDialog:false,
    shopping_num:1,
    total_fee:0,
    para:[],
    formatid:0,
    colorid:0,
    price:0,
  },
  /**
   * 选择属性
   */
  choosePara: function(e){
    const formatid = e.target.dataset.formatid;
    const colorid = e.target.dataset.colorid;
    const detail_list = this.data.para.detail_list;
    if(formatid){
      this.setData({
        formatid:formatid
      })
    }
    if(colorid){
      this.setData({
        colorid:colorid
      })
    }
    const data_formatid = this.data.formatid;
    const data_colorid = this.data.colorid;
    if(data_formatid && data_colorid){
      const choose_on = detail_list.filter(item => {
        if(item.format == data_formatid && item.color == data_colorid){
          return item;
        }
      })
      this.setData({
        price:choose_on[0].price,
        total_fee:choose_on[0].price*this.data.shopping_num
      })
    }
  },
  /**
   * 立即购买
   */
  buyNow: function(){
    const that = this;
    const pid = that.data.info.id;
    wx.request({
      url: app.server + 'addToCart', //仅为示例，并非真实的接口地址
      data: {
        pid: pid,
        num:that.data.shopping_num
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.data){
          wx.navigateTo({url:'/pages/cart/cart'})
        }
      }
    })
  },
  /**
   * 添加购买数量
   */
  addShoppingNum: function(){
    const that = this;
    let shopping_num = that.data.shopping_num + 1;
    that.setData({
      shopping_num:shopping_num,
      total_fee:that.data.price * shopping_num
    })
  },
  /**
   * 减少购买数量
   */
  delShoppingNum: function(){
    const that = this;
    let shopping_num = that.data.shopping_num - 1 <= 1 ? 1 :  that.data.shopping_num - 1;
    that.setData({
      shopping_num:shopping_num,
      total_fee:that.data.price * shopping_num
    })
  },
  /**
   * 操作弹出框
   */
  toggleDialog: function(){
    const that = this;
    that.setData({
      showDialog:!that.data.showDialog
    })
  },
  /**
   * 关闭属性栏
   */
  hidePara: function(options) {
    const that = this;
    that.setData({
      show:false
    })
  },
  /**
   * 显示属性栏
   */
  showPara: function(options) {
    const that = this;
    that.setData({
      show:true
    })
  },
  /**
   * 收藏
   */
  collect:function() {
    const that = this;
    wx.request({
      url:app.server + 'prodCollection',
      data: {
        pid:that.data.info.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        console.log(res.data.data);
        that.setData({
          collection:res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    var that = this
    var WxParse = require('../../wxParse/wxParse.js');
    wx.request({
        url: app.server+'pdetailAjax', //仅为示例，并非真实的接口地址
        data: {
          id: 2,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          const index_data = res.data.data;
          var article = index_data.info.intro;
          WxParse.wxParse('article', 'html', article, that,5);  
          const ban_list = [];
          if(index_data.ban_list){
            index_data.ban_list.map(item => {
              ban_list.push(item.image)
            })
          }
          that.setData({
            banlist: ban_list,
            info:index_data.info,
            collection:index_data.collection,
            cart_num:parseInt(index_data.cart_num) > 9 ? 'n' : parseInt(index_data.cart_num),
            total_fee:index_data.info.price,
            para:index_data.prod_para,
            price:index_data.info.price
          })
        }
      })
  },
  /**
   * 加入购物车
   */
  addToCart: function() {
    const that = this;
    const pid = this.data.info.id;
    wx.request({
      url: app.server + 'addToCart', //仅为示例，并非真实的接口地址
      data: {
        pid: pid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.data){
          let cart_num = that.data.cart_num;
          if(cart_num != 'n'){
            cart_num = parseInt(that.data.cart_num)+1 > 9 ? 'n' : parseInt(that.data.cart_num)+1
          }
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            // showDialog:!that.data.showDialog,
            cart_num:cart_num
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})