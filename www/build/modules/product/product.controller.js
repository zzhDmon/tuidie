(function () {

  'use strict';

  angular
  .module('app')
  .controller('ProductController', ProductController);

  ProductController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'AppAuthenticationService', 'ConfirmProductService', 'CartModel','ConfigModel'];

  function ProductController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, AppAuthenticationService, ConfirmProductService, CartModel,ConfigModel) {

      var MAX_COMMENTS = 3;
      var productId = $stateParams.product;

      $scope.currentStock = null; //当前库存
      $scope.currentAttrs = [];   //单选属性
      $scope.currentSelectedPrice = 0;   //单选属性
      $scope.input = {
          currentAmount: 1
      };

      $scope.optionalAttrs = []; //多选属性
      $scope.canPurchase = false;//是否可以购买

      $scope.product = null;
      $scope.comments = [];

      $scope.cartModel = CartModel;

      $scope.touchAmountSub = _touchAmountSub;
      $scope.touchAmountAdd = _touchAmountAdd;
      $scope.touchAttr = _touchAttr;
      $scope.touchLike = _touchLike;
      $scope.touchComments = _touchComments;
      $scope.touchComment = _touchComment;
      $scope.touchCart = _touchCart;
      $scope.touchAddCart = _touchAddCart;
      $scope.touchPurchase = _touchPurchase;
      $scope.refreshAmount = _refreshAmount;


      $scope.formatGrade = _formatGrade;
      $scope.isAttrSelected = _isAttrSelected;

      $scope.isLoading = false;
      $scope.isLoaded = false;

      function _touchAmountSub() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;
        }

        var amount = parseInt($scope.input.currentAmount);
        if ( amount <= 1 ){
            $scope.toast('受不了了，宝贝不能再少了');
            return;
        }

          $scope.input.currentAmount = (amount - 1);
      }

      function _refreshAmount(){

          var amount = parseInt($scope.input.currentAmount);

          var stock = parseInt($scope.currentStock.stock_number);

          if ( amount > stock ) {
            $scope.toast('达到最大库存');
            $scope.input.currentAmount = stock;
          }

          if (amount < 1) {
              $scope.input.currentAmount = 1;
          }

      }

      function _touchAmountAdd() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;

          var amount = parseInt($scope.input.currentAmount);
          var stock = parseInt($scope.currentStock.stock_number);
          if ( amount >= stock ) {
            $scope.toast('达到最大库存');
            return;
          } else {
            $scope.input.currentAmount = (amount + 1);
          }
        } else {
          var amount = parseInt($scope.input.currentAmount);
          var stock = $scope.product.good_stock;
          if ( amount >= stock )
            return;

            $scope.input.currentAmount =  (amount + 1);
        }

      }

      function _touchComments() {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchComment( comment ) {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchCart() {

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        $state.go('cart-select', {});
      }

      function _touchLike(){

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        if ( $scope.product.is_liked ) {
            $scope.product.is_liked = false;
            API.product
            .unlike({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('取消收藏');
            }, function(error){
              $scope.product.is_liked = true;
            });
        } else {
            $scope.product.is_liked = true;
            API.product
            .like({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('收藏成功');
            }, function(error){
              $scope.product.is_liked = false;
            });
        }
      }

      function _touchAddCart() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = Number($scope.input.currentAmount);

        CartModel
        .add(productId, attrs, amount)
        .then(function(succeed){
            if ( succeed ) {
              $scope.toast('已添加到购物车');
            }
        });
      }

      function _touchPurchase() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var product = $scope.product;
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = Number($scope.input.currentAmount);

        ConfirmProductService.clear();
        ConfirmProductService.product = product;
        ConfirmProductService.attrs = attrs;
        ConfirmProductService.amount = amount;

        $state.go('confirm-product', {});
      }

      function _refreshPrice(){
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);

          $scope.currentSelectedPrice = parseFloat($scope.product.current_price);

          for ( var i = 0; i < $scope.product.properties.length; ++i ) {
            var property = $scope.product.properties[i];
            
            for ( var j in property.attrs ) {              
                var index = attrs.indexOf( property.attrs[j].id );
                if ( -1 != index && property.attrs[j].attr_price)  {
                    $scope.currentSelectedPrice += parseFloat(property.attrs[j].attr_price);
                }              
            }
          }
      }

      function _checkCanPurchase() {
        var product = $scope.product;
        var required = false;

        if ( !product || !product.good_stock )
          return false;

        for ( var i in  product.properties ) {
          if ( !product.properties[i].is_multiselect ) {
            required = true;
            break;
          }
        }

        if ( required ) {
          if ( !$scope.currentAttrs || !$scope.currentAttrs.length ) {
            return false;
          }

          if ( !getStockWithStockIdS([].concat($scope.currentAttrs)) ) {
            return false;
          }

          if ( !$scope.currentStock ) {
            return false;
          }
        }

        return true;
      }

      function _formatGrade( grade ) {
        if ( ENUM.REVIEW_GRADE.BAD == grade ) {
          return '差评';
        } else if ( ENUM.REVIEW_GRADE.MEDIUM == grade ) {
          return '中评';
        } else if ( ENUM.REVIEW_GRADE.GOOD == grade ) {
          return '好评';
        }
        return '中评';
      }

      function _isAttrSelected( attr ) {
        if ( attr.is_multiselect ) {
          return $scope.optionalAttrs.indexOf(attr.id) == -1 ? "unSelected" : "selected";
        } else {
          return $scope.currentAttrs.indexOf(attr.id) == -1 ? "unSelected" : "selected";
        }
      }

      // 使用attrid和别的属性组合，来判断是否存在库存
      function isExistenceStockNumWithAttrIs(attrId) {
        // 把当前的属性id和其它子属性id组合起来，如果在组合库存中没有的话，那么就是不可以点击的
        // 得到当前子属性的父属性所在下标，然后在组合的时候，忽略这个父属性
        var ignoreIndex = getSupViewIndexWithAttrId(attrId);

        for (var i = 0; i < $scope.product.properties.length; i++) {
          if ( i == ignoreIndex ) {
            // 判断是否只是存在一个父属性，如果是的话，那么就不需要组合，单单只是用当前属性去组合中查找即可
            if ( $scope.product.properties.length == 1 ) {
              // 直接去判断
              // 用这个组合的数组 去组合库存中查找到对应的匹配
              if ( getStockWithStockIdS([attrId]) ) {
                return true;
              } else {
                return false;
              }
            } else {
              // 忽略
            }
          } else {
            var propertie = $scope.product.properties[i];
            for (var j = 0; j < propertie.attrs.length; j++) {
              var verifications = [];
              var attrs = propertie.attrs[j];
              // 用循环出的子属性id和当前的子属性id组合  然后去组合库存中找
              verifications.push(attrs.id);
              verifications.push(attrId);

              // 用这个组合的数组 去组合库存中查找到对应的匹配
              if ( getStockWithStockIdS(verifications) ) {
                return true;
              }
            }
          }
        }

        return false;
      }

      // 根据子属性id 得到父亲属性所在下标
      function getSupViewIndexWithAttrId(attrId) {
        for (var i = 0; i < $scope.product.properties.length; i++) {
          var propertie = $scope.product.properties[i];
          for (var j = 0; j < propertie.attrs.length; j++) {
            var currentAttr = propertie.attrs[j];
            if ( attrId == currentAttr.id ) {
              return i;
            }
          }
        }

        return 0;
      }

      // 根据组合id得到所在组合对象是否存在库存
      function getStockWithStockIdS(items) {
        for (var i = 0; i < $scope.product.stock.length; i++) {
          var stock = $scope.product.stock[i];
          var stocks = stock.goods_attr.split("|");

          stocks.sort(function(a, b){
            return a - b;
          })

          // 把items中的元素变为基本类型
          for (var j = 0; j < items.length; j++) {
            var item = items[j];
            items[j] = item.toString();
          }

          items.sort(function(a, b){
            return a - b;
          })

          // 查找stocks是否包含items，如果包含，那么就可以获取到stock，然后判断是否存在库存
          // isContained(stocks, items)
          // items.toString() == stocks.toString()
          if ( isContained(stocks, items) ) {
            // 相同时候看下是否有库存
            if ( stock.stock_number > 0 ) {
              return true;
            }
          }
        }

        return false;
      }

      // 数据更新 在获取商品和选中的属性变化的时候调用
      function reloadAttrsStatus(attrId) {
        // 先判断每个子属性是否存在于组合库存中，如果不存在，那么就统一设置为不可以点击
        for (var i = 0; i < $scope.product.properties.length; i++) {
          var properties = $scope.product.properties[i];
          for (var j = 0; j < properties.attrs.length; j++) {
            var attr = properties.attrs[j];
            // 判断当前是否存在于组合库存中
            if ( getStockWithStockIdS([attr.id]) ) {
              attr.isClick = true;
            }
          }
        }

        // 设置当前已经选中的属性未选中状态
        for (var i = 0; i < $scope.product.properties.length; i++) {
          var properties = $scope.product.properties[i];
          for (var j = 0; j < properties.attrs.length; j++) {
            var attr = properties.attrs[j];
            if ( $scope.currentAttrs.indexOf(attr.id) == -1 ) {
              attr.isSelected = false;
            } else {
              attr.isSelected = true;
            }
          }
        }

        // 使用未选中的
      }

      function isContained(a, b) {
        if(a.length < b.length) return false;
        for( var i = 0, len = b.length; i < len; i++ ) {
          if(a.indexOf(b[i]) == -1) return false;
        }
        return true;
      }

      function _touchAttr( property, attr ) {
        if ( !$scope.product )
          return;

        var product = $scope.product;

        if ( attr.is_multiselect ) {
          var attrs = [].concat( $scope.optionalAttrs );
          var index = attrs.indexOf( attr.id );
          if ( -1 == index ) {
            attrs.push( attr.id );
        } else {
            attrs.splice( index, 1 );
          }
          $scope.optionalAttrs = attrs;
          _refreshPrice();
        } else {
          var stock = null;
          var attrs = [].concat( $scope.currentAttrs );

          var index = attrs.indexOf( attr.id );

          // 删除attrs内与当前选中子属性同在一个父属性的的子属性，然后加上当前选中的这个子属性
          for ( var i in property.attrs ) {
            if ( property.attrs[i].id != attr.id ) {
              var index = attrs.indexOf( property.attrs[i].id );
              if ( -1 != index ) {
                attrs.splice( index, 1 );
              }
            }
          }

          attrs.push( attr.id );

          attrs = attrs.filter(function( attr, index, self ){
            return self.indexOf(attr) === index;
          });

          attrs.sort(function(a, b){
            return a - b;
          })

          if ( attrs.length ) {
            var key = attrs.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {
              var goods_attr = product.stock[i].goods_attr;
              var goods_attr_array =  goods_attr.split("|");

              goods_attr_array.sort(function(a, b){
                return a - b;
              })

              var goods_attr_str = goods_attr_array.join('|');

              if ( goods_attr_str == key ) {
                stock = product.stock[i];
                break;
              }
            }
          }

          $scope.currentAttrs = attrs;
          $scope.currentStock = stock;
          $scope.canPurchase = _checkCanPurchase();
          _refreshPrice();
        }
      }

      function _reloadProduct() {
        $scope.isLoading = true;

        API.product
        .get({product:productId})
        .then(function(product){

        product.properties.sort(function(a, b){
            return a.is_multiselect - b.is_multiselect;
          })

          $scope.product = product;
          $scope.isLoaded = true;
          $scope.isLoading = false;
          $scope.canPurchase = _checkCanPurchase();
      
          ConfigModel.fetchWeChat().then(function(config){
            
            if(config){
                var wechat = config['wechat.web'];
                if(wechat){
                  _initConfig(wechat,$scope.product);  
                }                
            }
          });                    
         

          if ( product.photos && product.photos.length > 1 ) {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 1500,
                    autoplayDisableOnInteraction: false,
                    loop: true
                });
            }, 1 );
          } else {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: false,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 0,
                    autoplayDisableOnInteraction: false,
                    loop: false
                });
            }, 1 );
          }

          var defaultAttrIds = [];
          var defaultAttrStock = null;

          // 获取第一个存在库存的属性组合
          for (var i = 0; i < product.stock.length; i++) {
            var stock = product.stock[i];
            if ( stock.stock_number > 0 ) {
              var items = stock.goods_attr.split("|");;

              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                defaultAttrIds.push(parseInt(item));
          }

          defaultAttrIds.sort(function(a, b){
            return a - b;
          })

              break;
            }
          }

          if ( defaultAttrIds.length ) {
            var stockSelector = defaultAttrIds.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {

              var goods_attr = product.stock[i].goods_attr;
              var goods_attr_array =  goods_attr.split("|");

              goods_attr_array.sort(function(a, b){
                return a - b;
              })

             var goods_attr_str = goods_attr_array.join('|');
              if ( goods_attr_str == stockSelector ) {
                defaultAttrStock = product.stock[i];
                break;
              }
            }
          }
          

          $scope.currentAttrs = defaultAttrIds;
          $scope.currentStock = defaultAttrStock;
          $scope.canPurchase = _checkCanPurchase();
          _refreshPrice();
          _reloadComments();
        });
      }

      function _initConfig(wechat,product){

                if ( !wechat ) {
                    return;
                };
                var url = product.share_url?product.share_url:product.share_link;
                wx.config({
                    debug: GLOBAL_CONFIG.DEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechat.app_id, // 必填，公众号的唯一标识
                    timestamp: wechat.timestamp, // 必填，生成签名的时间戳
                    nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
                    signature: wechat.signature,// 必填，签名，见附录1
                    jsApiList: ['chooseWXPay',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready( function() {
                    wx.onMenuShareTimeline({
                        title: '商品详情', // 分享标题
                        desc:product.name,
                        link: url, // 分享链接
                        imgUrl: product.default_photo.large, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: '商品详情', // 分享标题
                        desc:product.name,
                        link: url, // 分享链接
                        imgUrl: product.default_photo.large, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: '商品详情', // 分享标题
                        desc:product.name,
                        link: url, // 分享链接
                        imgUrl: product.default_photo.large, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareWeibo({
                          title: '商品详情', // 分享标题
                        desc:product.name,
                        link: url, // 分享链接
                        imgUrl: product.default_photo.large, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                });

                wx.error(function(res){
                    if(GLOBAL_CONFIG.DEBUG){
                        $rootScope.toast(JSON.stringify(res));
                    }
                });

      }

      function _reloadComments() {
        if ( !$scope.product )
          return;

        API.review
        .productList({
            product:productId,
            grade:ENUM.REVIEW_GRADE.ALL,
            page:1,
            per_page:MAX_COMMENTS
        }).then(function(comments){
            $scope.comments = comments;
        });
      }

      function _reload() {
        _reloadProduct();
      }

      _reload();
      
  }

})();
