(function () {

	'use strict';

	angular
		.module('app')
		.controller('homemenuListController', homemenuListController);

	homemenuListController.$inject = ['$scope', '$http', '$location', '$state','$stateParams', 'API', 'ENUM', 'CartModel'];

	function homemenuListController($scope, $http, $location, $state,$stateParams, API, ENUM, CartModel) {

		var PER_PAGE = 1000;

		$scope.categories = [];
		$scope.selectedSide = null;

		$scope.touchSearch = _touchSearch;
		$scope.touchSide = _touchSide;
		$scope.touchMain = _touchMain;

		$scope.cartModel = CartModel;

		function _touchSearch() {
			$state.go('search', {});
		}

		function _touchSide(side) {
			$scope.selectedSide = side;
			$scope.subCategories = side.categories;
		}

		function _touchMain(main) {
			if (!main) {

				var side = $scope.selectedSide;

				$state.go('search-result', {
					sortKey: ENUM.SORT_KEY.DEFAULT,
					sortValue: ENUM.SORT_VALUE.DEFAULT,
					keyword: null,
					category: side.id,
					navTitle: side.name,
					title:    side.name,
					navStyle: 'default'
				});

			} else {

				$state.go('search-result', {
					sortKey: ENUM.SORT_KEY.DEFAULT,
					sortValue: ENUM.SORT_VALUE.DEFAULT,

					keyword: null,
					category: main.id,
					title:    main.name,
					navTitle: main.name,
					navStyle: 'default'
				});

			}
		}

		function _reloadCategories() {
			API.category
				.list({
					page: 1,
					per_page: PER_PAGE
				})
				.then(function (categories) {
					if (categories && categories.length) {
						$scope.categories = categories;
						$scope.selectedSide = categories[0];
						$scope.subCategories = categories[0].categories;
					} else {
						$scope.categories = null;
						$scope.selectedSide = null;
						$scope.subCategories = null;
					}
				});
		}

		function _reload() {
			_reloadCategories();
		}

		_reload();
		
		
		$scope.navTitle=$stateParams.type;
		
		$scope.testData= [
        {
            name:'香蕉'
        },
        {
            name:'菠萝'
        },
        {
            name:'梨子'
        },
        {
            name:'火龙果'
        },
        {
            name:'榴莲'
        },
        {
            name:'猕猴桃'
        },
        {
            name:'葡萄'
        },
        {
            name:'樱桃'
        },
        {
            name:'椰子'
        },
        {
            name:'芒果'
        },
        {
            name:'桂圆'
        },
        {
            name:'桑葚'
        }
    ]
		$scope.dataCallback = function () {
        console.log('callback has run.');
        // 筛选数据，只会输出选中的数据
        /* console.log('第一组数据：');
        console.log(ngScreening.getChecked($scope.data.g1));
        console.log('第二组数据：');
        console.log(ngScreening.getChecked($scope.data.g2)); */

        // 输出数据
        // console.log($scope.data);

        // 输出ui-select数据
        // console.log($scope.selected);

        // 利用数据控制筛选器的联动逻辑
        // console.log('吃了梨子就不能吃苹果 !!');
        // $scope.data.g2[1].isHidden = $scope.data.g1[2].isChecked

    }
		
		
	}
	
	
})();