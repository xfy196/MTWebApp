"use strict";

;
;

(function () {
  var shopListTemplate = "\n    <div class=\"o-s-item\">\n    <img src=\"{{shopPic}}\" alt=\"\">\n    <div class=\"i-shop\">\n        <div class=\"s-name-price\">\n            <span class=\"s-name\">{{shopName}}</span>\n            <span class=\"s-price\">\xA5{{price}}</span>\n        </div>\n        <div class=\"s-unit\"><span>{{unit}}</span></div>\n        <div class=\"s-num\">x{{num}}</div>\n    </div>\n</div>\n    ";
  /**
   * 渲染商品列表数据
   */

  function renderShopList() {
    var shopListHTML = "";
    var shopListData = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : {};
    var shopList = shopListData.shopList;

    for (var item in shopList) {
      // console.log(shopList[item]);
      shopListHTML += shopListTemplate.replace(/{{shopPic}}/, shopList[item].shopPic).replace(/{{shopName}}/, shopList[item].shopName).replace(/{{price}}/, shopList[item].price).replace(/{{unit}}/, shopList[item].unit).replace(/{{num}}/, shopList[item].num);
    }

    $(".orderShops").html(shopListHTML);
    $(".shopName").html(shopListData.shopInfo.shopName);
    $(".d-price").html("¥" + shopListData.shopInfo.deliveryFee);
    var totalPrice = parseFloat(shopListData.shopInfo.deliveryFee + Number(shopListData.totalPrice)).toFixed(1);
    $(".totalFee .f-all").html("共计¥" + totalPrice);
    $(".totalFee .f-num").html("¥" + totalPrice);
    $(".totalPrice i").html("¥" + totalPrice);
  }

  $(function () {
    renderShopList();
  });
})();

;
;

(function () {
  /**
   * 返回上一页面
   */
  function backToPage() {
    $(".header i").on("click", function () {
      history.go(-1);
    });
  }
  /**
   * 处理发票切换的事件
   */


  function handleInvoiceSwitching() {
    $(".invoice input").on("click", function () {
      $(".invoice-input").toggle();
    });
  }

  handleInvoiceSwitching();
  backToPage();
})();