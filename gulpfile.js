var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('server',function(){

         gulp.src('./www/')
                .pipe(webserver({
//                          host:'localhost',
                         host:'192.168.1.6',
                         port:'9000',
                         livereload:true,
                        directoryListing:false
// 创建热更新服务，注意directoryListing的值，当设置为true时，
// 在浏览器输入http://localhost:9000/时现实的时文档目录；
// 设置为false时，显示的是工程文档目录中index.html的内容，即网站首页

         }))

})

