/* jshint node: true, globals: false */
// generated on 2015-06-27 using generator-gulp-webapp 1.0.2
'use strict';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import bs from 'browser-sync';
import fs from 'fs';
import del from 'del';
import webpack from 'webpack';
import url from 'url';
import mainBowerFiles from 'main-bower-files';

const $ = gulpLoadPlugins();

gulp.task('webpack', (done) => {
  webpack(require('./webpack.conf.js'), done);
});

gulp.task('webpack:dev', (done) => {
  var compiler = webpack(require('./webpack.conf.dev.js'));

  compiler.watch(200, (err, stats) => {
    if (err) throw err;

    bs.reload();

    if (done) {
      done();
      done = null;
    }
  });
});

gulp.task('inject', ['styles'], () => {
  return gulp.src('app/*.html')
    .pipe($.inject(gulp.src('.tmp/**/*.css'), { ignorePath: '.tmp' }))
    .pipe(gulp.dest('.tmp'))
    .pipe(bs.stream({ once: true }));
});

gulp.task('styles', () => {
  return gulp.src('app/**/*.scss')
    .pipe($.plumber({
      errorHandler: function (err) {
          console.log(err);
          this.emit('end');
      }
    }))
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('html', ['webpack', 'inject'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', '.']});

  return gulp.src('.tmp/*.html')
    .pipe(assets)
    .pipe($.if(['*.js', '!app/**/*.js'], $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(mainBowerFiles({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['webpack:dev', 'inject', 'fonts'], () => {
  bs({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', bs.reload);

  gulp.watch(['app/*.html', 'app/**/*.scss'], ['inject']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['fonts']);
});

gulp.task('build', ['html', 'images', 'fonts'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('publish', ['build'], (done) => {
  fs.copy('dist', '../public', done);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
