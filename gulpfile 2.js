// 1. module読み込み
const { gulp, src, dest, watch, series, parallel } = require("gulp");

//sass
const plumber = require("gulp-plumber");
const sass = require("gulp-sass")(require("sass"));
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const mqpacker = require("css-mqpacker");

//js
const uglify = require("gulp-uglify");

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

//ブラウザリロード
const browserSync = require("browser-sync");

//参照元パス
const srcPath = {
    css: "./src/scss/*.scss",
    img: "img/**/*",
    js: "js/*.js",
    php: "*.php",
};

//出力先パス
const destPath = {
    css: "./dest/css",
    min_css: "./dest/css",
    js: "dest/js/",
    img: "dest/img/",
};

// 2. 関数定義
//sassコンパイル
const cssSass = () => {
    return src(srcPath.css) //コンパイル元
        // .pipe(
        //     plumber(
        //         //エラーが出ても処理を止めない
        //         {
        //             errorHandler: notify.onError("Error:<%= error.message %>"),
        //             //エラー出力設定
        //         }
        //     )
        // )
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(postcss([mqpacker()])) // メディアクエリを圧縮
        .pipe(autoprefixer()) // ベンダープレフィックスを付与
        .pipe(sourcemaps.write())
        .pipe(dest(destPath.css)) //コンパイル先（style.css）
        .pipe(cleanCSS()) // CSS圧縮
        .pipe(
            rename({
                extname: ".min.css", //.min.cssの拡張子にする
            })
        )
        .pipe(dest(destPath.min_css)); //コンパイル先（style.min.css）
};

// 3. タスク定義
const watchFiles = () => {
    watch(srcPath.css, cssSass);
    // watch(srcPath.img, series(imgImagemin, browserSyncReload));
    // watch(srcPath.php, series(browserSyncReload));
    // watch(srcPath.js, series(browserSyncReload));
};
// gulp.task('watch', function(done) {
//     gulp.watch('./src/scss/*.scss', gulp.task('cssSass'));
//     //watch task
//     console.log('watch start');
//     done();
// });
exports.default = watchFiles;