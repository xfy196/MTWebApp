;; (() => {

    const arrowPath = '../assets/arrow.jpg';
    const loadingPath = '../assets/loading.jpg';

    // 是否正在刷新标识符
    let isRefresh = false;

    // 是否正在加载更多标识
    let isLoadMore = false;

    let myScroll = new IScroll(".scroll-wrap", {
        startY: -40,
        probeType: 3,
        tap : true,
        click : true
    });

    // 设置起始位置
    myScroll.scrollTo(0, -40, 0);

    let pullRefreshImg = document.querySelector(".pull-refresh img");
    let pullRefreshText = document.querySelector(".pull-refresh span");

    // 监听正在滚动事件
    myScroll.on("scroll", () => {
        // 正在滚动的时候判断是否已经存在之前的滚动了，是的话直接结束滚动
        if (isRefresh) {
            return;
        }

        // 判断滚动的y值，超过最大值执行刷新，在最小值和最大值我们继续显示
        if (myScroll.y >= 0) {
            pullRefreshImg.className = "down";
            pullRefreshImg.innerText = "释放立即刷新...";
        } else {
            pullRefreshImg.className = "";
            pullRefreshText.innerText = "下拉可以刷新...";
        }
    });

    // 滚动结束的监听
    myScroll.on("scrollEnd", () => {

        if (!isRefresh && myScroll.y >= 0) {
            isRefresh = true;
            pullRefreshImg.src = loadingPath;
            pullRefreshImg.className = "active";
            pullRefreshText.innerText = "正在刷新...";

            // 刷新的时候我们需要发送ajax请求 模拟一下延迟的效果
            PubSub.publish("pull-refresh");
            
            setTimeout(() => {
                pullRefreshImg.src = arrowPath;
                pullRefreshImg.className = "";
                pullRefreshText.innerText = "下拉刷新...";
                isRefresh = false;
                myScroll.scrollTo(0, -40, 200);
            }, 1000);

        } else if (myScroll.y > -40 && myScroll.y < 0) {
            myScroll.scrollTo(0, -40, 200);
        }

    });


    // 上拉加载

    let loadMoreImg = document.querySelector(".load-more img");

    let loadMoreText = document.querySelector(".load-more span");

    myScroll.on("scroll", () => {

        // 处于上拉加载状态就直接结束
        if (isLoadMore) {

            return;
        }

        let y = myScroll.y;
        let topLine = myScroll.maxScrollY + 40;
        let bottomLine = myScroll.maxScrollY;

        if (y >= topLine) {
            // 还没有上拉
        } else if (y > bottomLine && y < topLine) {
            // 处于中间的范围
            loadMoreImg.className = "";
            loadMoreText.innerTx = "上拉可以加载更多...";
        } else {
            loadMoreImg.className = "up";
            loadMoreText.innerText = "释放立即加载更多...";
        }
    });

    myScroll.on("scrollEnd", () => {
        let y = myScroll.y;
        let topLine = myScroll.maxScrollY + 40;
        let bottomLine = myScroll.maxScrollY;

        if (y >= topLine) {
            // 正常的滚动范围什么都不用干
        } else if (y > bottomLine && y < topLine) {
            myScroll.scrollTo(0, topLine, 200);
        } else if (y <= bottomLine && !isLoadMore) {

            isLoadMore = true;

            loadMoreImg.src = loadMoreImg;
            loadMoreImg.className = "active";
            loadMoreText.innerText = "正在加载...";

            // 发布功能
            PubSub.publish("load-more");

        }
    })

    // 下拉加载更多订阅功能
    PubSub.subscribe("load-more-end", () => {
        loadMoreImg.src = arrowPath;
        loadMoreImg.className = "";
        loadMoreText.innerText = "上拉加载更多...";
        isLoadMore = false;
    })

    myScroll.on("beforeScrollStart", () => {
        myScroll.refresh();
    })
})();