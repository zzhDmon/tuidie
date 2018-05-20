(function() {

    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$http', '$rootScope','$timeout', '$location', '$state', 'API', 'ENUM', 'CONSTANTS', '$window', 'AppAuthenticationService', 'CartModel', 'ConfigModel'];

    function HomeController($scope, $http, $rootScope, $timeout, $location, $state, API, ENUM, CONSTANTS, $window, AppAuthenticationService, CartModel, ConfigModel) {

        var MAX_BANNERS = 10;
        var MAX_NOTICES = 5;
        var MAX_CATEGORIES = 4;
        var MAX_PRODUCTS = 4;

        $scope.banners = [];
        $scope.notices = [];

        // var emptyCategory = {};
        // var emptyCategories = [];

        // for ( var i = 0; i < MAX_CATEGORIES; ++i ) {
        //   emptyCategories.push( emptyCategory );
        // }

        // $scope.categories = emptyCategories;

        var emptyProduct = {};
        var emptyProducts = [];

        for (var i = 0; i < MAX_PRODUCTS; ++i) {
            emptyProducts.push(emptyProduct);
        }

        $scope.topSale = emptyProducts;
        $scope.newArrival = emptyProducts;
        $scope.editorChoice = emptyProducts;

        $scope.touchSearch = _touchSearch;
        $scope.touchBanner = _touchBanner;
        $scope.touchNotice = _touchNotice;
        $scope.touchCategory = _touchCategory;
        $scope.touchProduct = _touchProduct;
        $scope.touchGroup = _touchGroup;

        $scope.formatUrl = _formatUrl;

        $scope.reload = _reload;
        $scope.loadMore = _loadMore;

        $scope.cartModel = CartModel;

        function _touchSearch() {
            $state.go('search', {});
        }

        function _touchBanner(banner) {
            console.log(banner)
            $scope.toast('没有链接');
            return
            if (!banner.link || !banner.link.length) {
                $scope.toast('没有链接');
                return;
            }

            // $window.location.href = banner.link;
        }

        function _touchNotice(notice) {
            var url = '';
            if (notice.url.indexOf("http://", 0) == -1) {
                url = "http://" + notice.url;
            } else {
                url = notice.url;
            }
            $window.location.href = url;
        }

        function _touchGroup(group) {
            $state.go('home', {

            });
        }

        function _touchCategory(category) {
            $state.go('search-result', {
                sortKey: ENUM.SORT_KEY.DEFAULT,
                sortValue: ENUM.SORT_VALUE.DEFAULT,

                keyword: null,
                category: category.id,

                navTitle: category.name,
                navStyle: 'default'
            });

        }

        function _touchProduct(product) {
        	// var url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/product?product=' + product.id;
        	// return url;
        	// window.location.href = url;
            $state.go('product', {
                product: product.id,
            });
        }

        function _reloadBanners() {
            API.banner
                .list({
                    page: 1,
                    per_page: MAX_BANNERS
                })
                .then(function(banners) {
                    $scope.banners = banners;
                    var timer = $timeout(function() {
                        $scope.bannerSwiper = new Swiper('.home-banner', {
                            pagination: '.swiper-pagination',
                            paginationClickable: true,
                            spaceBetween: 300,
                            centeredSlides: true,
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            loop: true,
                        });
                    }, 1);
                });
        }

        function _formatUrl(url) {
            var timestamp = Math.round(new Date().getTime() / 1000);

            if (-1 == url.indexOf('?')) {

                return url + '?v=' + timestamp;
            } else {
                return url + '&v=' + timestamp;
            }
        }

        $scope.refreshCode = function() {

            var timestamp = Math.round(new Date().getTime() / 1000);

        }

        function _reloadNotices() {
            API.notice
                .list({
                    page: 1,
                    per_page: MAX_NOTICES
                })
                .then(function(notices) {
                    $scope.notices = notices;
                    var timer = $timeout(function() {
                        new Swiper('.notice-slide', {
                            spaceBetween: 30,
                            centeredSlides: true,
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            direction: 'vertical',
                            loop: true
                        });
                    }, 1);
                });

                // $scope.newslist=["1经纪人同行加入房田，马上换福利","2同行加入房田，马上换福利","3加入房田，马上换福利","42323"]
                // $scope.autoScroll = function(obj){  
                // 		$(obj).find("ul").animate({  
                // 			marginTop : "-20px"  
                // 		},500,function(){  
                // 			$(this).css({marginTop : "0px"}).find("li:first").appendTo(this);  
                // 			})  
                // 		}  

                // $interval(function(){
                // 		$scope.autoScroll(".minerool")
                // },2000)
        }

        function _reloadCategories() {
            API.category
                .list({
                    page: 1,
                    per_page: MAX_CATEGORIES
                })
                .then(function(categories) {
                    $scope.categories = categories;
                });
        }

        function _reloadEditorChoice() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.POPULAR,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.editorChoice = products;
                });
        }

        function _reloadTopSale() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.SALE,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.topSale = products;
                });
        }

        function _reloadNewArrival() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.DATE,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.newArrival = products;
                });
        }

        function _reloadHomeList() {
            API.product
                .homeList()
                .then(function(data) {
                    $scope.newArrival = data.recently_products;
                    $scope.topSale = data.hot_products;
                    $scope.editorChoice = data.good_products;
                });
        }

        function _reload() {
            _reloadBanners();
            _reloadNotices();
            _reloadHomeList();

            // ConfigModel.fetch();
            //  ConfigModel.fetchWeChat().then(function(config) {
            //         if(config){
            //             var wechat = config['wechat.web'];
            //             if (wechat && CONSTANTS.FOR_WEIXIN && !AppAuthenticationService.getOpenId()) {
            //                 if ($rootScope.isWeixin()) {
            //                     $state.go('wechat-authbase', {});
            //                     return;
            //                 }
            //             }
            //             else{
            //                 _initShared(config);
            //             }
            //         }
            //
            //         return true;
            //     });

            $scope.cartModel.reloadIfNeeded();

        }

        function _loadMore() {
            // TODO:
        }


        function _initConfig(wechat, url) {

            if (!wechat) {
                return;
            };

            wx.config({
                debug: GLOBAL_CONFIG.DEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wechat.app_id, // 必填，公众号的唯一标识
                timestamp: wechat.timestamp, // 必填，生成签名的时间戳
                nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
                signature: wechat.signature, // 必填，签名，见附录1
                jsApiList: ['chooseWXPay',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ'
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            var shared_link = url;

            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: '推荐分成', // 分享标题
                    desc: '',
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: '推荐分成', // 分享标题
                    desc: '',
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareQQ({
                    title: '推荐分成', // 分享标题
                    desc: '', // 分享描述
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareWeibo({
                    title: '推荐分成', // 分享标题
                    desc: '', // 分享描述
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

            });

            wx.error(function(res) {
                if (GLOBAL_CONFIG.DEBUG) {
                    $rootScope.toast(JSON.stringify(res));
                }
            });

        }

        function _initShared(config) {

            if (!AppAuthenticationService.getToken()) {
                if(config){
                    var wechat = config['wechat.web'];
                    if(wechat){
                        var callbackUrl = $window.location.protocol+"//"+$window.location.host+$window.location.pathname;
                      _initConfig(wechat,callbackUrl);
                    }
                }
                return;
            }
            API.bonus.get().then(function(bonus_info) {
                if(config){
                    var wechat = config['wechat.web'];
                    if(wechat){
                      _initConfig(wechat,bonus_info.shared_link);
                    }
                }
                return true;
            });
        }

        _reload();
    }

})();
