// cart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total_fee: 0,
    choose_all: false,
    choose_num:0
  },
  /**
   * 结算
   */
  confirm:function(){
    const choose_num = this.data.choose_num;
    const ids = this.chosoeIds();
    if(choose_num != 0){
      wx.navigateTo({
        url:'/pages/confirmOrder/confirm?ids='+ids
      })
    }else{
      wx.showToast({
        title:'请选择商品',
        duration:1000
      })
    }
  },
   /**
    * 查看选择的ID
    */
  chosoeIds:function(){
    let ids = '';
    this.data.list.map(item => {
      if(item.choose == 1){
        ids += item.id + ',';
      }
    });
    return ids;
  },
  /**
   * 删除购物车
   */
  delCart:function(event){
    const that = this;
    const index = event.currentTarget.dataset.index;
    let list = that.data.list;
    list[index]['delete'] = 1;
    wx.request({
      url:app.server + 'delCart',
      data:{
        cid:list[index]['id'],
      },
      success:function(res){
        that.setData({
          list:list
        })
      }
    })
  },
  /**
   * 计算总价
   */
  totalFee:function(){
    const that = this;
    const list = that.data.list;
    let total_fee = 0;
    let choose_num = 0;
    list.map(item => {
      if(item.choose == 1){
        total_fee += parseFloat(item.goods_price) * item.number;
        choose_num ++
      }
    })
    that.setData({
      total_fee:total_fee.toFixed(2),
      choose_num:choose_num
    })
  },
  /**
   * 全选
   */
  chooseAll:function(event){
    const that = this;
    let list = that.data.list;
    list.map((item,index) => {
      if(!that.data.choose_all){
        list[index]['choose'] = 1;
      }else{
        list[index]['choose'] = 0;
      }
    });
    that.setData({
      list: list,
      choose_all: !that.data.choose_all
    })
    that.totalFee()
  },
  /**
   * 单选
   */
  choose:function(event) {
    const that = this;
    const index = event.currentTarget.dataset.index;
    let list = that.data.list;
    list[index]['choose'] = list[index]['choose'] == 1 ? 0 : 1;
    that.setData({
      list: list
    })
    that.totalFee()
  },
    /**
     * 添加购物车数量
     */
  delCartNum: function(event) {
    const that = this;
    const index = event.currentTarget.dataset.index;
    let list = that.data.list;
    list[index]['number']--;
    that.setData({
      list: list
    });
    that.totalFee()
  },
  /**
   * 添加购物车数量
   */
  addCartNum: function(event) {
    const that = this;
    const index = event.currentTarget.dataset.index;
    let list = that.data.list;
    list[index]['number']++;
    that.setData({
      list: list
    });
    that.totalFee()
  },
  /**
   * 点击编辑/完成
   */
  edit: function(event) {
    const that = this;
    const index = event.currentTarget.dataset.index;
    let list = that.data.list;
    list[index]['edit'] = !list[index]['edit'];
    that.setData({
      list: list
    });
    if(!list[index]['edit']){
      wx.request({
        url: app.server + 'editCartNum',
        data: {
          cid: list[index]['id'],
          number: list[index]['number'],
        },
        header: {
          'content-type': 'application/json'
        },
        success:function(res){
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.request({
      url: app.server + 'cartInfo',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.data){
          that.setData({
            list: res.data.data
          });
          that.totalFee()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})