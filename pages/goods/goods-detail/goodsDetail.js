// pages/goods/goods-detail/goodsDetail.js
import { getGoodsInfo, getItemAndPromotionDetail, getItemSubPromotionAndCouponInfo } from '../../../models/goods.js';
import { getShopDetailInfo3 } from '../../../models/shop.js';
import { formatTime, getTime } from '../../../utils/util.js';

function autoImageUrl(url) {
  return {
    url: `${url}.750x750.jpg!`,
    width: '750',
    height: '750'
  };
}

function createModulesInfo(info) {
  const retVal = [];
  retVal.push({
    title: '品牌',
    value: info.brandName
  });
  retVal.push({
    title: '产地',
    value: info.countryName
  });
  retVal.push({
    title: '等级',
    value: info.lvInfo
  });
  retVal.push({
    title: '颜色',
    value: info.color
  });
  retVal.push({
    title: '计价单位',
    value: info.chargeUnitName
  });
  retVal.push({
    title: '型号',
    value: info.modelNumber
  });
  retVal.push({
    title: '退换货',
    value: info.refundType
  });
  retVal.push({
    title: '价格类型',
    value: info.priceType
  });
  retVal.push({
    title: '辅材',
    value: info.material2
  });
  retVal.push({
    title: '饰面',
    value: info.material3
  });
  retVal.push({
    title: '基材',
    value: info.material1
  });
  return retVal;
}
let animationShowHeight = 300;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classfiyNav: [
      {
        "text": "商品"
      },
      {
        "text": "参数"
      },
      {
        "text": "详情"
      },
      {
        "text": "推荐"
      }],
    sku: '',
    banners: [],
    goodsInfo: {},
    shopInfoBrief: {},
    isLoading: true,
    // 规格参数
    modules: [],
    wHeight: 0,
    navOpacity: 0,
    navId: 0,
    topBlock: false,
    showRule: false,
    countDownStyle: {
      color: "#dfaf7d",
      background: "white",
    },
    doubleDownStyle: {
      color: "#fff",
      background: "#000",
    },
    showModalStatus: 0,
    shopId: 0,
    isScroll: true,
    itemPromotionInfo: {},
    listItemSubPromotionInfo: [],
    listItemCouponInfo: [],
    limitedTimeType: 0,
    priceShowType: 0,
    saleType: 0,
    activityStatus: 0,
    progressWidth: '1%',
    module_num: true,
    navActive: 0,
  },
  launchAppError: function (e) {
    console.log(e.detail.errMsg)
  },
  tabClassfiy: function (e) {
    var that = this;
    var index = e.currentTarget.id.slice(4);
    console.log(index);
    that.setData({
      id: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log('onloadOptions', options)
    var app = getApp();
    const { shopId, goodsId } = options;
    this.setData({
      shopId: shopId,
      goodsId: goodsId
    });
    this.fetchItemSubPromotionAndCouponInfo();

    wx.setNavigationBarTitle({
      title: '商品详情'
    });
    this.data.sku = options.goodsId;
    wx.showLoading({
      title: '加载中...'
    });
    // getShopDetailInfo3();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight
        })
      }
    })
  },
  // showRule: function (e) {
  //   this.setData({
  //     showRule: true
  //   })
  // },
  // hideModal: function (e) {
  //   this.setData({
  //     showRule: false
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchGoodsInfo();
    this.fetchItemAndPromotionDetail();
  },
  /**
   * 获取商品基本信息
   */
  fetchGoodsInfo() {
    return getGoodsInfo(this.data.sku)
      .then((data) => {
        console.log('data', data);
        const modules = createModulesInfo(data);
        this.setData({
          goodsInfo: data,
          banners: data.imgs.map((img) => {
            return autoImageUrl(img);
          }),
          modules,
          shopInfoBrief: {
            ...data.shopInfoBrief,
            shop_pic: `${data.shopInfoBrief.shop_pic}.106x106.jpg!`
          },
          // isLoading: false
        });
        wx.hideLoading();
      });
  },
  fetchItemAndPromotionDetail() {
    return getItemAndPromotionDetail(this.data.sku)
      .then((data) => {
        if (data.priceShowType == 2 || data.priceShowType == 4) {
          data.itemPromotionInfo.startTime = getTime(data.itemPromotionInfo.startTime);
          data.itemPromotionInfo.endTime = getTime(data.itemPromotionInfo.endTime);
        }
        if (data.priceShowType == -1) {
          const showTime = getTime(data.itemPromotionInfo.bookingStartTime);
          data.itemPromotionInfo.showTime = showTime;
        }
        let offeredPersent = data.itemPromotionInfo.offeredNumber / 20;
        offeredPersent = (Math.round(offeredPersent * 10000) / 100).toFixed(2) + '%';
        console.log('itemPromotionInfo', data.itemPromotionInfo.showTime)
        this.setData({
          itemPromotionInfo: data.itemPromotionInfo,
          itemInfo: data.itemInfo,
          limitedTimeType: data.limitedTimeType,
          priceShowType: data.priceShowType,
          saleType: data.saleType,
          activityStatus: data.activityStatus,
          progressWidth: offeredPersent,
        });
        wx.hideLoading();
      });
  },
  fetchItemSubPromotionAndCouponInfo() {
    return getItemSubPromotionAndCouponInfo(this.data.shopId, this.data.goodsId)
      .then((data) => {
        console.log('promitionData', data);
        const listItemSubPromotionInfo = data.listItemSubPromotionInfo;
        listItemSubPromotionInfo.map((item) => {
          item.startTime = formatTime(item.startTime, 'Y/M/D h:m:s').split(' ')[0];
          item.endTime = formatTime(item.endTime, 'Y/M/D h:m:s').split(' ')[0];
        });
        this.setData({
          listItemCouponInfo: data.listItemCouponInfo,
          listItemSubPromotionInfo: data.listItemSubPromotionInfo,
        })
        wx.hideLoading();
      });
  },
  scroll: function (e) {
    let scrollTop = e.detail.scrollTop;
    let navOpacity = this.data.navOpacity;
    navOpacity = (scrollTop / 300) < 1 ? (scrollTop / 300) : 1;
    this.setData({
      navOpacity: navOpacity,
      topBlock: true
    });
    if (scrollTop < 511) {
      this.setData({
        navActive: 0
      });
    }
    if (scrollTop > 512 && scrollTop <808 ){
      this.setData({
        navActive: 1
      });
    }
    if (scrollTop > 808 && scrollTop < 4300 ) {
      this.setData({
        navActive: 2
      });
    }
    if (scrollTop > 4300) {
      this.setData({
        navActive: 3
      });
    }
    // console.log(e.detail.scrollTop);
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
  showMore: function (e) {
    const module_num = this.data.module_num;
    this.setData({
      module_num: !module_num
    })
    console.log(module_num);
  },
  btnCoupon() {
    wx.showToast({
      title: '请先登录',
      icon: 'loading'
    })
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
  previewBanners(e) {
    const { index } = e.target.dataset;
    wx.previewImage({
      current: index,
      urls: this.data.banners.map((banner) => {
        return banner.url;
      })
    })
  },
  scrollModule(e) {
    console.log('MS',e)
  },
  toShopPage(e) {
    wx.redirectTo({
      url: '/pages/shop/shop-detail/shopDetail?shopId=' + this.data.shopId,
    })
  }
})