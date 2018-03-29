// components/sales-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    salesInfo: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnCall(e){
      const num = e.currentTarget.dataset.num;
      console.log('num',e)
      wx.makePhoneCall({
        phoneNumber: num,
      })
    }
  }
})
