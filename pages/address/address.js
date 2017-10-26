// address.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  /**
   * 选为默认地址
   */
  chooseDefault: function(e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    let list = that.data.list;

    new Promise((resolve,reject) => {
      wx.request({
        url:app.server + 'addDefault',
        data:{id:list[index]['id']},
        success:function(res){
          resolve(res.data)
        }
      })
    }).then(res => {
      if(res.status == 1){
        list.map((item,ind) => {
          list[ind]['choose'] = 0;
        })
        list[index]['choose'] = 1;
        that.setData({

          list:list
        });
      }else{
        wx.showToast({
          title:'系统出错'
        })
      }
    }).then(() => {
      wx.getStorage({
        key:'is_shopping',
        success:function(res){
          if(res.data){
            console.log(res.data);
            wx.navigateTo({
              url:'/pages/confirmOrder/confirm'
            })
          }else{
            wx.navigateTo({
              url:'/pages/account/account'
            })
          }
        }
      })
    })

  },
  /**
   * 新增地址
   */
  link: function() {
    wx.navigateTo({
      url:'/pages/addAdd/addAdd'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    console.log(that.data.list.length);
    if(that.data.list.length == 0){
      wx.request({
        url:app.server + 'addList',
        success:function(res){
          that.setData({
            list:res.data.data
          })
        }
      })
    }
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