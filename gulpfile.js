const gulp = require("gulp");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("sass", () => {
    return gulp
    .src("dev/scss/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest("public/stylesheets/"));
});

gulp.task("watch", () => {
    gulp.watch("dev/scss/**/*.scss", gulp.series("sass"));
});

gulp.task("default", gulp.parallel("sass", "watch"));
