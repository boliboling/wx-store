// confirm.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart_list:[],
    total_fee: 0,
    total_number: 0,
    address:[],
    remark:'',
    choose_ids:'',
  },
  /**
   * 点击地址栏（判断是在购物还是个人中心选择地址）
   */
  clickAddress:function(){
    new Promise((resolve,reject) => {
      wx.setStorage({
        key:'is_shopping',
        data:"ture"
      })
    }).then(
      wx.navigateTo({
        url:'/pages/address/address'
      })
    )
  },
  /**
   * 提交订单
   */
  orderSave: function(){
    const that = this;
    wx.request({
      url:app.server + 'orderSave',
      data:{postscript:that.data.remark},
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        const data = res.data.data;
        const url = '/pages/pay/pay?order_sn='+data.order_sn+'&total_fee='+data.total_fee+'&user_name='+data.user_name+'&order_id='+data.order_id;
        if(res.data.status == 1){
          wx.navigateTo({
            url:url
          })
        }else{
          wx.showToast({
            title:res.data.info,
            complete:function(){
              wx.navigateTo({
                url:'/pages/index/index'
              })
            }
          })
        }
      }
    })
  },
  /**
   * 留言
   */
  remark: function(e){
    this.setData({
      remark:e.detail.value
    })
  },
  /**
   * 操作购物车商品数量
   */
   editCartNum: function(index,action){
    const that = this;
    let cart_list = this.data.cart_list;
    let total_fee = parseFloat(this.data.total_fee);
    let total_number = this.data.total_number;
    if(action == 'add'){
      cart_list[index]['number'] ++;
      total_fee += parseFloat(cart_list[index]['goods_price']);
      total_number ++;
    }else{
      if(cart_list[index]['number'] > 1){
        cart_list[index]['number'] --;
        total_fee -= parseFloat(cart_list[index]['goods_price']);
        total_number --;
      }
    }
    //修改购物车商品数量
    wx.request({
      url:app.server + 'editCartNum',
      data:{cid:cart_list[index]['id'],number:cart_list[index]['number']},
      success:function(res){
        console.log(res);
      }
    })
    that.setData({
      cart_list:cart_list,
      total_fee:total_fee.toFixed(2),
      total_number:total_number
    })
   },
  /**
   * 添加购物车商品数量
   */
  addCartNum: function(e) {
    const index = e.currentTarget.dataset.index;
    this.editCartNum(index,'add');
  },
  /**
   * 减少购物车商品数量
   */
  delCartNum: function(e) {
    const index = e.currentTarget.dataset.index;
    this.editCartNum(index,'del');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let carts_choose_ids;
    const that = this;
    new Promise((resolve, reject) => {
      if(options){
        carts_choose_ids = options.ids,
        wx.setStorage({
          key:'carts_choose_ids',
          data:options.ids
        })
        resolve(carts_choose_ids);
      }else{
        wx.getStorage({
          key:'carts_choose_ids',
          success:function(res){
            carts_choose_ids = res.data;
            resolve(carts_choose_ids);
          }
        })
      }
    }).then(carts_choose_ids => {
      wx.request({
        url:app.server + 'confirmOrder',
        data:{ids:carts_choose_ids},
        success:function(data){
          const get_data = data.data.data;
          that.setData({
            cart_list:get_data.cart_list,
            total_fee:get_data.total_fee,
            total_number:get_data.total_number,
            address:get_data.address
          })
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('ss')
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