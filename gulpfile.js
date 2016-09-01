var gulp = require('gulp');
var gulpUglify = require('gulp-uglify');
var gulpImg = require('gulp-imagemin');

function errlog(err) {
  console.error(err);
  this.emit('end');
}


gulp.task('default', ['script', 'watch']);


gulp.task('watch', function () {
  gulp.watch('public/javascripts/*.js', ['script'])
})


gulp.task('script', function () {
  gulp.src('public/javascripts/*.js')
      .on('error', errlog)   // 使用錯誤事件處理例外
      .pipe(gulpUglify())
      .pipe(gulp.dest('public/jsmin'))
})

gulp.task('img', function () {
  
})