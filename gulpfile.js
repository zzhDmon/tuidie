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
	 browserSync.init({
		server: "./www/build",
		port:3001
    });

    gulp.watch("www/build/**/*.scss", ['sass']);
    gulp.watch("www/build/**/*.html").on('change', browserSync.reload);
    gulp.watch("www/build/**/*.js").on('change', browserSync.reload);
});
// gulp.task('serve', ['sass'] , function() {
// 	browserSync.init({
// 		server: "./www",
// 		port:4000
//     });

//     gulp.watch("www/**/*.scss", ['sass']);
//     gulp.watch("www/**/*.html").on('change', browserSync.reload);
//     gulp.watch("www/**/*.js").on('change', browserSync.reload);
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
   gulp.task('libcss', function(done) {
       gulp.src('./www/libs/**/*.css')
         .pipe(minifyCss({
           // keepSpecialComments: 0
           keepSpecialComments:'*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
         }))
         .pipe(concat('libs.css'))
         .pipe(rename({ extname: '.min.css' }))
         .pipe(gulp.dest('./www/build/css/'))
         .on('end', done);
     });
   gulp.task('maincss', function(done) {
       gulp.src('./www/css/**/*.css')
       //   压缩同份css
         .pipe(minifyCss({
           // keepSpecialComments: 0
           keepSpecialComments:'*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
         }))
         .pipe(concat('main.css'))
         .pipe(rename({ extname: '.min.css' }))
         .pipe(gulp.dest('./www/build/css/'))
         .on('end', done);
     });
  

// js
    // gulp.task('jshint', function () {
    //     return gulp.src('js/*.js')
    //         .pipe(jshint())
    //         .pipe(jshint.reporter('default'));
    //   });
    
    
         gulp.task('minifyjs', function() { 
           // return gulp.src(jspaths.script)  
           return gulp.src(['./www/modules/**/*.js'])   
               .pipe(ngAnnotate())
               .pipe(ngmin({dynamic: false}))  
               .pipe(stripDebug())  
               .pipe(uglify())  
               .pipe(concat('controllers.min.js'))    
               .pipe(gulp.dest('./www/build/js/controllers/'))  
         }); 
         
         gulp.task('minifyotherlib', function() {  
		    return gulp.src(['./www/libs/**/*.js','!./www/libs/angular/**/*.js']) //特意如此，避免顺序导致的问题
		        .pipe(ngAnnotate())
		        .pipe(ngmin({dynamic: false}))  
		        .pipe(stripDebug())  
		        .pipe(uglify())  
		        .pipe(concat('otherlibs.min.js'))  
		        .pipe(gulp.dest('./www/build/js/otherlibs/'))  
		}); 
         gulp.task('minifyangular', function() {  
		    return gulp.src(['./www/libs/angular/angular/angular.js',
		    				'./www/libs/angular/angular-animate/angular-animate.js',
		    				'./www/libs/angular/angular-aria/angular-aria.js',
		    				'./www/libs/angular/angular-cookies/angular-cookies.js',
		    				'./www/libs/angular/angular-messages/angular-messages.js',
		    				'./www/libs/angular/angular-resource/angular-resource.js',
		    				'./www/libs/angular/angular-sanitize/angular-sanitize.js',
		    				'./www/libs/angular/angular-ui-router/angular-ui-router.js',
		    				'./www/libs/angular/angular-lazy-img/angular-lazy-img.js',
		    				'./www/libs/angular/angular-cache/angular-cache.js',
		    				'./www/libs/angular/angular-loading-bar/loading-bar.js',
		    				'./www/libs/angular/ngStorage/ngStorage.js',
		    				'./www/libs/angular/ngInfiniteScroll/ng-infinite-scroll.js',
		    				'./www/libs/angular/ngToast/ngToast.js',
		    				]) //特意如此，避免顺序导致的问题
		        .pipe(ngAnnotate())
		        .pipe(ngmin({dynamic: false}))  
		        .pipe(stripDebug())  
		        .pipe(uglify())  
		        .pipe(concat('angulars.min.js'))  
		        .pipe(gulp.dest('./www/build/js/angulars/'))  
		}); 
		
		
		var apps=[
		    './www/app/app.js',
		    './www/app/app.main.js',
		    './www/app/app.router.js',
		    './www/app/app.constants.js',
		    
		    './www/app/app.authentication.js',
		    './www/app/app.network.js',
		    
		    './www/app/network/API/api.access.service.js',
		    './www/app/network/API/api.areacode.service.js',
		    './www/app/network/API/api.article.service.js',
		    './www/app/network/API/api.auth-base.service.js',
		    './www/app/network/API/api.auth-default.service.js',
		    './www/app/network/API/api.auth-mobile.service.js',
		    './www/app/network/API/api.auth-social.service.js',
		    './www/app/network/API/api.auth-web.service.js',
		    './www/app/network/API/api.banner.service.js',
		    './www/app/network/API/api.brand.service.js',
		    './www/app/network/API/api.cardpage.service.js',
		    './www/app/network/API/api.cart.service.js',
		    './www/app/network/API/api.cashgift.service.js',
		    './www/app/network/API/api.category.service.js',
		    './www/app/network/API/api.config.service.js',
		    './www/app/network/API/api.consignee.service.js',
		    './www/app/network/API/api.coupon.service.js',
		    './www/app/network/API/api.invoice.service.js',
		    './www/app/network/API/api.message.service.js',
		    './www/app/network/API/api.notice.service.js',
		    './www/app/network/API/api.order.service.js',
		    './www/app/network/API/api.payment.service.js',
		    './www/app/network/API/api.product.service.js',
		    './www/app/network/API/api.push.service.js',
		    './www/app/network/API/api.recommend.service.js',
		    './www/app/network/API/api.region.service.js',
		    './www/app/network/API/api.review.service.js',
		    './www/app/network/API/api.score.service.js',
		    './www/app/network/API/api.search.service.js',
		    './www/app/network/API/api.shipping.service.js',
		    './www/app/network/API/api.shop.service.js',
		    './www/app/network/API/api.site.service.js',
		    './www/app/network/API/api.splash.service.js',
		    './www/app/network/API/api.theme.service.js',
		    './www/app/network/API/api.user.service.js',
		    './www/app/network/API/api.version.service.js',
		    './www/app/network/API/api.bonus.service.js',
		    './www/app/network/API/api.balance.service.js',
		    './www/app/network/API/api.withdraw.service.js',
		    './www/app/network/api.service.js',
		    
		    './www/app/services/config.service.js',
		    './www/app/services/weixin.service.js',
		  
		    './www/app/filters/formatNickname.js',
		    './www/app/filters/localTime.js',
		    './www/app/filters/trustHtml.js',
		  
		    './www/app/directives/ui-back.js',
		    './www/app/directives/ui-butterbar.js',
		    './www/app/directives/ui-focus.js',
		    './www/app/directives/ui-scroll.js',
		    './www/app/directives/ui-toggleclass.js',
		    './www/app/directives/ui-valid-input.js',
		    './www/app/directives/ui-valid-link.js']
    gulp.task('minifyapp', function() {  
		    return gulp.src(apps) //特意如此，避免顺序导致的问题
		        .pipe(ngAnnotate())
		        .pipe(ngmin({dynamic: false}))  
		        .pipe(stripDebug())  
		        .pipe(uglify())  
		        .pipe(concat('apps.min.js'))  
		        .pipe(gulp.dest('./www/build/js/apps/'))  
		}); 
    gulp.task('minifymodules', function() {  
		    return gulp.src(['./www/modules/**/*.js']) //特意如此，避免顺序导致的问题
		        .pipe(ngAnnotate())
		        .pipe(ngmin({dynamic: false}))  
		        .pipe(stripDebug())  
		        .pipe(uglify())  
		        .pipe(concat('modules.min.js'))  
		        .pipe(gulp.dest('./www/build/js/modules/'))  
		}); 
		
