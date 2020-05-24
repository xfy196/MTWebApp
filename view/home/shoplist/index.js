; (() => {
    const shopItemTemplate = `
    <li class="s-item">
    <div class="logo"><img
            src="{{logoSrc}}"
            alt=""></div>
    <div class="s-info">
        <h3 class="s-i-title">{{title}}</h3>
        <div class="evaluate-sale-time">
            <div class="l-con">
                <div class="stars">
                    <i class="star"></i>
                    <i class="star"></i>
                    <i class="star"></i>
                    <i class="star"></i>
                    <i class="star"></i>
                    <span class="star-num mtsi-num">{{starNum}}</span>
                </div>
                <div class="sale">
                    {{mouthSale}}
                </div>
            </div>
            <div class="r-con">
                <span class="time mtsi-num">{{time}}</span>
                <span class="distance mtsi-num">{{distance}}</span>
            </div>
        </div>
        <div class="distribution-price">
            <div class="l-con">
                <span class="v-line mtsi-num">{{startPrice}}</span><span class="v-line mtsi-num">{{deliveryPrice}}</span><span class="mtsi-num">{{avgPrice}}</span>
            </div>
            <div class="r-con {{isExpress}}">
                <span></span>
            </div>
        </div>
    </div>
</li>
    `;
    let page = 1;
    const count = 20;
    /**
     * 发送请求的函数
     */
    function requestData() {

        new Promise((resolve, reject) => {

            // ajax的请求
            $.ajax({
                url: HOME_SHOPLIST_URL,
                data: {
                    page,
                    count
                },
                method: "get",
                dataType: "json",
                success(data) {
                    resolve(data.data.shopList);
                },
                error(error) {
                    reject(error);
                }
            });

        }).then((data) => {

            // 渲染数据
            let shopItemHTML = "";
            data.forEach(item => {

                shopItemHTML += shopItemTemplate.replace(/\s?{{logoSrc}}/, item.picUrl)
                    .replace(/\s?{{title}}/, item.shopName)
                    .replace(/\s?{{starNum}}/, item.wmPoiScore)
                    .replace(/\s?{{mouthSale}}/, item.monthSalesTip)
                    .replace(/\s?{{time}}/, item.deliveryTimeTip)
                    .replace(/\s?{{distance}}/, item.distance)
                    .replace(/\s?{{startPrice}}/, item.minPriceTip)
                    .replace(/\s?{{deliveryPrice}}/, item.shippingFeeTip)
                    .replace(/\s?{{avgPrice}}/, item.averagePriceTip)
                    .replace(/\s?{{isExpress}}/, item.deliveryTimeTip === 1 ? "isExpress" : "");

            });

            $(".shop_list").append(shopItemHTML);

        }).catch((error) => {

        }).finally(() => {
            PubSub.publish("load-more-end");
        })
    }

    function clickToDetailListener(){

        $(".shop_list").on("click", ".s-item", function(){
            location.href = "./detail.html"
        })
    }
    clickToDetailListener();
    requestData();
    PubSub.subscribe("pull-refresh", () => {
        page = 1;
        requestData();
    })
    PubSub.subscribe("load-more", () => {
        page++;
        requestData();
    });
})($);