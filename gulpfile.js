let gulp = require("gulp");
let sass = require("gulp-sass")(require("sass"));
let scss_dir = './assets/Scss/*.scss'
let css_dir = './assets/Css'

gulp.task("sass", function(){
    gulp.src(scss_dir)
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(gulp.dest(css_dir))
});

gulp.task("watch", function(){
    gulp.watch(scss_dir, gulp.series(["sass"]))
});
