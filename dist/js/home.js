"use strict";

;
;

(function () {
  var arrowPath = '../assets/arrow.jpg';
  var loadingPath = '../assets/loading.jpg'; // 是否正在刷新标识符

  var isRefresh = false; // 是否正在加载更多标识

  var isLoadMore = false;
  var myScroll = new IScroll(".scroll-wrap", {
    startY: -40,
    probeType: 3,
    tap: true,
    click: true
  }); // 设置起始位置

  myScroll.scrollTo(0, -40, 0);
  var pullRefreshImg = document.querySelector(".pull-refresh img");
  var pullRefreshText = document.querySelector(".pull-refresh span"); // 监听正在滚动事件

  myScroll.on("scroll", function () {
    // 正在滚动的时候判断是否已经存在之前的滚动了，是的话直接结束滚动
    if (isRefresh) {
      return;
    } // 判断滚动的y值，超过最大值执行刷新，在最小值和最大值我们继续显示


    if (myScroll.y >= 0) {
      pullRefreshImg.className = "down";
      pullRefreshImg.innerText = "释放立即刷新...";
    } else {
      pullRefreshImg.className = "";
      pullRefreshText.innerText = "下拉可以刷新...";
    }
  }); // 滚动结束的监听

  myScroll.on("scrollEnd", function () {
    if (!isRefresh && myScroll.y >= 0) {
      isRefresh = true;
      pullRefreshImg.src = loadingPath;
      pullRefreshImg.className = "active";
      pullRefreshText.innerText = "正在刷新..."; // 刷新的时候我们需要发送ajax请求 模拟一下延迟的效果

      PubSub.publish("pull-refresh");
      setTimeout(function () {
        pullRefreshImg.src = arrowPath;
        pullRefreshImg.className = "";
        pullRefreshText.innerText = "下拉刷新...";
        isRefresh = false;
        myScroll.scrollTo(0, -40, 200);
      }, 1000);
    } else if (myScroll.y > -40 && myScroll.y < 0) {
      myScroll.scrollTo(0, -40, 200);
    }
  }); // 上拉加载

  var loadMoreImg = document.querySelector(".load-more img");
  var loadMoreText = document.querySelector(".load-more span");
  myScroll.on("scroll", function () {
    // 处于上拉加载状态就直接结束
    if (isLoadMore) {
      return;
    }

    var y = myScroll.y;
    var topLine = myScroll.maxScrollY + 40;
    var bottomLine = myScroll.maxScrollY;

    if (y >= topLine) {// 还没有上拉
    } else if (y > bottomLine && y < topLine) {
      // 处于中间的范围
      loadMoreImg.className = "";
      loadMoreText.innerTx = "上拉可以加载更多...";
    } else {
      loadMoreImg.className = "up";
      loadMoreText.innerText = "释放立即加载更多...";
    }
  });
  myScroll.on("scrollEnd", function () {
    var y = myScroll.y;
    var topLine = myScroll.maxScrollY + 40;
    var bottomLine = myScroll.maxScrollY;

    if (y >= topLine) {// 正常的滚动范围什么都不用干
    } else if (y > bottomLine && y < topLine) {
      myScroll.scrollTo(0, topLine, 200);
    } else if (y <= bottomLine && !isLoadMore) {
      isLoadMore = true;
      loadMoreImg.src = loadMoreImg;
      loadMoreImg.className = "active";
      loadMoreText.innerText = "正在加载..."; // 发布功能

      PubSub.publish("load-more");
    }
  }); // 下拉加载更多订阅功能

  PubSub.subscribe("load-more-end", function () {
    loadMoreImg.src = arrowPath;
    loadMoreImg.className = "";
    loadMoreText.innerText = "上拉加载更多...";
    isLoadMore = false;
  });
  myScroll.on("beforeScrollStart", function () {
    myScroll.refresh();
  });
})();

;
;

(function () {
  // icon 放置地址的前缀
  var iconPrefix = "../assets/"; // 页面的后缀

  var pageSuffix = ".html"; // tab item的模板

  var tabItemTemplate = "\n    <a href=\"./{{href}}".concat(pageSuffix, "\" class=\"tab-item {{isActive}}\">\n        <img src=\"").concat(iconPrefix, "{{icon}}{{activeIcon}}.png\" alt=\"\">\n        <span>{{name}}</span>\n    </a>\n    ");
  var tabData = [{
    id: "home",
    name: "首页",
    icon: "tab-home",
    href: "home"
  }, {
    id: "order",
    name: "订单",
    icon: "tab-order",
    href: "order"
  }, {
    id: "mine",
    name: "我的",
    icon: "tab-mine",
    href: "mine"
  }]; // 将tabitem的数据和模板结合渲染到页面之中

  var tabItemDom = '';
  tabData.forEach(function (item) {
    var tabItem = tabItemTemplate; // 获取当前地址滥觞的地址是否和数据中id对应这是为了切换页面加入active的效果

    var currentPathName = window.location.pathname.split("/").pop().split(".")[0];
    tabItem = tabItem.replace(/\s?{{isActive}}/, currentPathName === item.id ? " active" : "").replace(/{{href}}/, item.href).replace(/{{icon}}/, item.icon).replace(/{{activeIcon}}/, currentPathName === item.id ? "-a" : "").replace(/{{name}}/, item.name);
    tabItemDom += tabItem;
  });
  document.querySelector(".tabs").innerHTML = tabItemDom;
})();

;
;

(function ($) {
  // 创建模板
  var cateTemplate = "\n    <div class=\"item\">\n        <img src=\"{{src}}\" alt=\"\"/>\n        <span>{{name}}</span>\n    </div>\n    ";

  function requestData() {
    // 发送请求获取数据
    new Promise(function (resolve, reject) {
      $.ajax({
        url: HOME_CATE_URL,
        dataType: "json",
        method: "get",
        success: function success(data) {
          resolve(data.data.kingkongList);
        },
        error: function error(_error) {
          reject(_error);
        }
      });
    }).then(function (data) {
      // 成功拿到数据之后我们去渲染模板，然后显示在页面之中
      var arr = data.map(function (item) {
        return cateTemplate.replace(/\s?{{src}}/, item.icon).replace(/\s?{{name}}/, item.name);
      }); // 所有的cate的数组数据，然后我们需要将每十个作为一页的数据进行分组

      var cate_in_ten_group_arr = [];

      while (arr.length > 0) {
        cate_in_ten_group_arr.push(arr.splice(0, 10));
      } // 分组之后呢我们需要将这些数据渲染到页面之中


      var swiperHTML = '';
      cate_in_ten_group_arr.forEach(function (list) {
        swiperHTML += "\n            <div class=\"swiper-slide\">".concat(list.join(""), "</div>\n            ");
      });
      $(".banner .swiper-wrapper").html(swiperHTML);
      new Swiper(".banner", {
        // 如果需要分页器
        pagination: '.swiper-pagination'
      });
    })["catch"](function (error) {
      console.log(error);
    })["finally"](function () {});
  } // 调用请求cate数据的方法


  requestData();
  PubSub.subscribe("pull-refresh", requestData);
})($);

;

(function () {
  var shopItemTemplate = "\n    <li class=\"s-item\">\n    <div class=\"logo\"><img\n            src=\"{{logoSrc}}\"\n            alt=\"\"></div>\n    <div class=\"s-info\">\n        <h3 class=\"s-i-title\">{{title}}</h3>\n        <div class=\"evaluate-sale-time\">\n            <div class=\"l-con\">\n                <div class=\"stars\">\n                    <i class=\"star\"></i>\n                    <i class=\"star\"></i>\n                    <i class=\"star\"></i>\n                    <i class=\"star\"></i>\n                    <i class=\"star\"></i>\n                    <span class=\"star-num mtsi-num\">{{starNum}}</span>\n                </div>\n                <div class=\"sale\">\n                    {{mouthSale}}\n                </div>\n            </div>\n            <div class=\"r-con\">\n                <span class=\"time mtsi-num\">{{time}}</span>\n                <span class=\"distance mtsi-num\">{{distance}}</span>\n            </div>\n        </div>\n        <div class=\"distribution-price\">\n            <div class=\"l-con\">\n                <span class=\"v-line mtsi-num\">{{startPrice}}</span><span class=\"v-line mtsi-num\">{{deliveryPrice}}</span><span class=\"mtsi-num\">{{avgPrice}}</span>\n            </div>\n            <div class=\"r-con {{isExpress}}\">\n                <span></span>\n            </div>\n        </div>\n    </div>\n</li>\n    ";
  var page = 1;
  var count = 20;
  /**
   * 发送请求的函数
   */

  function requestData() {
    new Promise(function (resolve, reject) {
      // ajax的请求
      $.ajax({
        url: HOME_SHOPLIST_URL,
        data: {
          page: page,
          count: count
        },
        method: "get",
        dataType: "json",
        success: function success(data) {
          resolve(data.data.shopList);
        },
        error: function error(_error2) {
          reject(_error2);
        }
      });
    }).then(function (data) {
      // 渲染数据
      var shopItemHTML = "";
      data.forEach(function (item) {
        shopItemHTML += shopItemTemplate.replace(/\s?{{logoSrc}}/, item.picUrl).replace(/\s?{{title}}/, item.shopName).replace(/\s?{{starNum}}/, item.wmPoiScore).replace(/\s?{{mouthSale}}/, item.monthSalesTip).replace(/\s?{{time}}/, item.deliveryTimeTip).replace(/\s?{{distance}}/, item.distance).replace(/\s?{{startPrice}}/, item.minPriceTip).replace(/\s?{{deliveryPrice}}/, item.shippingFeeTip).replace(/\s?{{avgPrice}}/, item.averagePriceTip).replace(/\s?{{isExpress}}/, item.deliveryTimeTip === 1 ? "isExpress" : "");
      });
      $(".shop_list").append(shopItemHTML);
    })["catch"](function (error) {})["finally"](function () {
      PubSub.publish("load-more-end");
    });
  }

  function clickToDetailListener() {
    $(".shop_list").on("click", ".s-item", function () {
      location.href = "./detail.html";
    });
  }

  clickToDetailListener();
  requestData();
  PubSub.subscribe("pull-refresh", function () {
    page = 1;
    requestData();
  });
  PubSub.subscribe("load-more", function () {
    page++;
    requestData();
  });
})($);