
const url = $request.url;
let body = $response.body;

/**
 * 高德地图综合去广告脚本
 * 1. 打车 content_info：去皮肤 + 过滤金刚位
 * 2. POI详情页：去优惠券/营销模块
 */

try {
  let obj = JSON.parse(body);

  // ==================== 1. 打车 content_info ====================
  if (url.includes("/car/order/content_info")) {
    if (obj?.data?.lubanData) {
      // 清空营销皮肤
      if (obj.data.lubanData.skin?.dataList) {
        obj.data.lubanData.skin.dataList = [];
      }

      // 过滤金刚位工具箱（只保留指定4个）
      if (obj.data.lubanData.kingToolBox?.dataList) {
        const keep = [
          "dache_toolbox_taxi_overseas_channel", // 出境用车
          "dache_toolbox_hitch",                 // 顺风车
          "dache_toolbox_GDIntercity",           // 高德拼车
          "dache_toolbox_chauffeur"              // 代驾
        ];

        obj.data.lubanData.kingToolBox.dataList = obj.data.lubanData.kingToolBox.dataList.filter(item => {
          return item?.biz?.id && keep.includes(item.biz.id);
        });
      }
    }
  }

  // ==================== 2. POI 详情页去广告 ====================
  else if (url.includes("/shield/search/poi/detail")) {
    if (obj?.data) {
      const adModules = [
        "CouponBanner",
        "CouponWidget",
        "CouponMiddleBanner",
        "CouponDetailMiddleBanner",
        "CouponFooterStickBanner",
        "CouponPopup",
        "MarketingGoods",
        "poiDetailNewBeltV2",
        "adStoreBigBannerModule",
        "shopStructGift",
        "quickFlashSaleGoodsShelf",
        "poiDetailHotSaleShelf",
        "group_buying_shelf",
        "commonGoodsShelf",
        "kaProductMixServiceShelf",
        "packageShelf",
        "dayTripList",
        "scenic_ticket",
        "movie_info",
        "ktvBookingShelf",
        "carRentGroupBuy",
        "carRentNorm",
        "carRentalKaNorm",
        "standardGasPriceShelf",
        "housesShelf",
        "mallNews",
        "brand_shop_bar",
        "enhanceCustomerServicePoiModule"
      ];

      // 删除广告模块
      if (obj.data.modules) {
        adModules.forEach(key => {
          if (obj.data.modules[key]) {
            delete obj.data.modules[key];
          }
        });
      }

      // 清理 regions 引用
      if (obj.data.regions) {
        for (let region in obj.data.regions) {
          if (Array.isArray(obj.data.regions[region])) {
            obj.data.regions[region] = obj.data.regions[region].filter(
              item => !adModules.includes(item)
            );
          }
        }
      }

      // 清理优惠券刷新列表
      if (obj.data.meta?.vo_meta_info?.couponRefreshModules) {
        obj.data.meta.vo_meta_info.couponRefreshModules = [];
      }

      // 清理 half_hidden_modules
      if (obj.data.meta?.half_hidden_modules) {
        obj.data.meta.half_hidden_modules = obj.data.meta.half_hidden_modules.filter(
          item => !adModules.includes(item)
        );
      }

      // 去掉地图上的营销动态纹理
      if (obj.data.modules?.poiMapModule?.data?.map?.main_point?.dynamic_texture) {
        delete obj.data.modules.poiMapModule.data.map.main_point.dynamic_texture;
      }
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("高德去广告脚本错误: " + e);
}

$done({ body });
