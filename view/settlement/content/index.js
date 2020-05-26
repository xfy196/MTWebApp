;; (() => {

    let shopListTemplate = `
    <div class="o-s-item">
    <img src="{{shopPic}}" alt="">
    <div class="i-shop">
        <div class="s-name-price">
            <span class="s-name">{{shopName}}</span>
            <span class="s-price">¥{{price}}</span>
        </div>
        <div class="s-unit"><span>{{unit}}</span></div>
        <div class="s-num">x{{num}}</div>
    </div>
</div>
    `;


    /**
     * 渲染商品列表数据
     */
    function renderShopList() {
        let shopListHTML = "";
        let shopListData = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : {};
        let shopList = shopListData.shopList;
        for (let item in shopList)
        // console.log(shopList[item]);
            shopListHTML += shopListTemplate.replace(/{{shopPic}}/, shopList[item].shopPic)
                .replace(/{{shopName}}/, shopList[item].shopName)
                .replace(/{{price}}/, shopList[item].price)
                .replace(/{{unit}}/, shopList[item].unit)
                .replace(/{{num}}/, shopList[item].num);
        $(".orderShops").html(shopListHTML);
        $(".shopName").html(shopListData.shopInfo.shopName);
        $(".d-price").html("¥"+shopListData.shopInfo.deliveryFee);
        let totalPrice = parseFloat(shopListData.shopInfo.deliveryFee + Number(shopListData.totalPrice)).toFixed(1);
        $(".totalFee .f-all").html("共计¥"+totalPrice);
        $(".totalFee .f-num").html("¥"+totalPrice);
        $(".totalPrice i").html("¥"+totalPrice)
    }
    $(() => {
        renderShopList();
    });
})();