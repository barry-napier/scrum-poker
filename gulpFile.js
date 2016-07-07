var gulp        = require('gulp');
var browserSync = require('browser-sync');
var nodemon     = require('gulp-nodemon');
var jshint      = require('gulp-jshint');

// Lint scripts
gulp.task('lint', function() {

  return gulp.src(['client/js/**/*.js', 'server/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));

});

// Live Reload
gulp.task('browser-sync', ['nodemon'], function() {

  browserSync.init(null, {

    proxy: "http://localhost:3000",
    files: ["./client/**/*.*"],
    browser: "google chrome",
    port: 7000

  });

});

gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({

    script: 'index.js'

  }).on('start', function () {

    if (!started) {

      cb();
      started = true;

    }

  });

});

// Watcher will look for changes and execute tasks
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('client/js/**/*.js', 'lint');
});

// Default task will clean build dirs/build project and clear image cache
gulp.task('default', ['lint', 'watch', 'nodemon']);
