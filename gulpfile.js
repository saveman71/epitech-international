'use strict';

var gulp = require('gulp');
var rename = require("gulp-rename");
var less = require('gulp-less');
var pleeease = require('gulp-pleeease');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var isProduction = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === "staging");

var paths = {
  less: {
    watch: 'less/*.less',
    entryPoints: ['less/style.less'],
  },
  fonts: {
    entryPoints: [
      'bower_components/bootstrap/fonts/*'
    ],
  },
  jsLibs: {
    entryPoints: [
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/sortable/js/sortable.min.js'
    ],
  },
  target: 'public/dist/',
  ignores: ['test/**', 'public/dist']
};

// LESS compiling
gulp.task('less', function() {
  var p = gulp.src(paths.less.entryPoints)
    .pipe(sourcemaps.init());

  p = p.pipe(less());

  p = p.pipe(pleeease());
  if(isProduction) {
    p = p.pipe(minifyCss());
  }

  p = p.pipe(rename(function(path) {
    path.dirname = "css";
  }));
  p = p.pipe(sourcemaps.write('.'));
  return p.pipe(gulp.dest(paths.target));
});

// Fonts
gulp.task('fonts', function() {
  var p = gulp.src(paths.fonts.entryPoints);
  return p.pipe(gulp.dest(paths.target + 'fonts/'));
});

// JS Libs
gulp.task('js-libs', function() {
  var p = gulp.src(paths.jsLibs.entryPoints);
  return p.pipe(gulp.dest(paths.target + 'js/'));
});

gulp.task('build', ['js-libs', 'less', 'fonts']);

// ----- Development only
if(!isProduction) {
  var nodemon = require('gulp-nodemon');
  var livereload = require('gulp-livereload');

  var nodemonOptions = {
    script: 'bin/server',
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    },
    ignore: paths.ignores
  };

  // Nodemon (auto-restart node-apps)
  gulp.task('nodemon', function() {
    nodemon(nodemonOptions);
  });

  // Auto-run tasks on file changes
  gulp.task('watch', function() {
    gulp.watch(paths.less.watch, ['less', livereload.changed]);
  });

  gulp.task('livereload', function() {
    livereload.listen();
    gulp.watch(paths.less.watch, []);
  });

  // Run main tasks on launch
  gulp.task('default', ['build', 'nodemon', 'watch', 'livereload'], function() {
  });
}
