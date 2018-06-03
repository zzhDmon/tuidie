(function () {

	'use strict';

	angular
		.module('app')
		.controller('homemenuListController', homemenuListController);

	homemenuListController.$inject = ['$scope', '$http', '$location','homeMenuListResultModel', '$state','$stateParams', 'API', 'ENUM', 'CartModel'];

	function homemenuListController($scope, $http, $location,homeMenuListResultModel, $state,$stateParams, API, ENUM, CartModel) {
		var PER_PAGE = 10;


        $scope.currentSortKey =  ENUM.SORT_KEY.DEFAULT;
        $scope.currentSortValue =  ENUM.SORT_KEY.DESC || 0;
        $scope.currentKeyword = $stateParams.type ? $stateParams.type : null;
    


        $scope.products = null;

        $scope.touchSearch = _touchSearch;
        $scope.touchSortDefault = _touchSortDefault;
        $scope.touchSortSale = _touchSortSale;
        $scope.touchSortDate = _touchSortDate;
        $scope.touchSortPrice = _touchSortPrice;
        $scope.touchSortCredit = _touchSortCredit;
        $scope.touchProduct = _touchProduct;
        $scope.loadMore = _loadMore;

        $scope.isEmpty = false;
        $scope.isLoaded = false;
        $scope.isLoading = false;
        $scope.isLastPage = false;


        if (homeMenuListResultModel.height) {
            $('html, body').animate({ //添加animate动画效果 
                scrollTop: homeMenuListResultModel.height
            }, 500);
        }

        function _touchSearch() {
            _reload();
        }

        function _touchSortDefault() {
            var key = ENUM.SORT_KEY.DEFAULT;
            var val = ENUM.SORT_VALUE.DEFAULT;
            if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
                $scope.currentSortKey = key;
                $scope.currentSortValue = val;
                _reload();
            }
        }

        function _touchSortSale() {
            var key = ENUM.SORT_KEY.SALE;
            var val = ENUM.SORT_VALUE.DESC;
            if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
                $scope.currentSortKey = key;
                $scope.currentSortValue = val;
                _reload();
            }
        }

        function _touchSortDate() {
            var key = ENUM.SORT_KEY.DATE;
            var val = ENUM.SORT_VALUE.DESC;
            if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
                $scope.currentSortKey = key;
                $scope.currentSortValue = val;
                _reload();
            }
        }

        function _touchSortPrice(value) {
            var key = ENUM.SORT_KEY.PRICE;
            
            $scope.currentSortKey = key;
            $scope.currentSortValue = value;
            _reload();
        }

        function _touchSortCredit() {
            var key = ENUM.SORT_KEY.CREDIT;
            var val = ENUM.SORT_VALUE.DESC;
            if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
                $scope.currentSortKey = key;
                $scope.currentSortValue = val;
                _reload();
            }
        }

        function _touchProduct(product) {
            $state.go('product', {
            	product: product.id
            });
        }

        function _reload() {
            if ($scope.isLoading)
                return;

            $scope.products = null;
            $scope.isEmpty = false;
            $scope.isLoaded = false;

            _fetch(1, PER_PAGE);
        }

        function _loadMore() {
            if ($scope.isLoading)
                return;
            if ($scope.isLastPage)
                return;

            if ($scope.products && $scope.products.length) {
            	if($scope.products.length%10){
            		return;
            	}
                _fetch(($scope.products.length / PER_PAGE) + 1, PER_PAGE);
            } else {
                _fetch(1, PER_PAGE);
            }
        }

        function _fetch(page, perPage) {
            $scope.isLoading = true;

            var params = {};

            if ($scope.currentCategory) {
                params.category = $scope.currentCategory;
            }

            if ($scope.currentKeyword) {
                params.keyword = $scope.currentKeyword;
            }

            params.sort_key = $scope.currentSortKey;
            params.sort_value = $scope.currentSortValue;
            params.page = page;
            params.per_page = perPage;

            API.product.list(params).then(function(products) {
            	
                $scope.products = $scope.products ? $scope.products.concat(products) : products;
                $scope.isEmpty = ($scope.products && $scope.products.length) ? false : true;
                $scope.isLoaded = true;
                $scope.isLoading = false;
                $scope.isLastPage = (products && products.length < perPage) ? !$scope.isEmpty : false;
            });
        }

        _reload();
		
		
		$scope.closeSort=function(){
			$('.tuidie-homemenu-list .under-navbar .sort-list').removeClass('active')
			$('.tuidie-homemenu-list .under-navbar .flex-sort').removeClass('active')
		}
		$scope.toggleSort=function(){
			$('.tuidie-homemenu-list .under-navbar .sort-list').toggleClass('active')
			$('.tuidie-homemenu-list .under-navbar .flex-sort').toggleClass('active')
			$scope.closeFilter();
		}
		

		$scope.closeFilter=function(){
			$('.tuidie-homemenu-list .under-navbar .filter-list').removeClass('active')
			$('.tuidie-homemenu-list .under-navbar .flex-filter').removeClass('active')
		}
		$scope.toggleFilter=function(){
			$('.tuidie-homemenu-list .under-navbar .filter-list').toggleClass('active')
			$('.tuidie-homemenu-list .under-navbar .flex-filter').toggleClass('active')
			$scope.closeSort();
		}
		
		
		
	}
	
	
})();