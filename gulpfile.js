const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));


gulp.task('sass', function(done) {
    // stream
    gulp.src('./src/scss/*.scss') //タスクで処理するソースの指定
        .pipe(sass()) //処理させるモジュールを指定
        .pipe(gulp.dest('./dest/css')); //保存先を指定

    done();
});


gulp.task('watch', function(done) {
    gulp.watch('./src/scss/*.scss', gulp.task('sass'));
    //watch task
    done();
});


//defaultタスクは、タスク名を指定しなかったときに実行されるタスクです。
gulp.task(gulp.series('sass', function() {}));