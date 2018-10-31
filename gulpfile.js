var gulp = require("gulp");
var clean = require('gulp-clean');
var csso = require("gulp-csso");
var imagemin = require('gulp-imagemin');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var inject = require("gulp-inject");
var ngAnnotate = require('gulp-ng-annotate')
gulp.task('clean', function() {
    return gulp.src('build', {
            read: false
        })
        .pipe(clean());
});
gulp.task('html', ['clean'], function() {
    gulp.src("src/views/*.html")
        .pipe(gulp.dest("build/views"));
});
gulp.task('styles', ['clean'], function() {
    return gulp.src('src/style.css')
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css'))
});
gulp.task("scripts", ['clean'], function() {
    return gulp.src("src/**/*.js")
        .pipe(concat('scripts.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("build/js"));
});
gulp.task('image', ['clean'], function() {
    gulp.src('src/images/*.{jpg,jpeg,png,gif}')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('build/images'));
});
gulp.task('addFiles', ['scripts', 'styles'], function() {
    var target = gulp.src('src/index.html');
    var sources = gulp.src(['build/js/scripts.min.js', 'build/css/style.min.css'], {
        read: false
    });
    return target.pipe(inject(sources))
        .pipe(gulp.dest('build'));
});
gulp.task('build', ['clean', 'html', 'styles', 'scripts', 'image', 'addFiles']);
gulp.task('default', ['build']);