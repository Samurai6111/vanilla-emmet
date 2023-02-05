// 1. module読み込み
const { src, dest, watch, series, parallel } = require("gulp");

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

//ブラウザリロード
const browserSync = require("browser-sync");

//参照元パス
const srcPath = {
    css: "asset/scss/*.scss",
};

//出力先パス
const destPath = {
    css: "asset/css/",
};

// 2. 関数定義
//sassコンパイル
const cssSass = () => {
    return src(srcPath.css) //コンパイル元
        .pipe(
            plumber(
                //エラーが出ても処理を止めない
                {
                    errorHandler: notify.onError("Error:<%= error.message %>"),
                    //エラー出力設定
                }
            )
        )
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

//ローカルサーバー立ち上げ、ファイル監視と自動リロード
const browserSyncFunc = () => {
    browserSync.init(browserSyncOption);
};
const browserSyncOption = {
    proxy: "enowa.local", //環境によって変更する
    open: true,
    reloadOnRestart: true,
    notify: false,
};

//リロード
const browserSyncReload = (done) => {
    browserSync.reload();
    done();
};

// 3. タスク定義
const watchFiles = () => {
    watch(srcPath.css, series(cssSass, browserSyncReload));
};
exports.default = series(series(cssSass, js_min), parallel(watchFiles, browserSyncFunc));