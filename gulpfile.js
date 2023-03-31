const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');

gulp.task('css', function() {
    return gulp.src('style.css')
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(gulp.dest('dist/'));
});

gulp.task('purgecss', function() {
    return gulp.src('index.html')
        .pipe(purgecss({
            content: ['index.html'],
            whitelistPatterns: [/^\.w-/, /^\.h-/, /^\.p-/, /^\.m-/]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series('purgecss', 'css'));
