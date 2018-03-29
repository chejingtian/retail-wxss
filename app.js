//app.js
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    console.log('onLaunch options', options.query);
    // dummy
    // wx.reLaunch({
    //   url: `pages/goods/goods-detail/goodsDetail?goodsId=${options.query.goodsId}`
    // })

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getParams() {
    return this.globalData.params;
  },
  globalData:{
    userInfo:null,
    params: {
      goodsId: '11107268'
    }
  }
})