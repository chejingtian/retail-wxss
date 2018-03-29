function preProcess(res) {
  console.log('res', (res));
  return res.data && res.data.dataMap;
}

export function getGoodsInfo(sku) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-longguo/goods/getGoodsInfo/${sku}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}
// /v1.0.0/item/getItemAndPromotionDetail/{sku}
export function getItemAndPromotionDetail(sku) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-rtapi/shop/v1.0.0/item/getItemAndPromotionDetail/${sku}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}
// /v1.0.0/item/getItemSubPromotionAndCouponInfo/{shopId}/{skuId}

export function getItemSubPromotionAndCouponInfo(shopId,sku) {
  console.log("goodsapi",shopId,sku);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-rtapi/shop/v1.0.0/item/getItemSubPromotionAndCouponInfo/${shopId}/${sku}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}