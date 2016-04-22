/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/9/16)
 */

//Gulp main
var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var del = require("del");
var copy = require("gulp-copy");
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');
var git = require('gulp-git');
var sass = require('gulp-sass');
var refresh = require('gulp-refresh');

//configs
var paths = {
    scripts: [
        'src/*.js'
    ],
    styles: [
        'src/*.scss'
    ],
    parts: [
        'src/scss/**/*.scss'
    ],
    lib: [
        "bower_components/*"
    ],
    demo: [
        "demo/app/*.js",
        "demo/css/*.js",
        "demo/index.html"
    ],
    dist: {
        root: "dist"
    }
};

gulp.task('clean', function (done) {
    del([paths.dist.root], done);
});

gulp.task("lib", function () {
    return gulp.src(paths.lib)
        .pipe(refresh())
});

gulp.task("demo", function () {
    return gulp.src(paths.demo)
        .pipe(refresh())
});

gulp.task("scripts", function () {
    return gulp.src(paths.scripts)
        .pipe(concat('proton.multi-list-picker.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(refresh())
});

gulp.task('sass', function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(refresh())
});


gulp.task('git-scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(git.add());
});

gulp.task('git-styles', function () {
    return gulp.src(paths.styles)
        .pipe(git.add());
});

gulp.task('git-dist', function () {
    return gulp.src(paths.dist.root)
        .pipe(git.add());
});

gulp.task('git-demo', function () {
    return gulp.src(paths.demo)
        .pipe(git.add());
});

gulp.task('watch', function () {
    refresh.listen({
        port: 13001
    });
    gulp.watch(paths.scripts, ['git-scripts', 'scripts']);
    gulp.watch(paths.styles, ['git-styles', 'sass']);
    gulp.watch(paths.demo, ['git-demo', 'demo']);
    gulp.watch(paths.dist.root, ['git-dist']);
    gulp.watch(paths.lib, ['lib']);
});


gulp.task("default", ["clean", "sass", "scripts", "watch"]);
