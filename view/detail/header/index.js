;; (() => {
    // 头部模板
    let headerTemplate = `
    <div class="business-info">
        <div class="business-img" style="background-image: url({{shopImg}})"></div>
        <div class="info">
            <div class="i-distance">
                <span class="time mtsi-num">{{deliveryTimeDecoded}}分钟</span><span class="distance">{{distance}}</span>
            </div>
            <div class="i-notice">
                公告：欢迎光临肯德基宅急送，专业外送，全程保温，准时送达！
            </div>
        </div>
    </div>
    `;

    let categoryListTemplate = `
    <a href="javascript:void(0)" class="{{isActive}}" data-tag="{{tag}}">
        <div class="food-cate">
            <span class="cate-txt">{{isImg}}{{categoryName}}</span>
        </div>
    </a>
    `;

    let foodListTemplate = `
    <dd class="cate-food" data-spuId={{spuId}}>
        <div class="f-img"><img
                src="{{bigImageUrl}}"
                alt=""></div>
        <div class="f-detail">
            <h4>{{spuName}}</h4>
            <p>{{spuDesc}}</p>
            <div class="fabulous-mSales"><span>月售{{saleVolumeDecoded}}</span><span>赞1</span></div>
            <div class="price-add">
                <div class="price">
                    <span>¥</span><span>{{currentPrice}}</span><span class="p-num">/{{unit}}</span>
                </div>
                <div class="carOpr"><button class="add"></button></div>
            </div>
        </div>
    </dd>
    `;
    // 商品列表
    let supListTemplate = `
    <dl class="f-item" name="cate-{{index}}">
        <dt class="f-title">{{categoryName}}</dt>
        {{foodList}}
    </dl>
    `;



    /**
     * 点击返回安牛逼返回上一页面的
     */
    function goBack() {

        $(".return").on("click", function () {
            location.href = "../views/home.html";
        });
    }

    function requestData() {

        new Promise((resolve, reject) => {
            $.ajax({
                url: DETAIL_SHOPINFO_URL,
                method: "get",
                dataType: "json",
                success(data) {
                    console.log(data);
                    resolve(data.data);
                },
                error() {
                    reject("请求失败");
                }
            })
        }).then((data) => {
            handleHeaderDom(data.shopInfo);
            handleCategoriesDom(data.categoryList);
            PubSub.subscribe("settlementFn", () => {
                let orderObj = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : {};
                orderObj.shopInfo = data.shopInfo;
                localStorage.setItem("order", JSON.stringify(orderObj));
            })

        }).catch(error => {
            console.log(error);
        }).finally(() => {
            PubSub.publish("contentScroll");

        })
    }

    /**
     * 处理头部html代码
     */
    function handleHeaderDom(data) {
        let headerHtml = headerTemplate.replace(/{{shopImg}}/, data.shopPic)
            .replace(/{{deliveryTimeDecoded}}/, data.deliveryTimeDecoded)
            .replace(/{{distance}}/, data.distance);
        $("header").append(headerHtml);
    }

    /**
     * 处理分类的函数
     * @param {*} data 
     */
    function handleCategoriesDom(data) {
        let cateListHTML = "";
        let foodListHTML = "";
        let supListHTML = "";
        data.forEach((item, index) => {
            cateListHTML += categoryListTemplate.replace(/{{isActive}}/, index === 0 ? "active" : "").replace(/{{tag}}/, item.tag)
                .replace(/{{isImg}}/, item.iconUrl !== '' ? `<img src="${item.iconUrl}" alt=""/>` : "")
                .replace(/{{categoryName}}/, item.categoryName);
            item.spuList.forEach((item) => {
                foodListHTML += foodListTemplate.replace(/{{bigImageUrl}}/, item.bigImageUrl)
                    .replace(/{{spuName}}/, item.spuName).replace(/{{spuDesc}}/, item.spuDesc)
                    .replace(/{{saleVolumeDecoded}}/, item.saleVolumeDecoded).replace(/{{currentPrice}}/, item.currentPrice)
                    .replace(/{{unit}}/, item.unit).replace(/{{spuId}}/, item.spuId);
            });
            supListHTML += supListTemplate.replace(/{{categoryName}}/, item.categoryName)
                .replace(/{{foodList}}/, foodListHTML).replace(/{{index}}/, index);
            foodListHTML = "";
        });
        $(".left-list").html(cateListHTML);
        $(".foods").html(supListHTML);
    }
    goBack();
    requestData();
})();