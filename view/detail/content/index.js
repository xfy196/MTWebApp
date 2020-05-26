;; (() => {

    let carListTemplate = `
    <li class="c-item border-bottom">
        <div class="s-name-price">
            <div class="c-l-info">
                <span class="i-name">{{shopName}}</span>
                <span class="i-unit">{{unit}}</span>
            </div>
            <div class="c-price">¥{{price}}</div>
        </div>
        <div class="c-price-operation">
            <span class="o-sub o-btn"></span>
            <span>{{num}}</span>
            <span class="o-add o-btn"></span>
        </div>
    </li>
    `;

    // 商品数据
    let shopObjArr = null;

    let totalPrice = 0;
    /**
     * 切换tab选项卡的函数
     */
    function switchTab() {
        $(".orders-tabs").on("click", ".tab", function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(".content>div").css({
                "transform": `translateX(-${$(this).index() * 100}%)`
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

        let fItemOffset = [];
        $(".foods .f-item").offset((index, oldOffset) => {
            fItemOffset.push(oldOffset.top - 300);
            return true;
        });
        let navItemList = $(".left-list a");
        let myScroll = new IScroll('.scroll-wrapper', {
            probeType: 3,
            tap: true,
            click: true,
            disablePointer: true,
            disableTouch: false,
            disableMouse: true,
            bounce: false
        });
        myScroll.on("scroll", () => {

        });
        myScroll.on("scrollEnd", () => {
            let absScrollY = Math.abs(myScroll.y);
            for (let i = 0; i < fItemOffset.length - 1; i++) {
                if (fItemOffset[i] < absScrollY && fItemOffset[i + 1] > absScrollY) {
                    $(navItemList[i]).addClass("active").siblings().removeClass("active");
                    return false;
                }
            }
        });
        navItemList.on("click", function () {
            let top = fItemOffset[$(this).index()] + 110;
            myScroll.scrollTo(0, -top, 400);
        })

    }

    /**
     * 购物车功能
     */
    function operationCar() {

        /**
         * 添加按钮绑定事件
         */
        $(".foods").on("click", ".add", function () {
            let parent = $(this).parents(".cate-food");
            if ($(this).siblings().hasClass("sub")) {
                let prevDom = $(this).prev();
                let text = Number(prevDom.text());
                prevDom.text(text + 1);

            } else {
                $(`<button class="sub"></button><span class="f-num">1</span>`).insertBefore($(this));
            }
            let shopName = parent.find("h4").text();
            let num = Number($(this).prev().text());
            let shopPic = parent.find(".f-img img").prop("src");
            let price = Number(parent.find(".price span").eq(1).text());
            let tag = parent.attr("data-spuId");
            let unit = parent.find(".p-num").text().slice(1);
            let obj = {};
            obj.shopName = shopName;
            obj.num = num;
            obj.shopPic = shopPic;
            obj.price = price;
            obj.unit = unit;
            syncCarData(tag, obj)

        });

        /**
         * 减号绑定事件
         */
        $(".foods").on("click", ".sub", function () {
            let parent = $(this).parents(".cate-food");

            let nextDom = $(this).next();
            if (nextDom.text() > 1) {
                nextDom.text(Number(nextDom.text()) - 1);
            } else {
                $(this).next().remove();
                $(this).remove();
            }
            let shopName = parent.find("h4").text();
            let num = Number($(this).next().text());
            let shopPic = parent.find(".f-img img").prop("src");
            let price = Number(parent.find(".price span").eq(1).text());
            let tag = parent.attr("data-spuId");
            let unit = parent.find(".p-num").text().slice(1);
            let obj = {};
            obj.shopName = shopName;
            obj.num = num;
            obj.shopPic = shopPic;
            obj.price = price;
            obj.unit = unit;
            syncCarData(tag, obj)
        });

        $(".main").on("click", ".car-pic.hasShop", function () {
            $(".all-shop").css({
                transform: "translateY(0%)"
            });
        })
        $(".main").on("click", ".scroll-wrapper", () => {
            $(".all-shop").css({
                transform: "translateY(100%)"
            });
        });
        $(".clearCar").on("click", () => {
            // 移除购物车的数据
            localStorage.removeItem("shopCars");
            $(".cars-list").html("");
            $(".cate-food .add").siblings().remove();
            // 重新价格弹出的商品列表数据回收下去
            $(".all-shop").css({
                transform: "translateY(100%)"
            });
            // 购物车显示状态变为无商品状态
            $(".show-car.hasShop").hide().siblings(".show-car").show();
            // 满足起送加状态隐藏
            $(".isDeliveryTitle").hide();
        });

        $("#settlementBtn").on("click", () => {
            let orderObj = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : {};

            orderObj.totalPrice = totalPrice;
            orderObj.shopList = shopObjArr;
            localStorage.setItem("order", JSON.stringify(orderObj));
            // 发布订阅者的函数
            PubSub.publish("settlementFn");
            location.href = "../views/settlement.html";
        })
    }


    /**
     * 同步购物车中的数据的
     * @param {*} tag 
     * @param {*} obj 
     */
    function syncCarData(tag = 0, obj = {}) {
        shopObjArr = localStorage.getItem("shopCars") === null ? {} : JSON.parse(localStorage.getItem("shopCars"));

        if (obj.num === 0) {
            delete shopObjArr[tag];
        } else {

            shopObjArr[tag] = obj;
        }
        localStorage.setItem("shopCars", JSON.stringify(shopObjArr));
        // 说明购物车中有数据我们需要改变底部的购物车样式
        let hasShopDom = $(".show-car.hasShop");
        if (Object.keys(shopObjArr).length !== 0) {
            let discountPrice = 0;
            // 计算商品的总价格
            Object.entries(shopObjArr).forEach(([key, val]) => {
                totalPrice += val.num * val.price;
            });
            totalPrice = parseFloat(totalPrice).toFixed(1);
            discountPrice = parseFloat(totalPrice * 0.8).toFixed(1);
            hasShopDom.show().siblings(".show-car").hide();
            $(".isDeliveryTitle").show();
            hasShopDom.find(".num").text(Object.keys(shopObjArr).length);
            hasShopDom.find(".price .nowPrice span").eq(1).text(totalPrice);
            hasShopDom.find(".price .discount").text(discountPrice);
            // 渲染数据
            renderCarList();
        } else {
            hasShopDom.hide().siblings(".show-car").show();
        }
    }

    /**
     * 渲染购物车列表数据
     */
    function renderCarList() {
        let carListHTML = "";
        let shopObjArr = localStorage.getItem("shopCars") === null ? {} : JSON.parse(localStorage.getItem("shopCars"));
        Object.entries(shopObjArr).forEach(([key, val]) => {
            carListHTML += carListTemplate.replace(/{{shopName}}/, val.shopName)
                .replace(/{{unit}}/, val.unit).replace(/{{price}}/, val.price)
                .replace(/{{num}}/, val.num);
        });
        $(".cars-list").html(carListHTML);
    }


    // 订阅功能等待页面数据加载完成之后执行这个函数
    PubSub.subscribe("contentScroll", () => {
        operationCar();
        contentScroll();
    });
    switchTab();
})();