const gulp = require("gulp");
const url = require("url");
const fs = require("fs");
const plugins = require("gulp-load-plugins")();
const babelOptions = {
    plugins: [],
    presets: ['@babel/preset-env']
}
const config = require('./config');
// 处理公共的lib目录
const copyFile = (cb) => {
    gulp.src('./lib/**/*')
        .pipe(gulp.dest('./dist/lib'));
    cb();
};

const handleCommonJS = (cb) => {
    gulp.src('./js/**/*.js')
        .pipe(plugins.concat('common.js'))
        .pipe(plugins.babel(babelOptions))
        // .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/js'));
    cb();
};

const handlePageJs = (cb) => {
    Object.entries(config).forEach(([key, value]) => {

        // 判断是否存在js文件
        if (value.js && value.js.length > 0) {

            // 存在js文件的我们接处理他
            gulp.src(value.js)
                .pipe(plugins.concat(`${key}.js`))
                .pipe(plugins.babel(babelOptions))
                // .pipe(plugins.uglify())
                .pipe(gulp.dest('./dist/js/'));
        }
    });
    cb();
}


/*                 处理css的                */


const handleCommonCss = (cb) => {
    gulp.src("./css/**/*.css")
        .pipe(plugins.concat("common.css"))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest("./dist/css"));
    cb();
}

// 处理页面的css
const handlePageCss = (cb) => {
    Object.entries(config).forEach(([key, value]) => {
        if (value.css && value.css.length > 0) {
            gulp.src(value.css)
                .pipe(plugins.concat(`${key}.css`))
                .pipe(plugins.minifyCss())
                .pipe(gulp.dest("./dist/css"));
        }
    });
    cb();
}

/*             处理html              */
const handleHtml = (cb) => {
    const htmls = Object.entries(config).map(([key, value]) => {
        return value.html;
    });
    gulp.src(htmls)
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest("./dist/views"));
    cb();
}


// 处理图片的


const handleImage = (cb) => {
    gulp.src(['./assets/**/*.jpg', './assets/**/*.png', './assets/**/*.jpeg', './assets/**/*.gif'])
        .pipe(plugins.imagemin())
        .pipe(gulp.dest("./dist/assets"));
    cb();
}
// 启动服务的
const startServer = function (cb) {
    gulp.src('./dist/')
        .pipe(plugins.webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            port: 8080,
            host: "localhost",
            path: "/",
            middleware: (request, response, next) => {
                const requestURL = request.url;

                const { pathname, query: { page } } = url.parse(requestURL, url);
                // 判断是否要拦截的请求
                if (pathname === '/api/kingkong') {
                    // 这时候我们需要拦截请求做响应的处理了
                    fs.readFile("./data/cate.json", (error, data) => {

                        response.setHeader("Content-type", "application/json;charset=UTF-8");
                        response.end(data);
                    })
                } else if (pathname === "/api/shoplist") {
                    const newPage = page % 3 === 0 ? 1 : page % 3;
                    // 这时候我们需要拦截请求做响应的处理了
                    fs.readFile(`./data/shoplist${newPage}.json`, (error, data) => {

                        response.setHeader("Content-type", "application/json;charset=UTF-8");
                        response.end(data);
                    });
                } else if (pathname === "/api/detail") {
                    let temp = parseInt(Math.random() * 100) % 3;
                    const newPage = temp === 0 ? 1 : temp;
                    fs.readFile(`./data/foodDetail${newPage}.json`, (error, data) => {

                        response.setHeader("Content-type", "application/json;charset=UTF-8");
                        response.end(data);
                    });
                } else if (pathname === "/api/detail/comment/") {
                    let temp = parseInt(Math.random() * 100) % 3;
                    const newPage = temp === 0 ? 1 : temp;
                    fs.readFile(`./data/comment${newPage}.json`, (error, data) => {

                        response.setHeader("Content-type", "application/json;charset=UTF-8");
                        response.end(data);
                    });
                }
                else {
                    // 直接放行，不做任何拦截
                    next();
                }
            }
        }));
    cb();
}

const build = gulp.series(
    gulp.parallel(
        // 拷贝第三方资源
        copyFile,
        handleHtml,
        handleImage,
        gulp.parallel(handleCommonJS, handlePageJs),
        gulp.parallel(handleCommonCss, handlePageCss),
    )
);

const watcher = () => {
    gulp.watch([
        "./assets/**/*",
        "./components/**/*",
        "./css/**/*",
        "./js/**/*",
        "./lib/**/*",
        "./view/**/*"
    ], build);
}
exports.default = gulp.series(build, gulp.parallel(watcher, startServer));

exports.handleHtml = handleHtml;