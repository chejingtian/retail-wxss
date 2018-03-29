import { getShopDetailInfo, getShopReviewList, getScenePictureList, getPromotion, getSalesInfo, getPromotionGoods } from '../../../models/shop.js';
import { formatTime } from '../../../utils/util.js';
function autoImageUrl(url, width, height) {
  return {
    url: `${url}.${width}x${height}.jpg!`
  };
}
let animationShowHeight = 300;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    banners: [],
    shopInfo: {},
    reviewInfo: {},
    sceneList: [],
    couponTitle: '',
    salesInfo: [],
    ifShow: true,
    ifHide: false,
    promotionGoods: [],
    //shopInfoBrief: {},
    //isLoading: true,
    animationData: "",
    showModalStatus: 0,
    isScroll: true,
    wHeight: 0,
    coupons: [],
    subpromotions:[],
    countDownStyle: {
      color: "#fff",
      background: "#000",
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var app = getApp();
    wx.setNavigationBarTitle({
      title: '店铺详情'
    });
    this.data.shopId = options.shopId;
    wx.showLoading({
      title: '加载中...'
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchShopInfo();
    this.fetchSalesInfo();
    this.fetchReviewList();
    this.fetchScenePictureList();
    this.fetchPromotion();
    this.fetchPromotionGoods()
  },
  /**
   * 获取店铺基本信息
   */
  fetchShopInfo() {
    return getShopDetailInfo(this.data.shopId)
      .then((data) => {
        console.log('店铺基本信息', data);
        this.setData({
          banners: data.shopPics.map((item) => {
            return autoImageUrl(item, 750, 420);
          }),
          shopInfo: {
            shopName: data.shopName,
            address: data.shopDetailAddress,
            brandLogo: data.brandLogo,
            tags: data.tags,
            brandTagNames: data.brandTagNames
          },
        });
        wx.hideLoading();
      });
  },
  /**
   * 获取导购员信息
   */
  fetchSalesInfo() {
    return getSalesInfo(this.data.shopId)
      .then((data) => {
        console.log('sales', data);
        this.setData({
          salesInfo: data
        });
        wx.hideLoading();
      });
  },
  /**
   * 获取店铺页面评论列表
   */
  fetchReviewList() {
    return getShopReviewList(this.data.shopId).then((data) => {
      console.log('评论列表', data);
      let reviewInfo = data;
      reviewInfo.resultList.forEach((item) => {
        item.createDate = item.createDate.split(' ')[0];
        // 90*90
        if (item.picture) {
          item.picture = item.picture.split(',').map(url => {
            return autoImageUrl(url, 90, 90);
          });
        }
        let comment_tag = '';
        if (item.redstarReviewDetails != null) {
          item.redstarReviewDetails.forEach((labelItem, idx) => {
            if (idx < item.redstarReviewDetails.length - 1) {
              comment_tag += labelItem.labelName + '、';
            } else {
              comment_tag += labelItem.labelName;
            }
          })
        }
        item.redstarReviewDetails = comment_tag;
        // console.log('jjjjjjjjjj', item.redstarReviewDetails);
      });

      this.setData({
        reviewInfo: reviewInfo,
      })
    });
  },

  /**
   * 获取促销信息
   */
  fetchPromotion() {
    return getPromotion(this.data.shopId).then((data) => {
      const promotionData = data[this.data.shopId];
      console.log('促销方案', promotionData);
      const coupons = promotionData.coupons;
      const subpromotions = promotionData.subpromotions;
      for (var i = 0; i < coupons.length; i++) {
        coupons[i].issueEndTime = formatTime(coupons[i].issueEndTime, 'Y/M/D h:m:s').split(' ')[0];
        coupons[i].issueStartTime = formatTime(coupons[i].issueStartTime, 'Y/M/D h:m:s').split(' ')[0];
        console.log("date", coupons[i].issueEndTime);
      }
      subpromotions.map(item => {
        item.startTime = formatTime(item.startTime, 'Y/M/D h:m:s').split(' ')[0];
        item.endTime = formatTime(item.endTime, 'Y/M/D h:m:s').split(' ')[0];
        
      })


      this.setData({
        subpromotions: promotionData.subpromotions,
        couponTitle: promotionData.couponTitle,
        coupons: promotionData.coupons,

      })
    })
  },
  // 获取爆款商品信息
  fetchPromotionGoods() {
    return getPromotionGoods(this.data.shopId).then((data) => {
      var timestamp = Date.parse(new Date());      
      data.map((item => {
        if (item.promotionStartTime > timestamp){
          Object.assign(item,{
            between:"距开始",
            showTime: item.promotionStartTime
          })
        }else {
          Object.assign(item, {
            between: "距结束",
            showTime: item.promotionEndTime
          })
        }
      }))
      this.setData({
        promotionGoods: data,
      })
      console.log('商家暴款', data);
      
    })
  },

  /**
   * 获取场景美搭
   */
  fetchScenePictureList() {
    return getScenePictureList(this.data.shopId).then((data) => {
      console.log('场景美搭', data);
      this.setData({
        sceneList: data.data.map((item) => {
          return autoImageUrl(item.picUrl, 750, 420);
        }),
      });
      console.log('图片', this.data.sceneList);
    })
  },
  imageLoad: function (e) {
    this.setData({ imageHeight: e.detail.height, imageWidth: e.detail.width });
  },
  showModal: function (event) {
    const index = event.currentTarget.dataset.index;
    console.log('isScroll', this.data.isScroll);
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step();
    // animation.opacity(0).rotateX(-100).step(); 
    this.setData({
      animationData: animation.export(),
      showModalStatus: index,
      isScroll: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function (num) {
    // 隐藏遮罩层  
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: 0,
        isScroll: true
      })
    }.bind(this), 200)
  },
  btnCoupon() {
    wx.showToast({
      title: '请先登录',
      icon: 'loading'
    })
  },
  previewImage(e) {
    console.log('dataset', e.target.dataset, );
    const { index, urls } = e.target.dataset;
    wx.previewImage({
      current: index,
      urls: urls.map(item => {
        return item.url
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    console.log('DATA',this.data)
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
    this.onReady();
    wx.stopPullDownRefresh();
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

  },
  imageLoad(e) {
    const { detail, target } = e;
    const { height, width } = detail;
    const { banners } = this.data;
    this.setData({
      banners: banners.map((banner) => {
        return banner
      })
    });
  },
 
  toGoodsPage(e) {
    const sku = e.target.dataset;
    console.log('skuuuuuu',sku)
    wx.redirectTo({
      url: '/pages/goods/goods-detail/goodsDetail?goodsId=' + e.target.dataset.sku,
    })
  }
})