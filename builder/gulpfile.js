const gulp = require('gulp'),

        // TOOLS
        gulp_if = require('gulp-if'),
        gulp_lazypipe = require('lazypipe'),
        gulp_rename = require('gulp-rename'),
        gulp_plumber  = require('gulp-plumber'),
        gulp_sourcemaps  = require('gulp-sourcemaps'),
        gulp_notify = require('gulp-notify'),
        gulp_clean = require('gulp-clean'),

        // CSS
        gulp_sass  = require('gulp-sass'),
        gulp_autoprefixer  = require('gulp-autoprefixer'),
        gulp_cssnano  = require('gulp-cssnano'),

        //JS
        gulp_babel = require('gulp-babel'),
        es2015 = require('babel-preset-es2015'),
        gulp_uglify=require('gulp-uglify'),

        // IMAGES
        gulp_imagemin=require('gulp-imagemin');

  const config = {
    assets: '../assets/',
    src: '../src/'
  }

  gulp.task('default', gulp.series(clean, gulp.parallel(fonts, sass, js, images, watch), () => { }));

  function watch() {
    gulp.watch(config.src+'scss/**/*.scss',gulp.series(sass));
    gulp.watch(config.src+'js/**/*.js',gulp.series(js));
  }

  function clean() {
    return gulp.src('../assets/', {read: false})
        .pipe(gulp_clean({force:true}))
  }

  function fonts() {
      return gulp.src(config.src+'fonts/**/**')
      .pipe(gulp.dest(config.assets+'fonts'))
  }

  function sass() {
      return gulp.src(config.src+'scss/main.scss')
          .pipe(gulp_plumber({
              errorHandler: gulp_notify.onError('SASS Error: <%= error.message %>')
          }))
          .pipe(gulp_sourcemaps.init())
          .pipe(gulp_sass().on('error', gulp_sass.logError))
          .pipe(gulp_autoprefixer({
              browsers:['last 2 versions']
          }))
          .pipe(gulp_cssnano())
          .pipe(gulp_sourcemaps.write())
          .pipe(gulp_rename('main.min.css'))
          .pipe(gulp.dest(config.assets+'css'))
          .pipe(gulp_notify('SASS compiled: <%= file.relative %>'))
  }

  function images() {
    gulp.src(config.src+'img/**')
          .pipe(gulp_imagemin())
          .pipe(gulp.dest(config.assets+'img'));
  }

  let chainjs = gulp_lazypipe().pipe(gulp_babel, {presets:[es2015]}).pipe(gulp_uglify);
  function js() {
      return gulp.src(config.src+'js/main.js')
          .pipe(gulp_sourcemaps.init())

          .pipe(gulp_if('*.js',
             chainjs()
          ))
          .pipe(gulp_sourcemaps.write())
          .pipe(gulp_rename('main.min.js'))
          .pipe(gulp.dest(config.assets+'js/'))
          .pipe(gulp_notify('JS compiled'));
  }
