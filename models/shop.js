import { preProcess } from '../utils/util.js';

export function getShopDetailInfo(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-rtapi/shop/v1.0.0/getRetailShopDetailInfo/${shopId}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}

export function getShopReviewList(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-longyan/api/shop/queryShopReviewList?objectId=${shopId}&objectType=shop_review&currentPage=1&pageSize=2`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}

export function getScenePictureList(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-longguo/photoAlbum/listSceneBeautifulPicture/${shopId}?page=1&limit=10`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}

export function getPromotion(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-rtapi/shop/v1.0.0/listPromotionByShopIds/${shopId}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}
// https://wap.mmall.com/api-longguo/goods/listShopPromotionGoods/37567
export function getSalesInfo(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-rtapi/shop/v1.0.0/getSalesAssistantList/${shopId}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}

export function getPromotionGoods(shopId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://wap.mmall.com/api-longguo/goods/listShopPromotionGoods/${shopId}`,
      success(res) {
        let retData = preProcess(res);
        resolve(retData);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}
