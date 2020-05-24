module.exports = {
    home : {
        html : "./view/home/home.html",
        css : [
            "./view/home/**/*.css",
            "./components/appScroll/style.css",
            "./components/tabs/style.css"
        ],
        js : [
            "./components/appScroll/index.js",
            "./components/tabs/index.js",
            "./view/home/**/*.js"
        ]
    },
    order : {
        html : "./view/order/order.html",
        css : [
            "./view/order/**/*.css",
            "./components/tabs/style.css"
        ],
        js : [
            "./components/tabs/index.js",
            "./view/order/**/*.js"
        ]
    },
    mine : {
        html : "./view/mine/mine.html",
        css : [
            "./view/mine/**/*.css",
            "./components/tabs/style.css"
        ],
        js : [
            "./components/tabs/index.js",
            "./view/mine/**/*.js"
        ]
    },
    detail : {
        html : "./view/detail/detail.html",
        css : [
            "./view/detail/**/*.css",
            "./components/tabs/style.css"
        ],
        js : [
            "./view/detail/**/*.js"
        ]
    }
}