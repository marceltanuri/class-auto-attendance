const gulp = require('gulp');
const clean = require('gulp-clean')

const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')


gulp.task("runWebpack", () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err)
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')))
      }
      resolve()
    })
  })
})


gulp.task('clean', function () {
  return gulp.src('dist/*', { read: false })
    .pipe(clean())
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.*', gulp.series('build'))
})
