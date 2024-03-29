import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import usemin from 'gulp-usemin';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import clean from 'gulp-clean';
import browserify from 'browserify';
import ngAnnotate from 'gulp-ng-annotate';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import minifyCss from 'gulp-minify-css';
import minifyHtml from 'gulp-minify-html';
import browserSync from 'browser-sync';

var config = {
  src: './src',
  dist: './dist',
  appSrc: './src/app/app.js',
  appDest: './dist/js',
  appDestName: 'moviesearch.min.js',
  appSrcMapDest: '.',
  stylesSrc: './src/styles/core.scss',
  stylesDest: 'dist/css',
  htmlSrc: './src/app/*.html',
  imgsSrc: './src/assets/img/**',
  viewsSrc: './src/app/views/**',
  viewsBase: './src/app/views',
  viewsDest: './dist/views',
  fontsSrc: './src/lib/Materialize/font/**',
  fontsDest: 'dist/assets/fonts',
  watch: [
    'src/app/**/*.js',
    'src/styles/**/*.scss'
  ]
};

// Styles
// ----------------------------------------
gulp.task('styles', () => {
  return gulp.src(config.stylesSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.stylesDest));
});

// BrowserSync
// ----------------------------------------
gulp.task('browserSync', ['pipeline'], () => {
  browserSync({
    server: {
      baseDir: config.dist
    }
  });
});

// Clean
// ----------------------------------------
gulp.task('clean', () => {
  return gulp.src(config.dist)
    .pipe(clean());
});

// 
// ----------------------------------------
gulp.task('usemin', ['clean', 'styles'], () => {
  return gulp.src(config.htmlSrc)
    .pipe(usemin({
      html: [minifyHtml()]
    }))
    .pipe(gulp.dest(config.dist));
});

// Pipeline - styles, lint, browserify
// ----------------------------------------
gulp.task('pipeline', ['usemin'], () => {
  
  // no jekyll
  gulp.src('.nojekyll')
    .pipe(gulp.dest(config.dist));

  // images
  gulp.src([
    config.imgsSrc
  ], {base: config.src})
    .pipe(gulp.dest(config.dist));

  // views
  gulp.src([
    config.viewsSrc
  ], {base: config.viewsBase})
    .pipe(gulp.dest(config.viewsDest));
  
  // fonts, icons
  gulp.src([
    config.fontsSrc
  ])
  .pipe(gulp.dest(config.fontsDest));
  
  // js bundle
  return browserify(config.appSrc)
    .bundle()
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(source(config.appDestName))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write(config.appSrcMapDest))
    .pipe(gulp.dest(config.appDest));
});

// -------------------------------------------------
// Watchers
// -------------------------------------------------
gulp.task('watch', ['browserSync'], () => {
  gulp.watch(config.watch, ['pipeline']);
});
