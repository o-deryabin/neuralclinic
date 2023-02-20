let project_folder = "dist";
let sourse_folder = "src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
  },
  src: {
    html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
    css: sourse_folder + "/scss/styles.scss",
    js: sourse_folder + "/js/scripts.js",
    img: sourse_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
  },
  watch: {
    html: sourse_folder + "/**/*html",
    css: sourse_folder + "/scss/**/*.scss",
    js: sourse_folder + "/js/**/*.js",
    img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp");

fileinclude = require("gulp-file-include");
del = require("del");
scss = require("gulp-sass");
autoprefixer = require("gulp-autoprefixer");
gcmq = require("gulp-group-css-media-queries");
cleanCSS = require("gulp-clean-css");
rename = require("gulp-rename");
uglify = require("gulp-uglify-es").default;
imagemin = require("gulp-imagemin");

function html() {
  return src(path.src.html).pipe(fileinclude()).pipe(dest(path.build.html));
}

function images() {
  return src(path.src.img)
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 3,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
      })
    )
    .pipe(dest(path.build.img));
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js));
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        overrideBrowserslist: "Last 5 verseons",
        outputStyle: "expanded",
      })
    )
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css));
}

function watchGulp() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html, js, images));
let watch = gulp.parallel(build, watchGulp);

exports.watch = watch;
exports.default = watch;
exports.build = build;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
