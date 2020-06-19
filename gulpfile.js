const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const include = require('gulp-include');
const cssmin = require('gulp-cssmin');

const js = 'src/main.js';
const css = 'src/style.css';

gulp.task('minify', () => 
    gulp.src(js)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
);

gulp.task('css', () => 
    gulp.src(css)
        .pipe(include())
        .pipe(cssmin())
        .pipe(gulp.dest('dist'))
);