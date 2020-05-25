"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

;
;

(function () {
  var userPicUrl = "https://s3plus.sankuai.com/v1/mss_00c90c47614241978d32cca9bc6e44a4/h5i/userpic_defalut.c741e924.png";
  var commentsTemplate = "\n    <div class=\"score-wrap\">\n        <div class=\"score\">\n            <span>{{shopScore}}</span>\n            <div>\u5546\u5BB6\u8BC4\u5206</div>\n        </div>\n        <div class=\"stars\">\n            <div class=\"flavor-stars\">\n                <span class=\"f-txt\">\u53E3\u5473</span>\n                <div class=\"f-star\">\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                </div>\n                <span class=\"f-score\">{{qualityScore}}</span>\n            </div>\n            <div class=\"packing-stars\">\n                <span class=\"p-txt\">\u5305\u88C5</span>\n                <div class=\"p-star\">\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                    <i class=\"star-icon\"></i>\n                </div>\n                <span class=\"f-score\">{{packScore}}</span>\n            </div>\n        </div>\n        <div class=\"distribution-score\">\n            <span class=\"d-score\">{{deliveryScore}}</span>\n            <span class=\"d-txt\">\u914D\u9001\u8BC4\u5206</span>\n        </div>\n    </div>\n    <div class=\"c-cate border-bottom\">\n        {{commentCates}}\n    </div>\n    <div class=\"c-content\">\n        <ul class=\"comment-list\">\n            {{commentList}}\n        </ul>\n    </div>\n    ";
  var commentCatesTemplate = "\n    <span class=\"{{isSelected}} border\">{{content}}</span>\n    ";
  var commentListTemplate = "\n    <li class=\"c-item border-bottom\">\n        <div class=\"u-pic\">\n            <img src=\"{{userPicUrl}}\"\n                alt=\"\">\n        </div>\n        <div class=\"c-info\">\n            <div class=\"nickname-time\">\n                <span class=\"nickname\">{{userName}}</span>\n                <span class=\"time\">{{commentTime}}</span>\n            </div>\n            <div class=\"arrival-time\">{{deliveryTime}}</div>\n            <div class=\"c-txt\">{{content}}</div>\n            <div class=\"order-type\">\n                <i class=\"f-icon\"></i>\n                <span class=\"o-type\">{{praiseDish}}</span>\n            </div>\n        </div>\n    </li>\n    ";

  function requestData() {
    new Promise(function (resolve, reject) {
      $.ajax({
        url: DETAIL_COMMENT_URL,
        method: "get",
        dataType: "json",
        success: function success(data) {
          console.log(data);
          handleCommentData(data.data);
        },
        error: function error(_error) {
          reject(_error);
        }
      });
    }).then(function (data) {
      console.log(data);
    })["catch"](function (error) {});
  }
  /**
   * 处理评论的数据的函数
   * @param {*} data 
   */


  function handleCommentData(data) {
    var commentCatesHTML = "";
    data.commentLabels.forEach(function (item) {
      commentCatesHTML += commentCatesTemplate.replace(/{{isSelected}}/, item.isSelected === 1 ? "active" : "").replace(/{{content}}/, item.content);
    });
    var commentListHTML = "";
    data.list.forEach(function (item) {
      commentListHTML += commentListTemplate.replace(/{{userPicUrl}}/, item.userPicUrl === "" ? userPicUrl : item.userPicUrl).replace(/{{userName}}/, item.userName).replace(/{{commentTime}}/, item.commentTime).replace(/{{deliveryTime}}/, item.deliveryTime).replace(/{{content}}/, item.content).replace(/{{praiseDish}}/, item.praiseDish);
    });
    var commentsHTML = commentsTemplate.replace(/{{shopScore}}/, data.shopScore).replace(/{{qualityScore}}/, data.qualityScore).replace(/{{packScore}}/, data.packScore).replace(/{{deliveryScore}}/, data.deliveryScore).replace(/{{commentCates}}/, commentCatesHTML).replace(/{{commentList}}/, commentListHTML);
    $(".comments").html(commentsHTML);
  } // 订阅评论数据请求完成


  PubSub.subscribe("commentRequest", function () {
    requestData();
  });
})();

;
;

(function () {
  var carListTemplate = "\n    <li class=\"c-item border-bottom\">\n        <div class=\"s-name-price\">\n            <div class=\"c-l-info\">\n                <span class=\"i-name\">{{shopName}}</span>\n                <span class=\"i-unit\">{{unit}}</span>\n            </div>\n            <div class=\"c-price\">\xA5{{price}}</div>\n        </div>\n        <div class=\"c-price-operation\">\n            <span class=\"o-sub o-btn\"></span>\n            <span>{{num}}</span>\n            <span class=\"o-add o-btn\"></span>\n        </div>\n    </li>\n    ";
  /**
   * 切换tab选项卡的函数
   */

  function switchTab() {
    $(".orders-tabs").on("click", ".tab", function () {
      $(this).addClass("active").siblings().removeClass("active");
      $(".content>div").css({
        "transform": "translateX(-".concat($(this).index() * 100, "%)")
      });

      if ($(this).hasClass("comment-tab")) {
        PubSub.publish("commentRequest");
      }
    });
  }
  /**
   * 商品内容区域滚动
   */


  function contentScroll() {
    var fItemOffset = [];
    $(".foods .f-item").offset(function (index, oldOffset) {
      fItemOffset.push(oldOffset.top - 300);
      return true;
    });
    var navItemList = $(".left-list a");
    var myScroll = new IScroll('.scroll-wrapper', {
      probeType: 3,
      tap: true,
      click: true,
      disablePointer: true,
      disableTouch: false,
      disableMouse: true,
      bounce: false
    });
    myScroll.on("scroll", function () {});
    myScroll.on("scrollEnd", function () {
      var absScrollY = Math.abs(myScroll.y);

      for (var i = 0; i < fItemOffset.length - 1; i++) {
        if (fItemOffset[i] < absScrollY && fItemOffset[i + 1] > absScrollY) {
          $(navItemList[i]).addClass("active").siblings().removeClass("active");
          return false;
        }
      }
    });
    navItemList.on("click", function () {
      var top = fItemOffset[$(this).index()] + 110;
      myScroll.scrollTo(0, -top, 400);
    });
  }
  /**
   * 购物车功能
   */


  function operationCar() {
    /**
     * 添加按钮绑定事件
     */
    $(".foods").on("click", ".add", function () {
      var parent = $(this).parents(".cate-food");

      if ($(this).siblings().hasClass("sub")) {
        var prevDom = $(this).prev();
        var text = Number(prevDom.text());
        prevDom.text(text + 1);
      } else {
        $("<button class=\"sub\"></button><span class=\"f-num\">1</span>").insertBefore($(this));
      }

      var shopName = parent.find("h4").text();
      var num = Number($(this).prev().text());
      var shopPic = parent.find(".f-img img").prop("src");
      var price = Number(parent.find(".price span").eq(1).text());
      var tag = parent.attr("data-spuId");
      var unit = parent.find(".p-num").text().slice(1);
      var obj = {};
      obj.shopName = shopName;
      obj.num = num;
      obj.shopPic = shopPic;
      obj.price = price;
      obj.unit = unit;
      syncCarData(tag, obj);
    });
    /**
     * 减号绑定事件
     */

    $(".foods").on("click", ".sub", function () {
      var parent = $(this).parents(".cate-food");
      var nextDom = $(this).next();

      if (nextDom.text() > 1) {
        nextDom.text(Number(nextDom.text()) - 1);
      } else {
        $(this).next().remove();
        $(this).remove();
      }

      var shopName = parent.find("h4").text();
      var num = Number($(this).next().text());
      var shopPic = parent.find(".f-img img").prop("src");
      var price = Number(parent.find(".price span").eq(1).text());
      var tag = parent.attr("data-spuId");
      var unit = parent.find(".p-num").text().slice(1);
      var obj = {};
      console.log(num);
      obj.shopName = shopName;
      obj.num = num;
      obj.shopPic = shopPic;
      obj.price = price;
      obj.unit = unit;
      syncCarData(tag, obj);
    });
    $(".main").on("click", ".car-pic.hasShop", function () {
      $(".all-shop").css({
        transform: "translateY(0%)"
      });
    });
    $(".main").on("click", ".scroll-wrapper", function () {
      $(".all-shop").css({
        transform: "translateY(100%)"
      });
    });
    $(".clearCar").on("click", function () {
      // 移除购物车的数据
      localStorage.removeItem("shopCars");
      $(".cars-list").html("");
      $(".cate-food .add").siblings().remove(); // 重新价格弹出的商品列表数据回收下去

      $(".all-shop").css({
        transform: "translateY(100%)"
      }); // 购物车显示状态变为无商品状态

      $(".show-car.hasShop").hide().siblings(".show-car").show(); // 满足起送加状态隐藏

      $(".isDeliveryTitle").hide();
    });
    $("#settlementBtn").on("click", function () {
      location.href = "../views/settlement.html";
    });
  }
  /**
   * 同步购物车中的数据的
   * @param {*} tag 
   * @param {*} obj 
   */


  function syncCarData() {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var shopObjArr = localStorage.getItem("shopCars") === null ? {} : JSON.parse(localStorage.getItem("shopCars"));
    console.log(shopObjArr);

    if (obj.num === 0) {
      delete shopObjArr[tag];
    } else {
      shopObjArr[tag] = obj;
    }

    localStorage.setItem("shopCars", JSON.stringify(shopObjArr)); // 说明购物车中有数据我们需要改变底部的购物车样式

    var hasShopDom = $(".show-car.hasShop");

    if (Object.keys(shopObjArr).length !== 0) {
      var totalPrice = 0;
      var discountPrice = 0; // 计算商品的总价格

      Object.entries(shopObjArr).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];

        totalPrice += val.num * val.price;
      });
      discountPrice = parseFloat(totalPrice * 0.8).toFixed(1);
      hasShopDom.show().siblings(".show-car").hide();
      $(".isDeliveryTitle").show();
      hasShopDom.find(".num").text(Object.keys(shopObjArr).length);
      hasShopDom.find(".price .nowPrice span").eq(1).text(totalPrice);
      hasShopDom.find(".price .discount").text(discountPrice); // 渲染数据

      renderCarList();
    } else {
      hasShopDom.hide().siblings(".show-car").show();
    }
  }
  /**
   * 渲染购物车列表数据
   */


  function renderCarList() {
    var carListHTML = "";
    var shopObjArr = localStorage.getItem("shopCars") === null ? {} : JSON.parse(localStorage.getItem("shopCars"));
    Object.entries(shopObjArr).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          val = _ref4[1];

      carListHTML += carListTemplate.replace(/{{shopName}}/, val.shopName).replace(/{{unit}}/, val.unit).replace(/{{price}}/, val.price).replace(/{{num}}/, val.num);
    });
    $(".cars-list").html(carListHTML);
  } // 订阅功能等待页面数据加载完成之后执行这个函数


  PubSub.subscribe("contentScroll", function () {
    operationCar();
    contentScroll();
  });
  switchTab();
})();

;
;

(function () {
  // 头部模板
  var headerTemplate = "\n    <div class=\"business-info\">\n        <div class=\"business-img\" style=\"background-image: url({{shopImg}})\"></div>\n        <div class=\"info\">\n            <div class=\"i-distance\">\n                <span class=\"time mtsi-num\">{{deliveryTimeDecoded}}\u5206\u949F</span><span class=\"distance\">{{distance}}</span>\n            </div>\n            <div class=\"i-notice\">\n                \u516C\u544A\uFF1A\u6B22\u8FCE\u5149\u4E34\u80AF\u5FB7\u57FA\u5B85\u6025\u9001\uFF0C\u4E13\u4E1A\u5916\u9001\uFF0C\u5168\u7A0B\u4FDD\u6E29\uFF0C\u51C6\u65F6\u9001\u8FBE\uFF01\n            </div>\n        </div>\n    </div>\n    ";
  var categoryListTemplate = "\n    <a href=\"javascript:void(0)\" class=\"{{isActive}}\" data-tag=\"{{tag}}\">\n        <div class=\"food-cate\">\n            <span class=\"cate-txt\">{{isImg}}{{categoryName}}</span>\n        </div>\n    </a>\n    ";
  var foodListTemplate = "\n    <dd class=\"cate-food\" data-spuId={{spuId}}>\n        <div class=\"f-img\"><img\n                src=\"{{bigImageUrl}}\"\n                alt=\"\"></div>\n        <div class=\"f-detail\">\n            <h4>{{spuName}}</h4>\n            <p>{{spuDesc}}</p>\n            <div class=\"fabulous-mSales\"><span>\u6708\u552E{{saleVolumeDecoded}}</span><span>\u8D5E1</span></div>\n            <div class=\"price-add\">\n                <div class=\"price\">\n                    <span>\xA5</span><span>{{currentPrice}}</span><span class=\"p-num\">/{{unit}}</span>\n                </div>\n                <div class=\"carOpr\"><button class=\"add\"></button></div>\n            </div>\n        </div>\n    </dd>\n    "; // 商品列表

  var supListTemplate = "\n    <dl class=\"f-item\" name=\"cate-{{index}}\">\n        <dt class=\"f-title\">{{categoryName}}</dt>\n        {{foodList}}\n    </dl>\n    ";
  /**
   * 点击返回安牛逼返回上一页面的
   */

  function goBack() {
    $(".return").on("click", function () {
      location.href = "../views/home.html";
    });
  }

  function requestData() {
    new Promise(function (resolve, reject) {
      $.ajax({
        url: DETAIL_SHOPINFO_URL,
        method: "get",
        dataType: "json",
        success: function success(data) {
          console.log(data);
          resolve(data.data);
        },
        error: function error() {
          reject("请求失败");
        }
      });
    }).then(function (data) {
      handleHeaderDom(data.shopInfo);
      handleCategoriesDom(data.categoryList);
    })["catch"](function (error) {
      console.log(error);
    })["finally"](function () {
      PubSub.publish("contentScroll");
    });
  }
  /**
   * 处理头部html代码
   */


  function handleHeaderDom(data) {
    var headerHtml = headerTemplate.replace(/{{shopImg}}/, data.shopPic).replace(/{{deliveryTimeDecoded}}/, data.deliveryTimeDecoded).replace(/{{distance}}/, data.distance);
    $("header").append(headerHtml);
  }
  /**
   * 处理分类的函数
   * @param {*} data 
   */


  function handleCategoriesDom(data) {
    var cateListHTML = "";
    var foodListHTML = "";
    var supListHTML = "";
    data.forEach(function (item, index) {
      cateListHTML += categoryListTemplate.replace(/{{isActive}}/, index === 0 ? "active" : "").replace(/{{tag}}/, item.tag).replace(/{{isImg}}/, item.iconUrl !== '' ? "<img src=\"".concat(item.iconUrl, "\" alt=\"\"/>") : "").replace(/{{categoryName}}/, item.categoryName);
      item.spuList.forEach(function (item) {
        foodListHTML += foodListTemplate.replace(/{{bigImageUrl}}/, item.bigImageUrl).replace(/{{spuName}}/, item.spuName).replace(/{{spuDesc}}/, item.spuDesc).replace(/{{saleVolumeDecoded}}/, item.saleVolumeDecoded).replace(/{{currentPrice}}/, item.currentPrice).replace(/{{unit}}/, item.unit).replace(/{{spuId}}/, item.spuId);
      });
      supListHTML += supListTemplate.replace(/{{categoryName}}/, item.categoryName).replace(/{{foodList}}/, foodListHTML).replace(/{{index}}/, index);
      foodListHTML = "";
    });
    $(".left-list").html(cateListHTML);
    $(".foods").html(supListHTML);
  }

  goBack();
  requestData();
})();