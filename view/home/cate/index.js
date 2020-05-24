;; (function ($) {

    // 创建模板
    const cateTemplate = `
    <div class="item">
        <img src="{{src}}" alt=""/>
        <span>{{name}}</span>
    </div>
    `;

    function requestData() {
        // 发送请求获取数据
        new Promise((resolve, reject) => {

            $.ajax({
                url: HOME_CATE_URL,
                dataType: "json",
                method: "get",
                success(data) {
                    resolve(data.data.kingkongList);
                },
                error(error) {
                    reject(error);
                }
            })
        }).then((data) => {


            // 成功拿到数据之后我们去渲染模板，然后显示在页面之中
            let arr = data.map(item => {

                return cateTemplate.replace(/\s?{{src}}/, item.icon)
                    .replace(/\s?{{name}}/, item.name);
            });
            // 所有的cate的数组数据，然后我们需要将每十个作为一页的数据进行分组
            let cate_in_ten_group_arr = [];
            while (arr.length > 0) {
                cate_in_ten_group_arr.push(arr.splice(0, 10));
            }

            // 分组之后呢我们需要将这些数据渲染到页面之中

            let swiperHTML = '';
            cate_in_ten_group_arr.forEach(list => {
                swiperHTML += `
            <div class="swiper-slide">${list.join("")}</div>
            `;
            });
            $(".banner .swiper-wrapper").html(swiperHTML);

            new Swiper(".banner", {
                // 如果需要分页器
                pagination: '.swiper-pagination',
            })
        }).catch((error) => {
            console.log(error);
        }).finally(() => {

        })

    }

    // 调用请求cate数据的方法
    requestData();
    PubSub.subscribe("pull-refresh", requestData);

})($);