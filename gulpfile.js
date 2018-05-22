var gulp        = require("gulp");
var browserSync = require("browser-sync").create();

var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var jshint=require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');  
var stripDebug = require('gulp-strip-debug'); 
var ngAnnotate = require('gulp-ng-annotate');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'] , function() {
// gulp.task('serve',  function() {

    browserSync.init({
        server: "./www"
    });

    gulp.watch("www/**/*.scss", ['sass']);
    gulp.watch("www/**/*.html").on('change', browserSync.reload);
    gulp.watch("www/**/*.js").on('change', browserSync.reload);
});

/**
 * Compile with gulp-ruby-sass + source maps
 */
// gulp.task('sass', function () {

//     return sass('app/scss', {sourcemap: true})
//         .on('error', function (err) {
//             console.error('Error!', err.message);
//         })
//         .pipe(sourcemaps.write('./', {
//             includeContent: false,
//             sourceRoot: '/app/scss'
//         }))
//         .pipe(browserSync.stream({match: '**/*.css'}));
// });

gulp.task('sass', function(done) {
    gulp.src('./www/scss/tuidie.app.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(gulp.dest('./www/css/'))
    //   压缩同份css
    //   .pipe(minifyCss({
    //     // keepSpecialComments: 0
    //     keepSpecialComments:'*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    //   }))
    //   .pipe(rename({ extname: '.min.css' }))
    //   .pipe(gulp.dest('./www/css/'))
      .on('end', done);
  });

//   test合并压缩css
// gulp.task('libcss', function(done) {
//     gulp.src('./www/libs/**/*.css')
//     //   压缩同份css
//       .pipe(minifyCss({
//         // keepSpecialComments: 0
//         keepSpecialComments:'*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
//       }))
//       .pipe(concat('libs.min.css'))
//       .pipe(rename({ extname: '.min.css' }))
//       .pipe(gulp.dest('./www/libs/'))
//       .on('end', done);
//   });
  

// js
    // gulp.task('jshint', function () {
    //     return gulp.src('js/*.js')
    //         .pipe(jshint())
    //         .pipe(jshint.reporter('default'));
    //   });
    
    
    //   gulp.task('minify', function() { 
    //     // return gulp.src(jspaths.script)  
    //     return gulp.src('./wwwiews/**/*.js')   
    //         .pipe(ngAnnotate())
    //         .pipe(ngmin({dynamic: false}))  
    //         .pipe(stripDebug())  
    //         .pipe(uglify())  
    //         .pipe(concat('allcontrollers.min.js'))  
    //         .pipe(gulp.dest('./www/allcontrollers'))  
    //   }); 
