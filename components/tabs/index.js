;;(function () {

    // icon 放置地址的前缀
    const iconPrefix = "../assets/";

    // 页面的后缀
    const pageSuffix = ".html";


    // tab item的模板

    const tabItemTemplate = `
    <a href="./{{href}}${pageSuffix}" class="tab-item {{isActive}}">
        <img src="${iconPrefix}{{icon}}{{activeIcon}}.png" alt="">
        <span>{{name}}</span>
    </a>
    `;

    const tabData = [
        {
            id: "home",
            name: "首页",
            icon: "tab-home",
            href: "home"
        },
        {
            id: "order",
            name: "订单",
            icon: "tab-order",
            href: "order"
        },
        {
            id: "mine",
            name: "我的",
            icon: "tab-mine",
            href: "mine"
        }

    ];


    // 将tabitem的数据和模板结合渲染到页面之中

    let tabItemDom = '';

    tabData.forEach(item => {
        let tabItem = tabItemTemplate;


        // 获取当前地址滥觞的地址是否和数据中id对应这是为了切换页面加入active的效果
        let currentPathName = window.location.pathname.split("/").pop().split(".")[0];

        tabItem = tabItem.replace(/\s?{{isActive}}/, (currentPathName === item.id ? " active" : ""))
            .replace(/{{href}}/, item.href)
            .replace(/{{icon}}/, item.icon)
            .replace(/{{activeIcon}}/, (currentPathName === item.id ? "-a" : ""))
            .replace(/{{name}}/, item.name);
            tabItemDom += tabItem;
    });

    document.querySelector(".tabs").innerHTML = tabItemDom;
})();