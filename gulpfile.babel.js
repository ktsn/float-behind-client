/* eslint-env node */
/* eslint no-console: 0 */
// generated on 2015-06-27 using generator-gulp-webapp 1.0.2
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import bs from 'browser-sync';
import del from 'del';
import webpack from 'webpack';
import mainBowerFiles from 'main-bower-files';

const $ = gulpLoadPlugins();

gulp.task('lint', (done) => {
  return gulp.src(['app/**/*.js', 'scripts/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('webpack', (done) => {
  webpack(require('./scripts/webpack.config.js'), done);
});

gulp.task('webpack:dev', (done) => {
  var compiler = webpack(require('./scripts/webpack.config.dev.js'));

  compiler.watch({
    poll: 1500
  }, (err, stats) => {
    if (err) throw err;

    bs.reload();
    console.log(stats.toString({
      hash: false,
      version: false,
      chunks: false
    }));

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
  return gulp.src('.tmp/*.html')
    .pipe($.useref({ searchPath: ['.tmp', '.'] }))
    .pipe($.if(['*.js', '!app/**/*.js'], $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
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

gulp.task('serve', ['watch'], () => {
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
});

gulp.task('watch', ['webpack:dev', 'inject', 'fonts'], () => {
  gulp.watch([
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', bs.reload);

  gulp.watch(['app/*.html', 'app/**/*.scss'], ['inject']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['fonts']);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
