// pay.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:0,
    order_sn:'',
    total_fee:'',
    user_name:''
  },
  /**
   * 支付
   */
  pay:function () {
    const that = this;
    wx.login({
      success:function(res){
        if(res.code){
          wx.request({
            url:app.server + 'pay',
            data:{code:res.code,orderid:that.data.order_id},
            method:'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(pay_res){
              const wx_conf = pay_res.data.data
              wx.requestPayment({
                 'timeStamp': wx_conf.timeStamp.toString(),
                 'nonceStr': wx_conf.nonceStr,
                 'package': wx_conf.package,
                 'signType': wx_conf.signType,
                 'paySign': wx_conf.paySign,
                 'success':function(res2){
                    console.log(res2)
                 },
                 'fail':function(res2){
                    console.log(res2)
                 }
              })
            }
          })
        }else{
          console.log(res);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        order_id:options.order_id,
        order_sn:options.order_sn,
        total_fee:options.total_fee,
        user_name:options.user_name
      })
    }
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