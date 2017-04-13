
const [gulp,browserSync,nodemon]=[require('gulp'),require('browser-sync'),require('gulp-nodemon')];
const reload = browserSync.reload;

//gulp-nodemon搭建自动重启的服务器环境(服务器端的自动重启)
gulp.task('start',function(){
  nodemon({
    script:'app.js',
    ext:'js html',
    env:{'NODE_ENV':'development'}
  })
})

// 监视文件改动并重新载入(客户端的自动刷新)
gulp.task('serve',['start'],function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['*.js', 'wechat/*.js'], {cwd: './'}, reload);
});


