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

//js
const minify = require("gulp-babel-minify");

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

//ローカルサーバ
const browserSync = require("browser-sync");

//参照元パス
const srcPath = {
  css: "assets/css/*.scss",
  img: "assets/img/*",
  js: "assets/js/*.js",
};

//出力先パス
const destPath = {
  css: "assets/css/",
  min_css: "dest/css/",
  js: "dest/js/",
  img: "dest/img/",
};

// 2. 関数定義
//sass compile
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

//js minify
const js_min = () => {
  return src(srcPath.js) //コンパイル元
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(
      rename({
        extname: ".min.js", //.min.cssの拡張子にする
      })
    )
    .pipe(dest(destPath.js));
};

//image minify
const img_min = () => {
  return src(srcPath.img)
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 80,
          }),
          imageminPngquant(),
          imagemin.svgo({
            plugins: [{ removeViewbox: false }, { cleanupIDs: false }],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(destPath.img));
};

//Setting Local Server
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};
const browserSyncOption = {
  open: true,
  reloadOnRestart: true,
  notify: false,
  server: {
    baseDir: "./",
  },
};

//Hot Reload
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// 3. タスク定義
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload));
  watch(srcPath.img, series(img_min, browserSyncReload));
  watch(srcPath.js, series(js_min, browserSyncReload));
};
exports.default = series(series(cssSass, js_min), parallel(watchFiles, browserSyncFunc));
exports.css = series(cssSass);
exports.js = series(js_min);
exports.img = series(img_min);
