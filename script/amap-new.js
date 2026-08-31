
const url = $request.url;
let body = $response.body;

/**
 * 高德打车 content_info 去皮肤 + 过滤金刚位
 * 保留：出境用车、顺风车、高德拼车、代驾
 */
if (url.includes("/car/order/content_info")) {
try {
  let obj = JSON.parse(body);

  if (obj?.data?.lubanData) {
    // 清空营销皮肤
    if (obj.data.lubanData.skin?.dataList) {
      obj.data.lubanData.skin.dataList = [];
    }

    // 过滤金刚位工具箱
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

  body = JSON.stringify(obj);
} catch (e) {
  console.log("解析失败: " + e);
}
}

$done({ body });
