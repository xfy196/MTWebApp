;; (() => {
    const userPicUrl = "https://s3plus.sankuai.com/v1/mss_00c90c47614241978d32cca9bc6e44a4/h5i/userpic_defalut.c741e924.png";
    let commentsTemplate = `
    <div class="score-wrap">
        <div class="score">
            <span>{{shopScore}}</span>
            <div>商家评分</div>
        </div>
        <div class="stars">
            <div class="flavor-stars">
                <span class="f-txt">口味</span>
                <div class="f-star">
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                </div>
                <span class="f-score">{{qualityScore}}</span>
            </div>
            <div class="packing-stars">
                <span class="p-txt">包装</span>
                <div class="p-star">
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                    <i class="star-icon"></i>
                </div>
                <span class="f-score">{{packScore}}</span>
            </div>
        </div>
        <div class="distribution-score">
            <span class="d-score">{{deliveryScore}}</span>
            <span class="d-txt">配送评分</span>
        </div>
    </div>
    <div class="c-cate border-bottom">
        {{commentCates}}
    </div>
    <div class="c-content">
        <ul class="comment-list">
            {{commentList}}
        </ul>
    </div>
    `;

    let commentCatesTemplate = `
    <span class="{{isSelected}} border">{{content}}</span>
    `;
    let commentListTemplate = `
    <li class="c-item border-bottom">
        <div class="u-pic">
            <img src="{{userPicUrl}}"
                alt="">
        </div>
        <div class="c-info">
            <div class="nickname-time">
                <span class="nickname">{{userName}}</span>
                <span class="time">{{commentTime}}</span>
            </div>
            <div class="arrival-time">{{deliveryTime}}</div>
            <div class="c-txt">{{content}}</div>
            <div class="order-type">
                <i class="f-icon"></i>
                <span class="o-type">{{praiseDish}}</span>
            </div>
        </div>
    </li>
    `;

    function requestData() {

        new Promise((resolve, reject) => {

            $.ajax({
                url: DETAIL_COMMENT_URL,
                method: "get",
                dataType: "json",
                success(data) {
                    console.log(data);
                    handleCommentData(data.data);
                },
                error(error) {
                    reject(error);
                }
            })
        }).then((data) => {
            console.log(data);
        }).catch((error) => {

        });
    }
    /**
     * 处理评论的数据的函数
     * @param {*} data 
     */
    function handleCommentData(data) {
        let commentCatesHTML = "";
        data.commentLabels.forEach((item) => {
            commentCatesHTML += commentCatesTemplate.replace(/{{isSelected}}/, item.isSelected === 1 ? "active" : "")
                .replace(/{{content}}/, item.content);
        });

        let commentListHTML = "";
        data.list.forEach((item) => {
            commentListHTML += commentListTemplate.replace(/{{userPicUrl}}/, item.userPicUrl === "" ? userPicUrl : item.userPicUrl)
            .replace(/{{userName}}/, item.userName).replace(/{{commentTime}}/, item.commentTime)
            .replace(/{{deliveryTime}}/, item.deliveryTime)
            .replace(/{{content}}/, item.content)
            .replace(/{{praiseDish}}/, item.praiseDish);
        })
        let commentsHTML = commentsTemplate.replace(/{{shopScore}}/, data.shopScore)
            .replace(/{{qualityScore}}/, data.qualityScore)
            .replace(/{{packScore}}/, data.packScore)
            .replace(/{{deliveryScore}}/, data.deliveryScore)
            .replace(/{{commentCates}}/, commentCatesHTML)
            .replace(/{{commentList}}/, commentListHTML);

            $(".comments").html(commentsHTML);
        
    }
    // 订阅评论数据请求完成
    PubSub.subscribe("commentRequest", () => {
        requestData();
    });
})();