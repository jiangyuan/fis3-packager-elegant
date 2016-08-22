/**
 * gulpfile
 * @author jero
 * @date 2016-08-19
 */

const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-spawn-mocha');

gulp.task('default', () => {
  gulp.watch('src/**.js', ['babel']);
  // gulp.watch('test/*.js', ['test']);
});

gulp.task('babel', () => {
  gulp.src('src/**.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-class-properties']
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: path.join(__dirname, 'src')
    }))
    .pipe(gulp.dest('lib'));
});

function handleError(err) {
  console.log(err.toString()); // eslint-disable-line
  this.emit('end');
}

gulp.task('test', () => {
  gulp.src('test/primary.js', {
    read: false
  }).pipe(mocha({
    compilers: 'js:babel-core/register'
  })).on('error', handleError);
});
