// prods.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    showlist:[],
    inputShowed: false,
    cid:0,
    inputVal: "",
    nomore:false
  },
  lower: function(e) {
    const that = this;
    if(!that.data.nomore){
      wx.request({
        url:app.server + 'loadMoreProds',
        data:{cid:that.data.cid,count:that.data.showlist.length,search_value:that.data.inputVal},
        success:function(res){
          const res_data = res.data;
          if(res_data.status == 1){
            that.setData({
              showlist:that.data.showlist.concat(res_data.data)
            })
          }else{
            that.setData({
              nomore:true
            })
          }
        }
      })
    }
  },
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      const search_value = e.detail.value;
      const list = this.data.list;
      const showlist = list.map(item => {
        return item;
      }).filter(item =>{
        return item.name.includes(search_value)
      })
      this.setData({
          inputVal: search_value,
          showlist:showlist
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const cid = options.cid ? options.cid : 0;
    const that = this;
    wx.request({
      url:app.server + 'prods',
      data:{cid:cid},
      success:function(res){
        const res_data = res.data.data;
        that.setData({
          list:res_data,
          showlist:res_data,
          cid:cid,
        })
      }
    })
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